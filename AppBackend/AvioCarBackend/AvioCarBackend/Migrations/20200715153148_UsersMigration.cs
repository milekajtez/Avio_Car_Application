using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class UsersMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminJMBG",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AdminPassword",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AdminUsername",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "E_mail",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "RegisteredUsername",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TelephoneNumber",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserJMBG",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "AdminJMBG",
                table: "AspNetUsers",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdminPassword",
                table: "AspNetUsers",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdminUsername",
                table: "AspNetUsers",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "E_mail",
                table: "AspNetUsers",
                type: "nvarchar(55)",
                maxLength: 55,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "AspNetUsers",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegisteredUsername",
                table: "AspNetUsers",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TelephoneNumber",
                table: "AspNetUsers",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "UserJMBG",
                table: "AspNetUsers",
                type: "bigint",
                nullable: true);
        }
    }
}
