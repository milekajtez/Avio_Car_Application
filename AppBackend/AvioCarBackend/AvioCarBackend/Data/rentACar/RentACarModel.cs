using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.rentACar
{
    public class RentACarModel
    {
        public string CarServiceName { get; set; }
        public string CarServiceAddress { get; set; }
        public string CarServicePromotionDescription { get; set; }
        public string ServicePriceList { get; set; }
    }
}
