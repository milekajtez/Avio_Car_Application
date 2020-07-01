using AvioCarBackend.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
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


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<FriendshipRequest>().HasKey(o => new { o.SenderJMBG, o.RecieverJMBG });
            builder.Entity<IdentityUserLogin<string>>().HasKey(o => o.UserId);
        }
    }
}
