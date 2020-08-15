using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.profile
{
    public class AvioAdminProfileModel
    {
        public string CurrentUsername { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
    }
}
