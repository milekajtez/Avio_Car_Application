using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class TimeSpanMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlightTime",
                table: "Flights");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "TimeOfFlight",
                table: "Flights",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeOfFlight",
                table: "Flights");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "FlightTime",
                table: "Flights",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
