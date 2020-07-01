﻿// <auto-generated />
using System;
using AvioCarBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AvioCarBackend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20200701183205_Migration2")]
    partial class Migration2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("AvioCarBackend.Model.Airline", b =>
                {
                    b.Property<int>("AirlineID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("AirlinePriceList")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)")
                        .HasMaxLength(500);

                    b.Property<string>("AirlinePromotionDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)")
                        .HasMaxLength(500);

                    b.Property<double>("AirlineRating")
                        .HasColumnType("float");

                    b.Property<int>("NumberOfSoldTickets")
                        .HasColumnType("int");

                    b.HasKey("AirlineID");

                    b.ToTable("Airlines");
                });

            modelBuilder.Entity("AvioCarBackend.Model.BranchOffice", b =>
                {
                    b.Property<int>("BranchOfficeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("BranchOfficeAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<int>("RentACarServiceCarServiceID")
                        .HasColumnType("int");

                    b.HasKey("BranchOfficeID");

                    b.HasIndex("RentACarServiceCarServiceID");

                    b.ToTable("BranchOffices");
                });

            modelBuilder.Entity("AvioCarBackend.Model.Car", b =>
                {
                    b.Property<int>("CarID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CarBrand")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("CarModel")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("CarName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<double>("CarPrice")
                        .HasColumnType("float");

                    b.Property<double>("CarRating")
                        .HasColumnType("float");

                    b.Property<int>("CarType")
                        .HasColumnType("int");

                    b.Property<int?>("FlightID")
                        .HasColumnType("int");

                    b.Property<bool>("IsCarPurchased")
                        .HasColumnType("bit");

                    b.Property<bool>("IsQuickBooking")
                        .HasColumnType("bit");

                    b.Property<double>("LugageWeight")
                        .HasColumnType("float");

                    b.Property<int>("NumberOfSeats")
                        .HasColumnType("int");

                    b.Property<int>("RentACarServiceCarServiceID")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeOfCarPurchase")
                        .HasColumnType("datetime2");

                    b.Property<int>("YearOdManufacture")
                        .HasColumnType("int");

                    b.HasKey("CarID");

                    b.HasIndex("FlightID");

                    b.HasIndex("RentACarServiceCarServiceID");

                    b.ToTable("Cars");
                });

            modelBuilder.Entity("AvioCarBackend.Model.Destination", b =>
                {
                    b.Property<int>("AirportID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AirlineID")
                        .HasColumnType("int");

                    b.Property<string>("AirportName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.HasKey("AirportID");

                    b.HasIndex("AirlineID");

                    b.ToTable("Destinations");
                });

            modelBuilder.Entity("AvioCarBackend.Model.Flight", b =>
                {
                    b.Property<int>("FlightID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AdditionalInformation")
                        .IsRequired()
                        .HasColumnType("nvarchar(300)")
                        .HasMaxLength(300);

                    b.Property<int>("AirlineID")
                        .HasColumnType("int");

                    b.Property<string>("AllTransfers")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EndLocation")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<double>("FlightLength")
                        .HasColumnType("float");

                    b.Property<double>("FlightRating")
                        .HasColumnType("float");

                    b.Property<double>("FlightTime")
                        .HasColumnType("float");

                    b.Property<double>("LugageWeight")
                        .HasColumnType("float");

                    b.Property<int>("NumberOfTransfers")
                        .HasColumnType("int");

                    b.Property<string>("PlaneName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("StartLocation")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.HasKey("FlightID");

                    b.HasIndex("AirlineID");

                    b.ToTable("Flights");
                });

            modelBuilder.Entity("AvioCarBackend.Model.FriendshipRequest", b =>
                {
                    b.Property<long>("SenderJMBG")
                        .HasColumnType("bigint");

                    b.Property<long>("RecieverJMBG")
                        .HasColumnType("bigint");

                    b.Property<bool>("RequestAccepted")
                        .HasColumnType("bit");

                    b.HasKey("SenderJMBG", "RecieverJMBG");

                    b.ToTable("FriendshipRequests");
                });

            modelBuilder.Entity("AvioCarBackend.Model.RegisteredUserCar", b =>
                {
                    b.Property<string>("RegisteredUserID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("CarID")
                        .HasColumnType("int");

                    b.HasKey("RegisteredUserID", "CarID");

                    b.HasIndex("CarID");

                    b.ToTable("RegisteredUserCars");
                });

            modelBuilder.Entity("AvioCarBackend.Model.RegisteredUserFlight", b =>
                {
                    b.Property<string>("RegisteredUserID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("FlightID")
                        .HasColumnType("int");

                    b.HasKey("RegisteredUserID", "FlightID");

                    b.HasIndex("FlightID");

                    b.ToTable("RegisteredUserFlights");
                });

            modelBuilder.Entity("AvioCarBackend.Model.RentACarService", b =>
                {
                    b.Property<int>("CarServiceID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CarServiceAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(50)")
                        .HasMaxLength(50);

                    b.Property<string>("CarServiceName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("CarServicePromotionDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)")
                        .HasMaxLength(500);

                    b.Property<double>("CarServiceRating")
                        .HasColumnType("float");

                    b.Property<double>("ServiceEarnings")
                        .HasColumnType("float");

                    b.Property<string>("ServicePriceList")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)")
                        .HasMaxLength(500);

                    b.HasKey("CarServiceID");

                    b.ToTable("RentACarServices");
                });

            modelBuilder.Entity("AvioCarBackend.Model.Ticket", b =>
                {
                    b.Property<int>("TicketID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("CardType")
                        .HasColumnType("int");

                    b.Property<int>("FlightID")
                        .HasColumnType("int");

                    b.Property<bool>("IsQuickBooking")
                        .HasColumnType("bit");

                    b.Property<bool>("IsTicketPurchased")
                        .HasColumnType("bit");

                    b.Property<int>("TicketNumber")
                        .HasColumnType("int");

                    b.Property<double>("TicketPrice")
                        .HasColumnType("float");

                    b.Property<DateTime>("TimeOfTicketPurchase")
                        .HasColumnType("datetime2");

                    b.HasKey("TicketID");

                    b.HasIndex("FlightID");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("AvioCarBackend.Model.UserPointsDiscounts", b =>
                {
                    b.Property<long>("UserJMBG")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("AvioPlusCarReservationDiscounts")
                        .HasColumnType("float");

                    b.Property<double>("NumberOfPointsDicounts")
                        .HasColumnType("float");

                    b.Property<double>("Points")
                        .HasColumnType("float");

                    b.Property<double>("QuickReservationDicounts")
                        .HasColumnType("float");

                    b.HasKey("UserJMBG");

                    b.ToTable("UserPointsDiscountsTable");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(256)")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");

                    b.HasDiscriminator<string>("Discriminator").HasValue("IdentityUser");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.HasKey("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(128)")
                        .HasMaxLength(128);

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("AvioCarBackend.Model.Administrator", b =>
                {
                    b.HasBaseType("Microsoft.AspNetCore.Identity.IdentityUser");

                    b.Property<long>("AdminJMBG")
                        .HasColumnType("bigint");

                    b.Property<string>("AdminPassword")
                        .IsRequired()
                        .HasColumnType("nvarchar(13)")
                        .HasMaxLength(13);

                    b.Property<int>("AdminType")
                        .HasColumnType("int");

                    b.Property<string>("AdminUsername")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<bool>("FirstLogin")
                        .HasColumnType("bit");

                    b.ToTable("Administrators");

                    b.HasDiscriminator().HasValue("Administrator");
                });

            modelBuilder.Entity("AvioCarBackend.Model.RegisteredUser", b =>
                {
                    b.HasBaseType("Microsoft.AspNetCore.Identity.IdentityUser");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<string>("E_mail")
                        .IsRequired()
                        .HasColumnType("nvarchar(55)")
                        .HasMaxLength(55);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<bool>("IsFirstReservation")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<int>("NumberOfPassport")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(13)")
                        .HasMaxLength(13);

                    b.Property<string>("RegisteredUsername")
                        .IsRequired()
                        .HasColumnType("nvarchar(30)")
                        .HasMaxLength(30);

                    b.Property<long>("TelephoneNumber")
                        .HasColumnType("bigint");

                    b.Property<long>("UserJMBG")
                        .HasColumnType("bigint");

                    b.ToTable("Users");

                    b.HasDiscriminator().HasValue("RegisteredUser");
                });

            modelBuilder.Entity("AvioCarBackend.Model.BranchOffice", b =>
                {
                    b.HasOne("AvioCarBackend.Model.RentACarService", "RentACarService")
                        .WithMany("BranchOffices")
                        .HasForeignKey("RentACarServiceCarServiceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AvioCarBackend.Model.Car", b =>
                {
                    b.HasOne("AvioCarBackend.Model.Flight", "Flight")
                        .WithMany()
                        .HasForeignKey("FlightID");

                    b.HasOne("AvioCarBackend.Model.RentACarService", "RentACarService")
                        .WithMany("Cars")
                        .HasForeignKey("RentACarServiceCarServiceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AvioCarBackend.Model.Destination", b =>
                {
                    b.HasOne("AvioCarBackend.Model.Airline", "Airline")
                        .WithMany("Destinations")
                        .HasForeignKey("AirlineID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AvioCarBackend.Model.Flight", b =>
                {
                    b.HasOne("AvioCarBackend.Model.Airline", "Airline")
                        .WithMany("Flights")
                        .HasForeignKey("AirlineID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AvioCarBackend.Model.RegisteredUserCar", b =>
                {
                    b.HasOne("AvioCarBackend.Model.Car", "Car")
                        .WithMany("RegisteredUserCar")
                        .HasForeignKey("CarID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AvioCarBackend.Model.RegisteredUser", "RegisteredUser")
                        .WithMany("RegisteredUserCars")
                        .HasForeignKey("RegisteredUserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AvioCarBackend.Model.RegisteredUserFlight", b =>
                {
                    b.HasOne("AvioCarBackend.Model.Flight", "Flight")
                        .WithMany("RegisteredUserFlights")
                        .HasForeignKey("FlightID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AvioCarBackend.Model.RegisteredUser", "RegisteredUser")
                        .WithMany("RegisteredUserFlights")
                        .HasForeignKey("RegisteredUserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AvioCarBackend.Model.Ticket", b =>
                {
                    b.HasOne("AvioCarBackend.Model.Flight", "Flight")
                        .WithMany("Tickets")
                        .HasForeignKey("FlightID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
