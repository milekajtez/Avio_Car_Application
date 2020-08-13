using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class ChangeRatingFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarServiceRating",
                table: "RentACarServices");

            migrationBuilder.DropColumn(
                name: "AirlineRating",
                table: "Airlines");

            migrationBuilder.AddColumn<double>(
                name: "CarServicePrice",
                table: "RentACarServices",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NumberOfCarServiceGrades",
                table: "RentACarServices",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "AirlinePrice",
                table: "Airlines",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NumberOfAirlineGrades",
                table: "Airlines",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarServicePrice",
                table: "RentACarServices");

            migrationBuilder.DropColumn(
                name: "NumberOfCarServiceGrades",
                table: "RentACarServices");

            migrationBuilder.DropColumn(
                name: "AirlinePrice",
                table: "Airlines");

            migrationBuilder.DropColumn(
                name: "NumberOfAirlineGrades",
                table: "Airlines");

            migrationBuilder.AddColumn<double>(
                name: "CarServiceRating",
                table: "RentACarServices",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "AirlineRating",
                table: "Airlines",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
