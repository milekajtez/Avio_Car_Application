using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.register_and_login
{
    public class RegisteredUserModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Jmbg { get; set; }
        public string City { get; set; }
        public string Telephone { get; set; }
    }
}
