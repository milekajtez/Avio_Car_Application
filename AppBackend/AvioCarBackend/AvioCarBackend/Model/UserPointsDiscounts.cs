using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Model
{
    /// <summary>
    /// UserJMBG --------------------------- identifikator korinika koji ima odredjen popust
    /// Points ----------------------------- trenutni broj poena koje korisnik poseduje
    /// QuickReservationDicounts ----------- procenat za koji se smanjuje cena leta (avionske karte) i cena vozila ukoliko se 
    ///                                      odabere brza rezervacija
    /// AvioPlusCarReservationDiscounts ---- procena za koji se smanjuje cena automobila ako se prethodno rezervise let
    /// NumberOfPointsDicounts ------------- u zavisnosti od broja poena koje korisnik osvoji, prethodnim rezervacijama,
    ///                                      ostvaruje sledece popuste:
    ///                                         Points >= 300 ---------- 5% na sve registracije
    ///                                         Points >= 600 ---------- 10% na sve registracije
    ///                                         Points >= 1200 ---------- 20% na sve registracije
    ///                                      Rezervacija leta = 70 poena
    ///                                      Rezervacija kola = 40 poena
    ///                                      Rezervacija let+kola = 150 poena
    /// </summary>
    [Table("UserPointsDiscountsTable")]
    public class UserPointsDiscounts
    {
        [Key]
        public long UserJMBG { get; set; }

        [Required]
        public double Points { get; set; }

        [Required]
        public double QuickReservationDicounts { get; set; }

        [Required]
        public double AvioPlusCarReservationDiscounts { get; set; }

        [Required]
        public double NumberOfPointsDicounts { get; set; }
    }
}
