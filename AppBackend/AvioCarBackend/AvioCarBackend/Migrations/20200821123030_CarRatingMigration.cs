using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class CarRatingMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarRating",
                table: "Cars");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfCarGrades",
                table: "Cars",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OverallGrade",
                table: "Cars",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfCarGrades",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "OverallGrade",
                table: "Cars");

            migrationBuilder.AddColumn<double>(
                name: "CarRating",
                table: "Cars",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
