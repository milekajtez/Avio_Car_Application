﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.discounts;
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
        #endregion

        #region 5 - Metoda za menjanje sifre administratora na osnovu username-a
        // TO DO
        #endregion
    }
}
