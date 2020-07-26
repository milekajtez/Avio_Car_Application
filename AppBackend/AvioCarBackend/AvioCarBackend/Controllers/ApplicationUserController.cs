using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.register_and_login;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private UserManager<RegisteredUser> _userManager;
        private SignInManager<RegisteredUser> _signInManager;
        private readonly ApplicationSettings _appSettings;
        private readonly MailSettings _mailSettings;

        /* private readonly IdentityDbContext _context;*/


        public ApplicationUserController(UserManager<RegisteredUser> userManager,
            SignInManager<RegisteredUser> signInManager, IOptions<ApplicationSettings> appSettings,
            IOptions<MailSettings> mailSettings/*, IdentityDbContext context*/)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
            _mailSettings = mailSettings.Value;

            //_context = context;
        }

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
                    IsFirstReservation = true
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


        // PUT api/ApplicationUser/RegisterConfirm
        [HttpPost]
        [Route("RegisterConfirm")]
        public async Task<Object> PostConfirmUser(RegisteredUserModel model) 
        {
            var resultFind = await _userManager.FindByIdAsync(model.Jmbg.ToString());
            if (resultFind != null)
            {
                resultFind.IsFirstReservation = false;
                try
                {
                    var result = await _userManager.UpdateAsync(resultFind);
                    return Ok(result);

                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            return NotFound();
        }
    }    
}
