using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class DeletingAdministrtorEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminType",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "UserType",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserType",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "AdminType",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }
    }
}
