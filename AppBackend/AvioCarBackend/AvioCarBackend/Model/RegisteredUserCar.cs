using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    public class RegisteredUserCar
    {
        public string RegisteredUserID { get; set; }
        public int CarID { get; set; }
        public RegisteredUser RegisteredUser { get; set; }
        public Car Car { get; set; }
    }
}
