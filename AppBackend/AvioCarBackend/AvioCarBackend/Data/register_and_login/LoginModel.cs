﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.register_and_login
{
    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string IdToken { get; set; }
        public string Id { get; set; }
    }
}
