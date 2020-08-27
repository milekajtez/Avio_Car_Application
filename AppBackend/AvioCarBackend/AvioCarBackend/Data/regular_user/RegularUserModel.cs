using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.regular_user
{
    public class RegularUserModel
    {
        public string CurrentUsername { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string NumberOfPassport { get; set; }
        public string Points { get; set; }
    }
}
