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
    }
}
