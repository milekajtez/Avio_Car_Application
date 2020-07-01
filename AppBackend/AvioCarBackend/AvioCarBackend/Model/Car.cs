using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// CarID ------------------- identifikator automobila
    /// CarName ----------------- ime automobila
    /// CarBrand ---------------- brend
    /// CarModel ---------------- model
    /// YearOdManufacture ------- godina prozivodnje
    /// NumberOfSeats ----------- broj sedista
    /// CarType ----------------- tipa automobila
    /// CarRating --------------- ocena automobila
    /// LugageWeight ------------ kolicina prtljaga koju je moguce poneti
    /// TimeOfCarPurchase ------- vreme rezervacije automobila
    /// IsCarPurchased ---------- da li je auto rezervisano
    /// IsQuickBooking ---------- da li auto pripada onim za brzu rezervaciju
    /// CarPrice ---------------- cena automobila
    /// Flight ------------------ let u okviru kog je rezervisan i automobil
    /// RentACarService --------- rent-a-car servis kome auto pripada
    /// </summary>
    [Table("Cars")]
    public class Car
    {
        [Key]
        public int CarID { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string CarName { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string CarBrand { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        public string CarModel { get; set; }

        [Required]
        public int YearOdManufacture { get; set; }

        [Required]
        public int NumberOfSeats { get; set; }

        [Required]
        public CarType CarType { get; set; }

        [Required]
        public double CarRating { get; set; }

        [Required]
        public double LugageWeight { get; set; }

        public DateTime TimeOfCarPurchase { get; set; }      // moze biti null

        [Required]
        public bool IsCarPurchased { get; set; }

        [Required]
        public bool IsQuickBooking { get; set; }

        [Required]
        public double CarPrice { get; set; }

        public Flight Flight { get; set; }                  // moze biti null

        [Required]
        public RentACarService RentACarService { get; set; }

        // dodati
        // lista korisnika koji su rezervisali kola
        public ICollection<RegisteredUserCar> RegisteredUserCar { get; set; }
    }

    public enum CarType { GASOLINE, DIESEL, GAS };
}
