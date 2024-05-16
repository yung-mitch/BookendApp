using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class Campaigns2Migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Campaign_Advertisements_AdvertisementId",
                table: "Campaign");

            migrationBuilder.DropForeignKey(
                name: "FK_Campaign_AspNetUsers_AdvertisingUserId",
                table: "Campaign");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Campaign",
                table: "Campaign");

            migrationBuilder.RenameTable(
                name: "Campaign",
                newName: "Campaigns");

            migrationBuilder.RenameIndex(
                name: "IX_Campaign_AdvertisingUserId",
                table: "Campaigns",
                newName: "IX_Campaigns_AdvertisingUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Campaign_AdvertisementId",
                table: "Campaigns",
                newName: "IX_Campaigns_AdvertisementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Campaigns",
                table: "Campaigns",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Campaigns_Advertisements_AdvertisementId",
                table: "Campaigns",
                column: "AdvertisementId",
                principalTable: "Advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Campaigns_AspNetUsers_AdvertisingUserId",
                table: "Campaigns",
                column: "AdvertisingUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Campaigns_Advertisements_AdvertisementId",
                table: "Campaigns");

            migrationBuilder.DropForeignKey(
                name: "FK_Campaigns_AspNetUsers_AdvertisingUserId",
                table: "Campaigns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Campaigns",
                table: "Campaigns");

            migrationBuilder.RenameTable(
                name: "Campaigns",
                newName: "Campaign");

            migrationBuilder.RenameIndex(
                name: "IX_Campaigns_AdvertisingUserId",
                table: "Campaign",
                newName: "IX_Campaign_AdvertisingUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Campaigns_AdvertisementId",
                table: "Campaign",
                newName: "IX_Campaign_AdvertisementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Campaign",
                table: "Campaign",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Campaign_Advertisements_AdvertisementId",
                table: "Campaign",
                column: "AdvertisementId",
                principalTable: "Advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Campaign_AspNetUsers_AdvertisingUserId",
                table: "Campaign",
                column: "AdvertisingUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
