using System;
using System.Collections.Generic;
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
    public class FriendshipRequest
    {
        public long SenderJMBG { get; set; }
        public long RecieverJMBG { get; set; }
        public bool RequestAccepted { get; set; }
    }
}
