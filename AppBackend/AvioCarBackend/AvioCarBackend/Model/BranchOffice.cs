using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// BranchOfficeID -------------- indetifikator filijale
    /// BranchOfficeAddress --------- adresa filijale
    /// City ------------------------ grad
    /// Country --------------------- drzava
    /// RentACarService ------------- rent-a-car servis kome filijala pripada
    /// </summary>
    public class BranchOffice
    {
        public int BranchOfficeID { get; set; }
        public string BranchOfficeAddress { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public RentACarService RentACarService { get; set; }
    }
}
