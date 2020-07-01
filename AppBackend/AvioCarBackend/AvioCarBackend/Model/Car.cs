using System;
using System.Collections.Generic;
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
    public class Car
    {
        public int CarID { get; set; }
        public string CarName { get; set; }
        public string CarBrand { get; set; }
        public string CarModel { get; set; }
        public int YearOdManufacture { get; set; }
        public int NumberOfSeats { get; set; }
        public CarType CarType { get; set; }
        public double CarRating { get; set; }
        public double LugageWeight { get; set; }
        public DateTime TimeOfCarPurchase { get; set; }      // moze biti null
        public bool IsCarPurchased { get; set; }
        public bool IsQuickBooking { get; set; }
        public double CarPrice { get; set; }
        public Flight Flight { get; set; }                  // moze biti null
        public RentACarService RentACarService { get; set; }

        // dodati
        // lista korisnika koji su rezervisali kola
    }

    public enum CarType { GASOLINE, DIESEL, GAS };
}
