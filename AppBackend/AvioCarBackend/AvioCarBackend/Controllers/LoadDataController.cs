using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.discounts;
using AvioCarBackend.Data.profile;
using AvioCarBackend.Data.register_and_login;
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

            resultFind.UserName = model.UserName == null || model.UserName.Trim().Equals("") ? resultFind.UserName : model.UserName;
            resultFind.Email = model.Email == null || model.Email.Trim().Equals("") ? resultFind.Email : model.Email;
            resultFind.PhoneNumber = model.PhoneNumber == null || model.PhoneNumber.Trim().Equals("") ? resultFind.PhoneNumber : model.PhoneNumber;
            resultFind.FirstName = model.FirstName == null || model.FirstName.Trim().Equals("") ? resultFind.FirstName : model.FirstName;
            resultFind.LastName = model.LastName == null || model.LastName.Trim().Equals("") ? resultFind.LastName : model.LastName;
            resultFind.City = model.City == null || model.City.Trim().Equals("") ? resultFind.City : model.City;

            try
            {
                await _userManager.UpdateAsync(resultFind);
                return Ok(new { message = resultFind.UserName });
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 5 - Metoda za menjanje sifre administratora na osnovu username-a
        [HttpPut]
        [Route("ChangePassword")]
        public async Task<Object> ChangePassword(ChangePasswordModel model)
        {
            var resultFind = await _userManager.FindByNameAsync(model.Username);
            if (resultFind != null)
            {
                if (await _userManager.CheckPasswordAsync(resultFind, model.CurrentPassword))
                {
                    var code = await _userManager.GeneratePasswordResetTokenAsync(resultFind);
                    try
                    {
                        var result = await _userManager.ResetPasswordAsync(resultFind, code, model.NewPassword);
                        await _userManager.UpdateAsync(resultFind);
                        return Ok();
                    }
                    catch (Exception e)
                    {
                        throw e;
                    }

                }
                else
                {
                    return BadRequest("Changing password is unsuccessfully. Please enter correct current password.");
                }
            }
            else
            {
                return BadRequest("Server didn't find the username. Changing password is unsuccessfully.");
            }
        }
        #endregion
        #region 6 - Metoda za ucitavanje aviokompanija
        [HttpGet]
        [Route("GetAirlines")]
        public IActionResult GetAirlines()
        {
            try
            {
                var airlines = _context.Airlines;
                if (airlines == null)
                {
                    return NotFound();
                }
                return Ok(airlines);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 7 - Metoda za dodavanje nove destinacije
        [HttpPost]
        [Route("AddDestination")]
        //POST : /api/LoadData/AddDestination
        public async Task<Object> AddDestination(DestinationModel model)
        {
            var airline = await _context.Airlines.FindAsync(int.Parse(model.AirlineID));
            if (airline != null)
            {
                Destination destination = new Destination()
                {
                    AirportName = model.AirportName,
                    City = model.City,
                    Country = model.Country,
                    Airline = airline
                };

                try
                {
                    var result = await _context.Destinations.AddAsync(destination);
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            else
            {
                return BadRequest("Add destination is unsuccessffully.Server not found selected airline.");
            }
        }
        #endregion
        #region 8 - Metoda za dodavanje novog leta
        [HttpPost]
        [Route("AddFlight")]
        //POST : /api/LoadData/AddFlight
        public async Task<Object> AddFlight(FlightModel model) 
        {
            var airline = await _context.Airlines.FindAsync(int.Parse(model.AirlineID));
            if (airline != null)
            {
                DateTime start = DateTime.Parse(model.StartTime);
                DateTime end = DateTime.Parse(model.EndTime);
                int resultTime = DateTime.Compare(start, end);

                if (resultTime == 0)
                {
                    return BadRequest("Add flight is unsuccessffully. You entered same time for start and end od flight.");
                }
                else if (resultTime > 0)
                {
                    return BadRequest("Add flight is unsuccessffully. Time of flight end is earlier than time of flight start.");
                }
                else 
                {
                    Flight flight = new Flight()
                    {
                        StartTime = DateTime.Parse(model.StartTime),
                        EndTime = DateTime.Parse(model.EndTime),
                        StartLocation = model.StartLocation,
                        EndLocation = model.EndLocation,
                        FlightTime = DateTime.Parse(model.EndTime).Subtract(DateTime.Parse(model.StartTime)).TotalHours,
                        FlightLength = double.Parse(model.FlightLength),
                        FlightRating = 0,
                        AdditionalInformation = model.AdditionalInformation,
                        NumberOfTransfers = int.Parse(model.NumberOfTransfers),
                        AllTransfers = model.AllTransfers,
                        PlaneName = model.PlaneName,
                        LugageWeight = double.Parse(model.LugageWeight),
                        Airline = airline
                    };

                    try
                    {
                        var result = await _context.Flights.AddAsync(flight);
                        _context.SaveChanges();
                        return Ok();
                    }
                    catch (Exception e)
                    {
                        throw e;
                    }
                }
            }
            else 
            {
                return BadRequest("Add flight is unsuccessffully.Server not found selected airline.");
            }
        }
        #endregion
    }
}

