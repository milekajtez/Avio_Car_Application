using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.register_and_login
{
    public class SeatModel
    {
        public string Flight { get; set; }
        public string NumberOfEconomicSeats { get; set; }
        public string EconomicClassPrice { get; set; }
        public string NumberOfFirstSeats { get; set; }
        public string FirstClassPrice { get; set; }
        public string NumberOfBusinessSeats { get; set; }
        public string BusinessClassPrice { get; set; }
    }
}
