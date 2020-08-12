using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class ChangeDicountsRules : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPointsDiscountsTable",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "UserJMBG",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "NumberOfPointsDicounts",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "QuickReservationDicounts",
                table: "UserPointsDiscountsTable");

            migrationBuilder.AddColumn<string>(
                name: "DicountID",
                table: "UserPointsDiscountsTable",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Dicount1200",
                table: "UserPointsDiscountsTable",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Dicount300",
                table: "UserPointsDiscountsTable",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Dicount600",
                table: "UserPointsDiscountsTable",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Points",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPointsDiscountsTable",
                table: "UserPointsDiscountsTable",
                column: "DicountID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPointsDiscountsTable",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "DicountID",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "Dicount1200",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "Dicount300",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "Dicount600",
                table: "UserPointsDiscountsTable");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<long>(
                name: "UserJMBG",
                table: "UserPointsDiscountsTable",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<double>(
                name: "NumberOfPointsDicounts",
                table: "UserPointsDiscountsTable",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Points",
                table: "UserPointsDiscountsTable",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "QuickReservationDicounts",
                table: "UserPointsDiscountsTable",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPointsDiscountsTable",
                table: "UserPointsDiscountsTable",
                column: "UserJMBG");
        }
    }
}
