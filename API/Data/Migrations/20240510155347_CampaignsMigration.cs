using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class CampaignsMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Campaign",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false),
                    Budget = table.Column<double>(type: "REAL", nullable: false),
                    CostPerPlay = table.Column<double>(type: "REAL", nullable: false),
                    InsufficientFunds = table.Column<bool>(type: "INTEGER", nullable: false),
                    NumPlays = table.Column<int>(type: "INTEGER", nullable: false),
                    NumClicks = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetMinAge = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetMaxAge = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetEthnicities = table.Column<string>(type: "TEXT", nullable: true),
                    TargetGenreInterests = table.Column<string>(type: "TEXT", nullable: true),
                    AdvertisingUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    AdvertisementId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Campaign", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Campaign_Advertisements_AdvertisementId",
                        column: x => x.AdvertisementId,
                        principalTable: "Advertisements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Campaign_AspNetUsers_AdvertisingUserId",
                        column: x => x.AdvertisingUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Campaign_AdvertisementId",
                table: "Campaign",
                column: "AdvertisementId");

            migrationBuilder.CreateIndex(
                name: "IX_Campaign_AdvertisingUserId",
                table: "Campaign",
                column: "AdvertisingUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Campaign");
        }
    }
}
