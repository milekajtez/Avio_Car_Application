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
    /// FlightID ------------------ identifikator leta
    /// StartTime ----------------- vreme polaska
    /// EndTime ------------------- vreme dolaska
    /// StartLocation ------------- lokacija polaska
    /// EndLocation --------------- lokacija dolaska
    /// FlightTime ---------------- vreme putovanja
    /// FlightLength -------------- duzina putovanja
    /// FlightPrice --------------- ukupna vrednost svih ocena leta
    /// NumberOfFlightGrades ------ broj ocena koje su date letu
    /// AdditionalInformation ----- dodatne informacije o letu (da li postoji usluga ishrane, imena pilota i stujerdesa,...)
    /// NumberOfTransfers --------- broj presedanja
    /// AllTransfers -------------- mesta presedanja (na primer Berlin|Bec|Beograd|Istambul|Ankara)
    /// PlaneName ----------------- ime aviona koje vrsi let
    /// LugageWeight -------------- kolicina prtljaga koju je moguce poneti
    /// Airline ------------------- aviokompanije kojoj let pripada tj aviokompanija koja organizuje let
    /// Tickets ------------------- lista karata leta (svaka karta ustvari predstavlja mesta u avionu koja se mogu rezervisati)
    /// </summary>
    [Table("Flights")]
    public class Flight
    {
        [Key]
        public int FlightID { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string StartLocation { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string EndLocation { get; set; }

        [Required]
        public double FlightTime { get; set; }

        [Required]
        public double FlightLength { get; set; }

        [Required]
        public int FlightPrice { get; set; }

        [Required]
        public int NumberOfFlightGrades { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(300)]
        public string AdditionalInformation { get; set; }

        [Required]
        public int NumberOfTransfers { get; set; }

        [Required]
        [MinLength(1)]
        public string AllTransfers { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string PlaneName { get; set; }

        [Required]
        public double LugageWeight { get; set; }

        [Required]
        [JsonIgnore]
        public Airline Airline { get; set; }

        [Required]
        public ICollection<Ticket> Tickets { get; set; }

        // dodati
        // lista korisnika koji su rezervisali let
        public ICollection<RegisteredUserFlight> RegisteredUserFlights { get; set; }
    }
}
