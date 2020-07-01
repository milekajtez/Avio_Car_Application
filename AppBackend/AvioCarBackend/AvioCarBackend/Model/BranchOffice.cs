using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// BranchOfficeID -------------- indetifikator filijale
    /// BranchOfficeAddress --------- adresa filijale
    /// City ------------------------ grad
    /// Country --------------------- drzava
    /// RentACarService ------------- rent-a-car servis kome filijala pripada
    /// </summary>
    [Table("BranchOffices")]
    public class BranchOffice
    {
        [Key]
        public int BranchOfficeID { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(50)]
        public string BranchOfficeAddress { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string City { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string Country { get; set; }

        [Required]
        public RentACarService RentACarService { get; set; }
    }
}
