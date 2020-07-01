using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// TicketID ---------------- identifikator karte
    /// TicketNumber ------------ broj karte
    /// TicketPrice ------------- cena karte
    /// CardType ---------------- tip karte (po ovim se misli i tip mesta.Karta ustvarii predstavlja mesto u avionu)
    /// TimeOfTicketPurchase ---- datum i vreme rezervacije tj kupovine karte
    /// IsTicketPurchased ------- da li je karta rezervisana
    /// IsQuickBooking ---------- da li jekartadodata u one koje su za brzu rezervaciju
    /// Flight ------------------ let kojem karta pripada
    /// </summary>
    public class Ticket
    {
        public int TicketID { get; set; }
        public int TicketNumber { get; set; }
        public double TicketPrice { get; set; }
        public CardType CardType { get; set; }
        public DateTime TimeOfTicketPurchase { get; set; }      // moze biti null
        public bool IsTicketPurchased { get; set; }
        public bool IsQuickBooking { get; set; }
        public Flight Flight { get; set; }
    }

    public enum CardType { ECONOMIC_CLASS, FIRST_CLASS, BUSINESS_CLASS };
}
