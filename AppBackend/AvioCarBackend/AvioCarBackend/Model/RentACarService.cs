using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// CarServiceID -------------------------- identifikator rent-a-car servisa
    /// CarServiceName ------------------------ ime
    /// CarServiceAddress --------------------- adresa
    /// CarServicePromotionDescription -------- promotivni opis
    /// CarServicePrice ----------------------- zbir svih ocena rent-a-car servisa koje su date
    /// NumberOfCarServiceGrades -------------- broj ocenjivanja rent-a-car servisa
    /// PriceList ----------------------------- cenovnik
    /// ServiceEarnings ----------------------- ukupni prihodi rent-a-car servisa
    /// Cars ---------------------------------- kola koje servis poseduje
    /// BranchOffices ------------------------- filijale koje servis poseduje
    /// </summary>
    [Table("RentACarServices")]
    public class RentACarService
    {
        [Key]
        public int CarServiceID { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string CarServiceName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(50)]
        public string CarServiceAddress { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(500)]
        public string CarServicePromotionDescription { get; set; }

        [Required]
        public double CarServicePrice { get; set; }

        [Required]
        public double NumberOfCarServiceGrades { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(500)]
        public string ServicePriceList { get; set; }

        [Required]
        public double ServiceEarnings { get; set; }

        [Required]
        public ICollection<Car> Cars { get; set; }

        [Required]
        public ICollection<BranchOffice> BranchOffices { get; set; }
    }
}
