using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// DestinationID ------------- identifikator destinacije
    /// DestinationName ----------- ime destinacije
    /// City ---------------------- grad
    /// Country ------------------- drzava
    /// Airline ------------------- aviokompanija kojoj pripada destinacija
    /// </summary>
    [Table("Destinations")]
    public class Destination
    {
        [Key]
        public int AirportID { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string AirportName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string City { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string Country { get; set; }

        [Required]
        [JsonIgnore]
        public Airline Airline { get; set; }
    }
}
