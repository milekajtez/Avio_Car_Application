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
using Microsoft.EntityFrameworkCore;

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
                        FlightPrice = 0,
                        NumberOfFlightGrades = 0,
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
        #region 9 - Metoda za ucitavanje letova
        [HttpGet]
        [Route("GetFlights")]
        public IActionResult GetFlights()
        {
            try
            {
                var flights = _context.Flights;
                if (flights == null)
                {
                    return NotFound();
                }
                return Ok(flights);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 10 - Metoda za dodavanje kongiguracije sedista za avion tj let
        //AddSeatsConfiguration
        [HttpPost]
        [Route("AddSeatsConfiguration")]
        //POST : /api/LoadData/AddSeatsConfiguration
        public async Task<Object> AddSeatsConfiguration(SeatModel model)
        {
            var flight = await _context.Flights.FindAsync(int.Parse(model.Flight));
            if (flight != null)
            {
                int firstNum = int.Parse(model.NumberOfFirstSeats);
                int businessNum = int.Parse(model.NumberOfBusinessSeats);
                int economicNum = int.Parse(model.NumberOfEconomicSeats);
                int numberOfAllSeats = firstNum + businessNum + economicNum;

                for (int i = 0; i < numberOfAllSeats; i++)
                {
                    // initial
                    Ticket newTicket = new Ticket()
                    {
                        TicketNumber = i + 1,
                        IsTicketPurchased = false,
                        IsQuickBooking = false,
                        Flight = flight
                    };

                    if (i <= firstNum - 1)
                    {
                        // add first class
                        newTicket.CardType = CardType.FIRST_CLASS;
                        newTicket.TicketPrice = double.Parse(model.FirstClassPrice);

                    }
                    else if (i <= firstNum + businessNum - 1)
                    {
                        // add business class
                        newTicket.CardType = CardType.BUSINESS_CLASS;
                        newTicket.TicketPrice = double.Parse(model.BusinessClassPrice);
                    }
                    else
                    {
                        // add economic class
                        newTicket.CardType = CardType.ECONOMIC_CLASS;
                        newTicket.TicketPrice = double.Parse(model.EconomicClassPrice);
                    }

                    try
                    {
                        var result = await _context.Tickets.AddAsync(newTicket);
                        _context.SaveChanges();
                    }
                    catch (Exception e)
                    {
                        throw e;
                    }
                }

                return Ok();
            }
            else
            {
                return BadRequest("Add seact configuration is unsuccessffully.Server not found selected flight.");
            }
        }
        #endregion
        #region 11 - Metoda za ucitavanje destinacija odredjene aviokompanije
        [HttpGet]
        [Route("GetDestinations/{airlineID}")]
        public IActionResult GetDestinations(string airlineID)
        {
            var destinations = _context.Destinations.Include(d => d.Airline);
            if (destinations == null)
            {
                return NotFound("Currentlly this airline not have any destinations.");
            }

            var result = new List<Destination>();
            foreach (var dest in destinations)
            {
                if (dest.Airline.AirlineID.Equals(int.Parse(airlineID)))
                {
                    result.Add(dest);
                }
            }

            if (result.Count == 0)
            {
                return NotFound("Currentlly this airline not have any destinations.");
            }
            return Ok(result);
        }
        #endregion
        #region 12 - Metoda za ucitavanje letova odredjene aviokompanije
        [HttpGet]
        [Route("GetAirlineFlights/{airlineID}")]
        public IActionResult GetAirlineFlights(string airlineID)
        {
            var flights = _context.Flights.Include(d => d.Airline);
            if (flights == null)
            {
                return NotFound("Currentlly this airline not have any flight.");
            }

            var result = new List<Flight>();
            foreach (var flight in flights)
            {
                if (flight.Airline.AirlineID.Equals(int.Parse(airlineID)))
                {
                    result.Add(flight);
                }
            }

            if (result.Count == 0)
            {
                return NotFound("Currentlly this airline not have any flight.");
            }
            return Ok(result);
        }
        #endregion
        #region 13 - Metoda za ucitavanje svih destinacija
        //GetDestination
        [HttpGet]
        [Route("GetDestination")]
        public IActionResult GetDestination()
        {
            try
            {
                var destinations = _context.Destinations;
                if (destinations == null)
                {
                    return NotFound();
                }
                return Ok(destinations);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 14 - Metoda za brisanje destinacije
        [HttpDelete]
        [Route("DeleteDestination/{airportID}")]
        public async Task<ActionResult<Destination>> DeleteDestination(string airportID)
        {
            var destinations = await _context.Destinations.FindAsync(int.Parse(airportID));
            if (destinations == null)
            {
                return NotFound();
            }

            _context.Destinations.Remove(destinations);
            await _context.SaveChangesAsync();

            return destinations;
        }
        #endregion
        #region 15 - Metoda za menjanje destinacije
        [HttpPut]
        [Route("ChangeDestination")]
        public async Task<Object> ChangeDestination(DestinationModel model)
        {
            var resultFind = await _context.Destinations.FindAsync(int.Parse(model.AirlineID));
            if (resultFind == null)
            {
                return NotFound();
            }

            if (model.AirportName == null && model.City == null && model.Country == null)
            {
                return NotFound("Change unsccessfully.All field are empty.");
            }

            if (model.AirportName.Trim().Equals("") && model.City.Trim().Equals("") && model.Country.Trim().Equals(""))
            {
                return NotFound("Change unsccessfully.All field are empty.");
            }

            resultFind.AirportName = model.AirportName == null || model.AirportName.Trim().Equals("") ? resultFind.AirportName : model.AirportName;
            resultFind.City = model.City == null || model.City.Trim().Equals("") ? resultFind.City : model.City;
            resultFind.Country = model.Country == null || model.Country.Trim().Equals("") ? resultFind.Country : model.Country;

            try
            {
                _context.Destinations.Update(resultFind);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 16 - Metoda za brisanje leta
        //DeleteFlight
        [HttpDelete]
        [Route("DeleteFlight/{flightID}")]
        public async Task<ActionResult<Flight>> DeleteFlight(string flightID)
        {
            var flights = await _context.Flights.FindAsync(int.Parse(flightID));
            if (flights == null)
            {
                return NotFound();
            }

            _context.Flights.Remove(flights);
            await _context.SaveChangesAsync();

            return flights;
        }
        #endregion
        #region 17 - Metoda za izmenu leta
        //ChangeFlight
        [HttpPut]
        [Route("ChangeFlight")]
        public async Task<Object> ChangeFlight(FlightModel model)
        {
            var resultFind = await _context.Flights.FindAsync(int.Parse(model.AirlineID));
            if (resultFind == null)
            {
                return NotFound();
            }

            // provera da li korisnik nista nije uneo
            if (model.StartTime.Trim().Equals("") && model.EndTime.Trim().Equals("") && model.StartLocation.Trim().Equals("") && 
                model.EndLocation.Trim().Equals("") && model.FlightLength.Trim().Equals("") && model.AdditionalInformation.Trim().Equals("") 
                && model.NumberOfTransfers.Trim().Equals("") && model.AllTransfers.Trim().Equals("") && 
                model.PlaneName.Trim().Equals("") && model.LugageWeight.Trim().Equals(""))
            {
                return BadRequest("Change flight unsuccessfully. You not enter any new informations.");
            }
            else 
            {
                // da li je uneo samo jedan datum
                if ((model.StartTime.Trim().Equals("") && !model.EndTime.Trim().Equals("")) ||
                    (!model.StartTime.Trim().Equals("") && model.EndTime.Trim().Equals("")))
                {
                    return BadRequest("If you insert one time, you must isert and another.Change unccessfully.");
                }
                else 
                {
                    // ako je uneo oba datuma
                    if (!model.StartTime.Trim().Equals("") && !model.StartTime.Trim().Equals("")) 
                    {
                        DateTime start = DateTime.Parse(model.StartTime);
                        DateTime end = DateTime.Parse(model.EndTime);
                        int resultTime = DateTime.Compare(start, end);

                        // da li je hronoloski dobro uneo datume
                        if (resultTime == 0)
                        {
                            return BadRequest("Change flight is unsuccessffully. You entered same time for start and end od flight.");
                        }
                        else if (resultTime > 0)
                        {
                            return BadRequest("Change flight is unsuccessffully. Time of flight end is earlier than time of flight start.");
                        }
                        else
                        {
                            resultFind.FlightTime = DateTime.Parse(model.EndTime).Subtract(DateTime.Parse(model.StartTime)).TotalHours;
                        }
                    }

                    resultFind.StartTime = model.StartTime == null || model.StartTime.Trim().Equals("") ? resultFind.StartTime : DateTime.Parse(model.StartTime);
                    resultFind.EndTime = model.EndTime == null || model.EndTime.Trim().Equals("") ? resultFind.EndTime : DateTime.Parse(model.EndTime);
                    resultFind.StartLocation = model.StartLocation == null || model.StartLocation.Trim().Equals("") ? resultFind.StartLocation : model.StartLocation;
                    resultFind.EndLocation = model.EndLocation == null || model.EndLocation.Trim().Equals("") ? resultFind.EndLocation : model.EndLocation;
                    resultFind.FlightLength = model.FlightLength == null || model.FlightLength.Trim().Equals("") ? resultFind.FlightLength : double.Parse(model.FlightLength);
                    resultFind.FlightPrice = resultFind.FlightPrice;                   // ovo polje se ne menja
                    resultFind.NumberOfFlightGrades = resultFind.NumberOfFlightGrades;  // ovo polje se ne menja
                    resultFind.AdditionalInformation = model.AdditionalInformation == null || model.AdditionalInformation.Trim().Equals("") ? resultFind.AdditionalInformation : model.AdditionalInformation;
                    resultFind.NumberOfTransfers = model.NumberOfTransfers == null || model.NumberOfTransfers.Trim().Equals("") ? resultFind.NumberOfTransfers : int.Parse(model.NumberOfTransfers);
                    resultFind.AllTransfers = model.AllTransfers == null || model.AllTransfers.Trim().Equals("") ? resultFind.AllTransfers : model.AllTransfers;
                    resultFind.PlaneName = model.PlaneName == null || model.PlaneName.Trim().Equals("") ? resultFind.PlaneName : model.PlaneName;
                    resultFind.LugageWeight = model.LugageWeight == null || model.LugageWeight.Trim().Equals("") ? resultFind.LugageWeight : double.Parse(model.LugageWeight);

                    try
                    {
                        _context.Flights.Update(resultFind);
                        _context.SaveChanges();
                        return Ok();
                    }
                    catch (Exception e)
                    {
                        throw e;
                    }
                }
            }
        }
        #endregion
    }
}


