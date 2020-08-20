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
    /// TicketID ---------------- identifikator karte
    /// TicketNumber ------------ broj karte
    /// TicketPrice ------------- cena karte
    /// CardType ---------------- tip karte (po ovim se misli i tip mesta.Karta ustvarii predstavlja mesto u avionu)
    /// TimeOfTicketPurchase ---- datum i vreme rezervacije tj kupovine karte
    /// IsTicketPurchased ------- da li je karta rezervisana
    /// IsQuickBooking ---------- da li je karta dodata u one koje su za brzu rezervaciju
    /// Flight ------------------ let kojem karta pripada
    /// </summary>
    [Table("Tickets")]
    public class Ticket
    {
        [Key]
        public int TicketID { get; set; }

        [Required]
        public int TicketNumber { get; set; }

        [Required]
        public double TicketPrice { get; set; }

        [Required]
        public CardType CardType { get; set; }

        public DateTime TimeOfTicketPurchase { get; set; }      // moze biti null

        [Required]
        public bool IsTicketPurchased { get; set; }

        [Required]
        public bool IsQuickBooking { get; set; }

        [Required]
        [JsonIgnore]
        public Flight Flight { get; set; }
    }

    public enum CardType { ECONOMIC_CLASS, FIRST_CLASS, BUSINESS_CLASS };
}
