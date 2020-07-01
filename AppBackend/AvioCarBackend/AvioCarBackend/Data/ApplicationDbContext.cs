using AvioCarBackend.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AvioCarBackend.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<Airline> Airlines { get; set; }
        public DbSet<BranchOffice> BranchOffices { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<FriendshipRequest> FriendshipRequests { get; set; }
        public DbSet<RegisteredUser> RegisteredUsers { get; set; }
        public DbSet<RentACarService> RentACarServices { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<UserPointsDiscounts> UserPointsDiscounts { get; set; }
        public DbSet<RegisteredUserFlight> RegisteredUserFlights { get; set; }
        public DbSet<RegisteredUserCar> RegisteredUserCars { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<FriendshipRequest>().HasKey(o => new { o.SenderJMBG, o.RecieverJMBG });
            builder.Entity<IdentityUserLogin<string>>().HasKey(o => o.UserId);


            builder.Entity<RegisteredUserFlight>().HasKey(bc => new { bc.RegisteredUserID, bc.FlightID });
            builder.Entity<RegisteredUserFlight>().HasOne(bc => bc.RegisteredUser).WithMany(b => b.RegisteredUserFlights)
                .HasForeignKey(bc => bc.RegisteredUserID);
            builder.Entity<RegisteredUserFlight>().HasOne(bc => bc.Flight).WithMany(c => c.RegisteredUserFlights)
                .HasForeignKey(bc => bc.FlightID);


            builder.Entity<RegisteredUserCar>().HasKey(bc => new { bc.RegisteredUserID, bc.CarID });
            builder.Entity<RegisteredUserCar>().HasOne(bc => bc.RegisteredUser).WithMany(b => b.RegisteredUserCars)
                .HasForeignKey(bc => bc.RegisteredUserID);
            builder.Entity<RegisteredUserCar>().HasOne(bc => bc.Car).WithMany(c => c.RegisteredUserCar)
                .HasForeignKey(bc => bc.CarID);
        }
    }
}
