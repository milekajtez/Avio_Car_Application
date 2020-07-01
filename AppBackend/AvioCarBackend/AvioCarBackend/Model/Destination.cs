using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
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
        public int AirportID { get; set; }
        public string AirportName { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public Airline Airline { get; set; }
    }
}
