using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.register_and_login;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private readonly UserManager<RegisteredUser> _userManager;
        private readonly SignInManager<RegisteredUser> _signInManager;
        private readonly ApplicationSettings _appSettings;
        private readonly MailSettings _mailSettings;
        private const string GoogleApiTokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}";

        public ApplicationUserController(UserManager<RegisteredUser> userManager,
            SignInManager<RegisteredUser> signInManager, IOptions<ApplicationSettings> appSettings,
            IOptions<MailSettings> mailSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _mailSettings = mailSettings.Value;
        }
        
        #region 1 - Metoda za registraciju novog korisnika
        [HttpPost]
        [Route("Register")]
        //POST : /api/ApplicationUser/Register
        public async Task<Object> PostApplicationUser(RegisteredUserModel model)
        {
            // provera da korisnik ne unese username glavnog admina i sprecim da imam vise korisnika sa istim username-om
            if (model.UserName.Equals("mainAdmin") || await _userManager.FindByNameAsync(model.UserName) != null) 
            {
                // jedinstveni identifikator korisnika je jmbg, ali ce mi biti dosta zgodnije da web aplikacija podrzava
                // korisnike koji svi imaju razlicit username
                return BadRequest(new { message = "Username is incorrect or has already been reserved." });
            }

            var resultFind = await _userManager.FindByIdAsync(model.Jmbg.ToString());
            if (resultFind == null) 
            {
                var registeredUser = new RegisteredUser()
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Id = model.Jmbg,
                    City = model.City,
                    PhoneNumber = model.Telephone,
                    NumberOfPassport = model.Passport,
                    IsNewReservation = true
                };

                try
                {
                    var result = await _userManager.CreateAsync(registeredUser, model.Password);
                    await SendEmailAsync(model.Email, model.Telephone);
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return BadRequest(new { message = "Registration unsuccessfully. Please enter different jmbg." });
            }
        }
        #endregion
        #region 2 - Metoda za slanje mejla
        public async Task SendEmailAsync(string mailID, string telephone)
        {
            MailMessage message = new MailMessage();
            SmtpClient smtp = new SmtpClient();
            message.From = new MailAddress(_mailSettings.Mail, _mailSettings.DisplayName);
            message.To.Add(new MailAddress(mailID));
            message.Subject = "Confirm registration";
            message.Priority = MailPriority.Normal;

            message.IsBodyHtml = false;
            message.Body = "You successful registred on AvioCarReservation" +
                "If you telephone number is '" + telephone.ToString() + "', please confirm registration on this link:" +
                "http://localhost:4200/registrationConfirm";
            smtp.Port = _mailSettings.Port;
            smtp.Host = _mailSettings.Host;
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(_mailSettings.Mail, _mailSettings.Password);
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            await smtp.SendMailAsync(message);
        }
        #endregion
        #region 3 - Metoda za izmenu korisnika pri potvrdi registracije
        [HttpPost]
        [Route("RegisterConfirm")]
        //POST : /api/ApplicationUser/RegisterConfirm
        public async Task<Object> PostConfirmUser(RegisteredUserModel model) 
        {
            var resultFind = await _userManager.FindByIdAsync(model.Jmbg.ToString());
            if (resultFind != null)
            {
                resultFind.IsNewReservation = false;
                try
                {
                    var result = await _userManager.UpdateAsync(resultFind);

                    /*
                        Kada sam izvrsio update novog korisnika tj potvrdio rezervaciju preko mejla,
                        ubacujem odredjene informacije o samom korisniku (UserID kao i njegovu vrstu tj ulogu u sistemu).
                        Takodje ubacujem i podatke u tabelu koja predsatvlja vezu korisnika sa svojom ulogom u sistemu.
                        Pri logovanju, korisniku se dodeljuje token. Ono sto ce se odraditi jeste da ce se napraviti claim-ovi
                        u kojima ce biti informacije koje ce se izvlaciti iz spomenutih tabela i tako kreirani claim-ovi
                        ce se ubacii u token. Na taj nacin cemo u tokenu imati informcije od interesa o korisniku.
                        Ukoliko token instekne, korisnik se ponovo loguje i ponovo dobija novi token, a postupak
                        kreirnja claim-ova se ponavlja.
                     */

                    await _userManager.AddClaimAsync(resultFind, new Claim(ClaimTypes.Role, "regular_user"));
                    await _userManager.AddClaimAsync(resultFind, new Claim(ClaimTypes.PrimarySid, resultFind.Id));

                    await _userManager.AddToRoleAsync(resultFind, "regular_user");

                    return Ok(result);

                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            return NotFound();
        }
        #endregion
        #region 4 - Metoda za obicno logovanje regularnog korisnika
        [HttpPost]
        [Route("Login")]
        //POST : /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password) && user.IsNewReservation == false)
            {
                // ucitavanje svih claim-ove za trenutno korisnika koji se loguje
                var claims = await _userManager.GetClaimsAsync(user);

                // dodavanje claima koji ce sluziti kao informacija da li se administrator vec prvi put ulogovao
                claims.Add(new Claim("FirstLogin", user.FirstLogin.ToString()));

                //pravimo tooke i dodeljujemo ga korisniku
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
            {
                return BadRequest(new { message = "Username or password is incorrect or user not confirmed registration with mail" });
            }
        }
        #endregion
        #region 5 - Metoda za logovanje preko drustvene mreze
        [AllowAnonymous]
        [HttpPost]
        [Route("SocialLogin")]
        public IActionResult SocialLogin([FromBody] LoginModel loginModel)
        {
            var test = _appSettings.JWT_Secret;

            if (VerifyToken(loginModel.IdToken))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    //Key min: 16 characters
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature),
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Role, "regular_user"),
                        new Claim(ClaimTypes.PrimarySid, loginModel.Id)
                    }),
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                return Ok(new { token });
            }

            return Ok();
        }
        #endregion
        #region 6 - Metoda za validaciju tokena
        public bool VerifyToken(string providerToken) 
        {
            var httpClient = new HttpClient();
            var requestUri = new Uri(string.Format(GoogleApiTokenInfoUrl, providerToken));

            HttpResponseMessage httpResponseMessage;

            try
            {
                httpResponseMessage = httpClient.GetAsync(requestUri).Result;
            }
            catch 
            {
                return false;
            }

            if (httpResponseMessage.StatusCode != HttpStatusCode.OK)
            {
                return false;
            }

            var response = httpResponseMessage.Content.ReadAsStringAsync().Result;
            var googleApiTokenInfo = JsonConvert.DeserializeObject<GoogleApiTokenInfo>(response);

            return true;
        }
        #endregion
        #region 7 - Metoda za registraciju administratora
        [HttpPost]
        [Route("AdminRegistration")]
        //POST : /api/ApplicationUser/AdminRegistration
        public async Task<Object> PostRegistrationOfAdministrator(AdminModel model) 
        {
            // provera da korisnik ne unese username glavnog admina i sprecim da imam vise korisnika sa istim username-om
            if (model.Username.Equals("mainAdmin") || await _userManager.FindByNameAsync(model.Username) != null)
            {
                // jedinstveni identifikator korisnika je jmbg, ali ce mi biti dosta zgodnije da web aplikacija podrzava
                // korisnike koji svi imaju razlicit username
                return BadRequest(new { message = "Username is incorrect or has already been reserved" });
            }

            var resultFind = await _userManager.FindByIdAsync(model.Jmbg.ToString());
            if (resultFind == null) 
            {
                var registeredUser = new RegisteredUser()
                {
                    UserName = model.Username,
                    Email = model.Email,
                    Id = model.Jmbg,
                    PhoneNumber = model.Telephone,
                    FirstLogin = true,
                    IsNewReservation = false
                };

                var result = await _userManager.CreateAsync(registeredUser, model.Password);

                if (model.AdminType.Equals("avio"))
                {
                    await _userManager.AddClaimAsync(registeredUser, new Claim(ClaimTypes.Role, "avio_admin"));
                    await _userManager.AddClaimAsync(registeredUser, new Claim(ClaimTypes.PrimarySid, registeredUser.Id));

                    await _userManager.AddToRoleAsync(registeredUser, "avio_admin");
                }
                else
                {
                    await _userManager.AddClaimAsync(registeredUser, new Claim(ClaimTypes.Role, "car_admin"));
                    await _userManager.AddClaimAsync(registeredUser, new Claim(ClaimTypes.PrimarySid, registeredUser.Id));

                    await _userManager.AddToRoleAsync(registeredUser, "car_admin");
                }

                return Ok(result);
            }
            else
            {
                return NotFound("Registration unsuccessfully. Please enter different jmbg.");
            }
        }
        #endregion
        #region 8 - Metoda za izmenu FirstLogin-a i sifre pri prvom logovanju administratora
        [HttpPost]
        [Route("ChangeAdminPassword")]
        //POST : /api/ApplicationUser/ChangeAdminPassword
        public async Task<Object> PostFirstLoginChangePass(LoginModel model) 
        {
            var resultFind = await _userManager.FindByIdAsync(model.Id);
            if (resultFind != null)
            {
                resultFind.FirstLogin = false;
                var code = await _userManager.GeneratePasswordResetTokenAsync(resultFind);
                try
                {
                    var result = await _userManager.ResetPasswordAsync(resultFind, code, model.Password);
                    await _userManager.UpdateAsync(resultFind);
                    return Ok(result);
                }
                catch (Exception e) 
                {
                    throw e;
                }
            }
            else 
            {
                return BadRequest(new { message = "Server didn't find the logged admin." });
            }
        }
        #endregion
    }
}