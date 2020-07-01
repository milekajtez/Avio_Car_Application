using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// JMBG ----------- identifikator administratora
    /// Username ------- ime administratora
    /// Password ------- sifra administratora (mora biti digacka minimum 13 karaktera)
    /// AdminType ------ tip administratora
    /// FirstLogin ----- identifikator prve prijave administratora (Pre prvog prijavljivanja ce biti false, 
    ///                  a posle true. Glavni administrator ce odmah imati vrednost true)
    /// </summary>
    public class Administrator
    {
        public long JMBG { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public AdminType AdminType { get; set; }
        public bool FirstLogin { get; set; }
    }

    public enum AdminType { MAIN, AVIO, CAR };
}
