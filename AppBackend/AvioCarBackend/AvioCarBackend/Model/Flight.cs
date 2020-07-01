using System;
using System.Collections.Generic;
using System.Linq;
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
    /// FlightRating -------------- ocena leta
    /// AdditionalInformation ----- dodatne informacije o letu (da li postoji usluga ishrane, imena pilota i stujerdesa,...)
    /// NumberOfTransfers --------- broj presedanja
    /// AllTransfers -------------- mesta presedanja (na primer Berlin|Bec|Beograd|Istambul|Ankara)
    /// PlaneName ----------------- ime aviona koje vrsi let
    /// LugageWeight -------------- kolicina prtljaga koju je moguce poneti
    /// Airline ------------------- aviokompanije kojoj let pripada tj aviokompanija koja organizuje let
    /// Tickets ------------------- lista karata leta (svaka karta ustvari predstavlja mesta u avionu koja se mogu rezervisati)
    /// </summary>
    public class Flight
    {
        public int FlightID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public double FlightTime { get; set; }
        public double FlightLength { get; set; }
        public double FlightRating { get; set; }
        public string AdditionalInformation { get; set; }
        public int NumberOfTransfers { get; set; }
        public string AllTransfers { get; set; }
        public string PlaneName { get; set; }
        public string LugageWeight { get; set; }
        public Airline Airline { get; set; }
        public ICollection<Ticket> Tickets { get; set; }
       
        // dodati
        // lista korisnika koji su rezervisali let
    }
}
