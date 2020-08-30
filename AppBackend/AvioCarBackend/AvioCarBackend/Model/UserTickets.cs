using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    [Table("UserTickets")]
    public class UserTickets
    {
        // Username je ustvari jmbg..necu vise da radi sa migracijama
        public long UserName { get; set; }
        public long TicketID { get; set; }

        [Required]
        public bool FriendConfirmed { get; set; }
    }
}
