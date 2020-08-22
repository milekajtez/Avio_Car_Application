using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AvioCarBackend.Data;
using AvioCarBackend.Data.rentACar;
using AvioCarBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AvioCarBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentACarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public RentACarController(ApplicationDbContext context)
        {
            _context = context;
        }

        #region 1 - Metoda za ucitavanje svih filijala
        [HttpGet]
        [Route("GetBranchOffices")]
        public IActionResult GetBranchOffices()
        {
            try
            {
                var branchOffices = _context.BranchOffices;
                if (branchOffices == null)
                {
                    return NotFound();
                }
                return Ok(branchOffices);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 2 - Metoda za ucitavanje svih rent-a-car servisa
        [HttpGet]
        [Route("GetRentACarServices")]
        public IActionResult GetRentACarServices()
        {
            try
            {
                var rentACarServices = _context.RentACarServices;
                if (rentACarServices == null)
                {
                    return NotFound();
                }
                return Ok(rentACarServices);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 3 - Metoda za dodavanje nove filijale
        //AddBranchOffice
        [HttpPost]
        [Route("AddBranchOffice")]
        public async Task<Object> AddBranchOffice(BranchOfficeModel model)
        {
            var carService = await _context.RentACarServices.FindAsync(int.Parse(model.RentACarServiceID));
            if (carService != null)
            {
                BranchOffice branchOffice = new BranchOffice()
                {
                    BranchOfficeAddress = model.BranchOfficeAddress,
                    City = model.City,
                    Country = model.Country,
                    RentACarService = carService
                };

                try
                {
                    var result = await _context.BranchOffices.AddAsync(branchOffice);
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
                return BadRequest("Add bransh office is unsuccessffully.Server not found selected rent-a-car service.");
            }
        }
        #endregion
        #region 4 - Metoda za brisanje selektovane filijale
        [HttpDelete]
        [Route("DeleteBranchOffice/{branchOfficeID}")]
        public async Task<ActionResult<BranchOffice>> DeleteBranchOffice(string branchOfficeID)
        {
            var branchOffice = await _context.BranchOffices.FindAsync(int.Parse(branchOfficeID));
            if (branchOffice == null)
            {
                return NotFound();
            }

            _context.BranchOffices.Remove(branchOffice);
            await _context.SaveChangesAsync();

            return branchOffice;
        }
        #endregion
        #region 5 - Metoda za izmenu selektovane filijale
        [HttpPut]
        [Route("ChangeBranchOffice")]
        public async Task<Object> ChangeBranchOffice(BranchOfficeModel model)
        {
            var resultFind = await _context.BranchOffices.FindAsync(int.Parse(model.RentACarServiceID));
            if (resultFind == null)
            {
                return NotFound();
            }

            if (model.BranchOfficeAddress == null && model.City == null && model.Country == null)
            {
                return NotFound("Change unsccessfully.All field are empty.");
            }
            else
            {
                if (model.BranchOfficeAddress != null)
                {
                    if (!model.BranchOfficeAddress.Trim().Equals(""))
                    {
                        resultFind.BranchOfficeAddress = model.BranchOfficeAddress;
                    }
                }

                if (model.City != null)
                {
                    if (!model.City.Trim().Equals(""))
                    {
                        resultFind.City = model.City;
                    }
                }

                if (model.Country != null)
                {
                    if (!model.Country.Trim().Equals(""))
                    {
                        resultFind.Country = model.Country;
                    }
                }
            }

            try
            {
                _context.BranchOffices.Update(resultFind);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 6 - Metoda za ucitavanje automobila
        [HttpGet]
        [Route("GetCars")]
        public IActionResult GetCars()
        {
            try
            {
                var cars = _context.Cars;
                if (cars == null)
                {
                    return NotFound();
                }
                return Ok(cars);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 7 - Metoda za dodavanje novog automobila
        [HttpPost]
        [Route("AddNewCar")]
        public async Task<Object> AddNewCar(CarModel model)
        {
            Flight flightFind = null;
            if (model.FlightID != "")
            {
                flightFind = await _context.Flights.FindAsync(int.Parse(model.FlightID));
            }

            var findRentACar = await _context.RentACarServices.FindAsync(int.Parse(model.RentACarServiceID));
            if (findRentACar == null)
            {
                return NotFound("Add car unsuccessfuly. Server not found entered rent-a-car service");
            }

            Car car = new Car()
            {
                CarName = model.Name,
                CarBrand = model.Brand,
                CarModel = model.Model,
                YearOdManufacture = int.Parse(model.YearOfManufacture),
                NumberOfSeats = int.Parse(model.NumberOfSeats),
                OverallGrade = 0,
                NumberOfCarGrades = 0,
                LugageWeight = double.Parse(model.LugageWeight),
                IsCarPurchased = false,
                CarPrice = 0,
                Flight = flightFind,
                RentACarService = findRentACar
            };

            if (model.CardType.Equals("1"))
            {
                car.CarType = CarType.GASOLINE;
            }
            else if (model.CardType.Equals("2"))
            {
                car.CarType = CarType.DIESEL;
            }
            else
            {
                car.CarType = CarType.GAS;
            }

            if (model.IsQuickBooking.Equals("true"))
            {
                car.IsQuickBooking = true;
            }
            else
            {
                car.IsQuickBooking = false;
            }


            try
            {
                var result = await _context.Cars.AddAsync(car);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
        #region 8 - Metoda za brisanje automobila
        [HttpDelete]
        [Route("DeleteCar/{carID}")]
        public async Task<ActionResult<Car>> DeleteCar(string carID)
        {
            var car = await _context.Cars.FindAsync(int.Parse(carID));
            if (car == null)
            {
                return NotFound();
            }

            if (car.IsCarPurchased)
            {
                return NotFound("Car is currently purchased. Delete unsuccessfuly.");
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return car;
        }
        #endregion
        #region 9 - Metoda za menjanje automobila
        [HttpPut]
        [Route("ChangeCar/{carID}")]
        public async Task<Object> ChangeCar(string carID, CarModel model)
        {
            var resultFind = await _context.Cars.FindAsync(int.Parse(carID));
            if (resultFind == null)
            {
                return NotFound("Changing is unsuccessfuly. Server not found selected car.");
            }

            if (model.Name != null)
            {
                if (!model.Name.Trim().Equals(""))
                {
                    resultFind.CarName = model.Name;
                }
            }

            if (model.Model != null)
            {
                if (!model.Model.Trim().Equals(""))
                {
                    resultFind.CarModel = model.Model;
                }
            }

            if (model.Brand != null)
            {
                if (!model.Brand.Trim().Equals(""))
                {
                    resultFind.CarBrand = model.Brand;
                }
            }

            if (model.YearOfManufacture != null)
            {
                if (!model.YearOfManufacture.Trim().Equals(""))
                {
                    resultFind.YearOdManufacture = int.Parse(model.YearOfManufacture);
                }
            }

            if (model.NumberOfSeats != null)
            {
                if (!model.NumberOfSeats.Trim().Equals(""))
                {
                    resultFind.NumberOfSeats = int.Parse(model.NumberOfSeats);
                }
            }

            if (model.CardType != null)
            {
                if (!model.CardType.Trim().Equals(""))
                {
                    if (model.CardType.Equals("1"))
                    {
                        resultFind.CarType = CarType.GASOLINE;
                    }
                    else if (model.CardType.Equals("2"))
                    {
                        resultFind.CarType = CarType.DIESEL;
                    }
                    else
                    {
                        resultFind.CarType = CarType.GAS;
                    }
                }
            }

            if (model.LugageWeight != null)
            {
                if (!model.LugageWeight.Trim().Equals(""))
                {
                    resultFind.LugageWeight = int.Parse(model.LugageWeight);
                }
            }

            if (model.IsQuickBooking != null)
            {
                if (model.IsQuickBooking.Equals("true"))
                {
                    resultFind.IsQuickBooking = true;
                }
                else
                {
                    resultFind.IsQuickBooking = false;
                }
            }

            if (model.FlightID != null)
            {
                var flight = await _context.Flights.FindAsync(int.Parse(model.FlightID));
                if (flight == null)
                {
                    return NotFound("Changing unsuccessfuly. Server Not found selectred flight.");
                }
                else
                {
                    resultFind.Flight = flight;
                }
            }

            try
            {
                _context.Cars.Update(resultFind);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion
    }
}
