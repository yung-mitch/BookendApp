using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class BookClubsAddition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookClubs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClubName = table.Column<string>(type: "TEXT", nullable: true),
                    OwningUserId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookClubs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookClubs_AspNetUsers_OwningUserId",
                        column: x => x.OwningUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserClubs",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookClubId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClubs", x => new { x.BookClubId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserClubs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserClubs_BookClubs_BookClubId",
                        column: x => x.BookClubId,
                        principalTable: "BookClubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookClubs_OwningUserId",
                table: "BookClubs",
                column: "OwningUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserClubs_UserId",
                table: "UserClubs",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserClubs");

            migrationBuilder.DropTable(
                name: "BookClubs");
        }
    }
}
