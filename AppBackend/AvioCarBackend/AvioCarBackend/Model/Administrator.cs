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
    /// JMBG ----------- identifikator administratora
    /// Username ------- ime administratora
    /// Password ------- sifra administratora (mora biti digacka minimum 13 karaktera)
    /// AdminType ------ tip administratora
    /// FirstLogin ----- identifikator prve prijave administratora (Pre prvog prijavljivanja ce biti false, 
    ///                  a posle true. Glavni administrator ce odmah imati vrednost true)
    /// </summary>
    [Table("Administrators")]
    public class Administrator : IdentityUser
    {
        [Required]
        public long AdminJMBG { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string AdminUsername { get; set; }

        [Required]
        [StringLength(13)]
        public string AdminPassword { get; set; }

        [Required]
        public AdminType AdminType { get; set; }

        [Required]
        public bool FirstLogin { get; set; }
    }

    public enum AdminType { MAIN, AVIO, CAR };
}
