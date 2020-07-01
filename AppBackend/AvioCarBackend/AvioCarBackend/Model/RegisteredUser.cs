using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// JMBG -------------------- identifikator registrovanog korisnika
    /// NumberOfPassport -------- broj pasosa
    /// Username ---------------- korisnicko ime
    /// Email ------------------- e-mail
    /// Password ---------------- sifra
    /// FirstName --------------- ime
    /// LastName ---------------- prezime
    /// City -------------------- grad
    /// TelephoneNumber --------- broj telefona registrovanog korisnika
    /// IsFirstReservation ------ indeikator da li se korisnik prvi put loguje
    /// </summary>
    [Table("Users")]
    public class RegisteredUser : IdentityUser
    {
        public long JMBG { get; set; }
        public int NumberOfPassport { get; set; }
        public string Username { get; set; }
        public string E_mail { get; set; }
        public string Password { get; set; }            // minimalno 13 karaktera
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public long TelephoneNumber { get; set; }
        public bool IsFirstReservation { get; set; }

        //dodati
        /*public ICollection<Flight> Flights { get; set; }
        public ICollection<Car> Cars { get; set; }*/
    }
}
