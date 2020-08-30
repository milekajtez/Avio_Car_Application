using Microsoft.EntityFrameworkCore.Migrations;

namespace AvioCarBackend.Migrations
{
    public partial class UserTicketsMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserTickets",
                columns: table => new
                {
                    UserName = table.Column<long>(nullable: false),
                    TicketID = table.Column<long>(nullable: false),
                    FriendConfirmed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTickets", x => new { x.UserName, x.TicketID });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTickets");
        }
    }
}
