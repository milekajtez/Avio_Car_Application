using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.register_and_login;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

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
                return NotFound("Registration unsuccessfully. Please enter different jmbg.");
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

                    await _userManager.AddClaimAsync(resultFind, new Claim("Role", "regular_user"));
                    await _userManager.AddClaimAsync(resultFind, new Claim("UserID", resultFind.Id));

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
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // ucitavanje svih claim-ove za trenutno korisnika koji se loguje
                var claims = await _userManager.GetClaimsAsync(user);

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
                return BadRequest(new { message = "Username or password is incorrect." });
        }
        #endregion
    }
}