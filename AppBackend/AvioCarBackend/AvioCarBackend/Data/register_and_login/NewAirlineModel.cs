using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.register_and_login
{
    public class NewAirlineModel
    {
        public string AirlineName { get; set; }
        public string AirlineAddress { get; set; }
        public string AirlinePromotionDescription { get; set; }
        public string AirlinePriceList { get; set; }
    }
}
