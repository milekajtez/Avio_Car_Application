using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class FlightMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlightRating",
                table: "Flights");

            migrationBuilder.AddColumn<int>(
                name: "FlightPrice",
                table: "Flights",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfFlightGrades",
                table: "Flights",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlightPrice",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "NumberOfFlightGrades",
                table: "Flights");

            migrationBuilder.AddColumn<double>(
                name: "FlightRating",
                table: "Flights",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
