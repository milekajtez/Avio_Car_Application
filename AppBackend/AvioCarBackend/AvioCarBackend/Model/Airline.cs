
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// AirlineID --------------------- identifikator aviokomapnije
    /// AirlineName ------------------- ime aviokomapnije
    /// AirlineAddress ---------------- adresa avikompanije
    /// AirlinePromotionDescription --- promotivni opis aviokompanije
    /// AirlinePrice ------------------ zbir vrednosti svih datih ocena
    /// NumberOfAirlineGrades --------- broj ocena koje su date avikompaniji (rating = AirlinePrice / NumberOfAirlineGrades)
    /// PriceList --------------------- cenovnik
    /// NumberOfSoldTickets ----------- broj prodatih karata
    /// Destinations ------------------ destinacije na kojima aviokompanija organizuje letove
    /// Flights ----------------------- letovi koje aviokopmanije organizuje
    /// </summary>
    [Table("Airlines")]
    public class Airline
    {
        [Key]
        public int AirlineID { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string AirlineName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(50)]
        public string AirlineAddress { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(500)]
        public string AirlinePromotionDescription { get; set; }

        [Required]
        public double AirlinePrice { get; set; }

        [Required]
        public double NumberOfAirlineGrades { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(500)]
        public string AirlinePriceList { get; set; }

        [Required]
        public int NumberOfSoldTickets { get; set; }

        [Required]
        public ICollection<Destination> Destinations { get; set; }

        [Required]
        public ICollection<Flight> Flights { get; set; }
    }
}
