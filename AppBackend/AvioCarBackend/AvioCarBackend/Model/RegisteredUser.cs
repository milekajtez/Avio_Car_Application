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
        /*[Required]
        public long UserJMBG { get; set; }*/

        [Required]
        public int NumberOfPassport { get; set; }

        [Required]
        public UserType UserType { get; set; }

        [Required]
        public bool FirstLogin { get; set; }
        /*[Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string RegisteredUsername { get; set; }*/

        /*[Required]
        [MinLength(11)]
        [MaxLength(55)]
        public string E_mail { get; set; }*/

        /*[Required]
        [StringLength(13)]
        public string Password { get; set; }            // minimalno 13 karaktera*/

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

        /*[Required]
        public long TelephoneNumber { get; set; }*/

        [Required]
        public bool IsFirstReservation { get; set; }

        //dodati
        public ICollection<RegisteredUserFlight> RegisteredUserFlights { get; set; }
        public ICollection<RegisteredUserCar> RegisteredUserCars { get; set; }
    }
    public enum UserType { MAIN_ADMIN, AVIO_ADMIN, CAR_ADMIN, REGULAR_USER };
}
