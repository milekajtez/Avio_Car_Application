using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// SenderJMBG -------- jmbg posiljaoca zahteva za prijateljstvo
    /// RecieverJMBG ------ jmbg primaoca zahteva za prijateljstvo
    /// RequestAccepted --- identifikator da li je zahtev prihvacen (true - prihvacen, false - na cekanju. 
    ///                     Odbijanjem zahteva, on se brise iz tabele)
    /// </summary>
    [Table("FriendshipRequests")]
    public class FriendshipRequest
    {
        public long SenderJMBG { get; set; }
        public long RecieverJMBG { get; set; }

        [Required]
        public bool RequestAccepted { get; set; }
    }
}
