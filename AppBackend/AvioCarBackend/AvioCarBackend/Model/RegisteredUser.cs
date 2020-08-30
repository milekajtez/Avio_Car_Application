using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// Polja JMBG, Username, E-mail, Password i Telephone number su izuzeti jer su vec ugradjeni u AspNetUsers tabelu 
    /// NumberOfPassport -------- broj pasosa
    /// FirstName --------------- ime
    /// LastName ---------------- prezime
    /// City -------------------- grad
    /// IsFirstReservation ------ indeikator da li se korisnik prvi put loguje
    /// </summary>
    [Table("Users")]
    public class RegisteredUser : IdentityUser
    {
        public string NumberOfPassport { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string FirstName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string LastName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string City { get; set; }

        public bool FirstLogin { get; set; }

        public bool IsNewReservation { get; set; }

        [Required]
        public double Points { get; set; }

        public ICollection<RegisteredUserFlight> RegisteredUserFlights { get; set; }
        public ICollection<RegisteredUserCar> RegisteredUserCars { get; set; }
    }
}
