using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// Ova tabela ce imati samo jedan red, koji daje informaciju o procentima popusta
    /// DicountID --------------------------- identifikator popusta 
    /// AvioPlusCarReservationDiscounts ----- procenat za koji se smanjuje cena automobila ako se prethodno rezervise let
    /// Dicount300 -------------------------- procenat koji korisnik ostvaruje kada ima izmedju 300 i 600 poena
    /// Dicount600 -------------------------- procenat koji korisnik ostvaruje kada ima izmedju 600 i 1200 poena
    /// Dicount1200 ------------------------- procenat koji korisnik ostvaruje kada ima vise od 1200 poena                                     
    /// </summary>
    [Table("UserPointsDiscountsTable")]
    public class UserPointsDiscounts
    {
        [Key]
        public string DicountID { get; set; }

        [Required]
        public double AvioPlusCarReservationDiscounts { get; set; }

        [Required]
        public double Dicount300 { get; set; }

        [Required]
        public double Dicount600 { get; set; }

        [Required]
        public double Dicount1200 { get; set; }
    }
}
