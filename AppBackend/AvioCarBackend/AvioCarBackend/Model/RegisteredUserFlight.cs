using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    public class RegisteredUserFlight
    {
        public string RegisteredUserID { get; set; }
        public int FlightID { get; set; }
        public RegisteredUser RegisteredUser { get; set; }
        public Flight Flight { get; set; }
    }
}
