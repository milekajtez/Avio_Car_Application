using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data.regular_user
{
    public class FlightReservationModel
    {
        public string TicketID { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public string TicketNumber { get; set; }
        public string TicketType { get; set; }
    }
}
