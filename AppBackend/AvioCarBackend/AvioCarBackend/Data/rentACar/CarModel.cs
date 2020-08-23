using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.rentACar
{
    public class CarModel
    {
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string YearOfManufacture { get; set; }
        public string NumberOfSeats { get; set; }
        public string CardType { get; set; }
        public string LugageWeight { get; set; }
        public string IsQuickBooking { get; set; }
        public string CarPrice { get; set; }
        public string FlightID { get; set; }
        public string RentACarServiceID { get; set; }
    }
}
