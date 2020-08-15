using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.discounts;
using AvioCarBackend.Data.profile;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Internal.Account.Manage;
using Microsoft.AspNetCore.Mvc;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<RegisteredUser> _userManager;

        public LoadDataController(ApplicationDbContext context, UserManager<RegisteredUser> userManager) 
        {
            _context = context;
            _userManager = userManager;
        }

        #region 1 - Metoda za ucitavanje popusta
        [HttpGet]
        [Route("GetDiscounts")]
        public async Task<Object> GetDiscounts() 
        {
            try
            {
                var discounts = await _context.UserPointsDiscounts.FindAsync("discID");
                if (discounts == null) 
                {
                    return NotFound();
                }
                return discounts;
            }
            catch (Exception e) 
            {
                throw e;
            }
        }
        #endregion
        #region 2 - Metoda za menjanje odredjenog popusta
        [HttpPut]
        [Route("ChangeDiscount")]
        public async Task<Object> ChangeDiscount(DiscountModel model) 
        {
            var currentData = await _context.UserPointsDiscounts.FindAsync("discID");
            double newValue = int.Parse(model.Value);

            if (model.Type.Equals("plus"))
            {
                currentData.AvioPlusCarReservationDiscounts = newValue;
                _context.UserPointsDiscounts.Update(currentData);
                _context.SaveChanges();
                return Ok();
            }
            else if (model.Type.Equals("p300"))
            {
                if (newValue >= currentData.Dicount600)
                {
                    return BadRequest("Value of 'Percent 300 points' must be smaller than 'Percent 600 points'");
                }
                else 
                {
                    currentData.Dicount300 = newValue;
                    _context.UserPointsDiscounts.Update(currentData);
                    _context.SaveChanges();
                    return Ok();
                }
            }
            else if (model.Type.Equals("p600"))
            {
                if (newValue <= currentData.Dicount300 || newValue >= currentData.Dicount1200)
                {
                    return BadRequest("Value of 'Percent 600 points' must be beetwen 'Percent 300 points' and 'Percent 1200 points'");
                }
                else 
                {
                    currentData.Dicount600 = newValue;
                    _context.UserPointsDiscounts.Update(currentData);
                    _context.SaveChanges();
                    return Ok();
                }
            }
            else if (model.Type.Equals("p1200"))
            {
                if (newValue <= currentData.Dicount600)
                {
                    return BadRequest("Value of 'Percent 1200 points' must be bigger 'Percent 600 points'");
                }
                else 
                {
                    currentData.Dicount1200 = newValue;
                    _context.UserPointsDiscounts.Update(currentData);
                    _context.SaveChanges();
                    return Ok();
                }
            }
            else 
            {
                return BadRequest("Unknown error");
            }
        }
        #endregion
        #region 3 - Metoda za ucitavanjem trenutnog korisnika u zavisnosti od username-a
        [HttpGet]
        [Route("GetAvioAdmin/{username}")]
        public async Task<ActionResult<RegisteredUser>> GetAvioAdmin(string username) 
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) 
            {
                return NotFound("Korisnik nije pronadjen.");
            }

            return user;
        }
        #endregion
        #region 4 - Metoda za menjanje podataka administratora na onsovu username-a
        // TO DO
        //ChangeAdminProfile
        [HttpPut]
        [Route("ChangeAdminProfile")]
        public async Task<Object> ChangeAdminProfile(AvioAdminProfileModel model) 
        {
            var resultFind = await _userManager.FindByNameAsync(model.CurrentUsername);

            if (resultFind == null) 
            {
                return NotFound("Change unsucessfully. User is not registred.");
            }

            if (model.UserName == null && model.Email == null && model.PhoneNumber == null && model.FirstName == null &&
                model.LastName == null && model.City == null) 
            {
                return BadRequest("Change unsucessfully.You must enter new data in form.");
            }

            if (model.UserName != null && await _userManager.FindByNameAsync(model.UserName) != null && !model.UserName.Trim().Equals("")) 
            {
                return BadRequest("Change unsucessfully.Please input different username.");
            }

            resultFind.UserName = model.UserName.Equals("") || model.UserName.Trim().Equals("") ? resultFind.UserName : model.UserName;
            resultFind.Email = model.Email.Equals("") || model.Email.Trim().Equals("") ? resultFind.Email : model.Email;
            resultFind.PhoneNumber = model.PhoneNumber.Equals("") || model.PhoneNumber.Trim().Equals("") ? resultFind.PhoneNumber : model.PhoneNumber;
            resultFind.FirstName = model.FirstName.Equals("") || model.FirstName.Trim().Equals("") ? resultFind.FirstName : model.FirstName;
            resultFind.LastName = model.LastName.Equals("") || model.LastName.Trim().Equals("") ? resultFind.LastName : model.LastName;
            resultFind.City = model.City.Equals("") || model.City.Trim().Equals("") ? resultFind.City: model.City;

            try
            {
                await _userManager.UpdateAsync(resultFind);
                return Ok();
            }
            catch (Exception e) 
            {
                throw e;
            }
        }
        #endregion


        #region 5 - Metoda za menjanje sifre administratora na osnovu username-a
        // TO DO
        #endregion
    }
}
