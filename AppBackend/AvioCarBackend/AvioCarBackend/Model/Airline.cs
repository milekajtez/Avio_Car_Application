
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// AirlineID --------------------- identifikator aviokomapnije
    /// AirlineName ------------------- ime aviokomapnije
    /// AirlineAddress ---------------- adresa avikompanije
    /// AirlinePromotionDescription --- promotivni opis aviokompanije
    /// AirlineRating ----------------- ocena aviokompanije
    /// PriceList --------------------- cenovnik
    /// NumberOfSoldTickets ----------- broj prodatih karata
    /// Destinations ------------------ destinacije na kojima aviokompanija organizuje letove
    /// Flights ----------------------- letovi koje aviokopmanije organizuje
    /// </summary>
    public class Airline
    {
        public int AirlineID { get; set; }
        public string AirlineName { get; set; }
        public string AirlineAddress { get; set; }
        public string AirlinePromotionDescription { get; set; }
        public double AirlineRating { get; set; }
        public string PriceList { get; set; }
        public int NumberOfSoldTickets { get; set; }
        public ICollection<Destination> Destinations { get; set; }
        public ICollection<Flight> Flights { get; set; }
    }
}
