using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// CarServiceID -------------------------- identifikator rent-a-car servisa
    /// CarServiceName ------------------------ ime
    /// CarServiceAddress --------------------- adresa
    /// CarServicePromotionDescription -------- promotivni opis
    /// CarServiceRating ---------------------- ocena rent-a-car servisa
    /// PriceList ----------------------------- cenovnik
    /// ServiceEarnings ----------------------- ukupni prihodi rent-a-car servisa
    /// Cars ---------------------------------- kola koje servis poseduje
    /// BranchOffices ------------------------- filijale koje servis poseduje
    /// </summary>
    public class RentACarService
    {
        public int CarServiceID { get; set; }
        public string CarServiceName { get; set; }
        public string CarServiceAddress { get; set; }
        public string CarServicePromotionDescription { get; set; }
        public double CarServiceRating { get; set; }
        public string PriceList { get; set; }
        public double ServiceEarnings { get; set; }
        public ICollection<Car> Cars { get; set; }
        public ICollection<BranchOffice> BranchOffices { get; set; }
    }
}
