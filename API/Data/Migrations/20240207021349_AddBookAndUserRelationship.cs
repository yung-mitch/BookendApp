using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookAndUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PublishingUserId",
                table: "Books",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Books_PublishingUserId",
                table: "Books",
                column: "PublishingUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_AspNetUsers_PublishingUserId",
                table: "Books",
                column: "PublishingUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_AspNetUsers_PublishingUserId",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_Books_PublishingUserId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "PublishingUserId",
                table: "Books");
        }
    }
}
