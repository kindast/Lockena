using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lockena.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Refactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VaultItems_BlindIndex",
                table: "VaultItems");

            migrationBuilder.DropColumn(
                name: "BlindIndex",
                table: "VaultItems");

            migrationBuilder.DropColumn(
                name: "ItemKeyIv",
                table: "VaultItems");

            migrationBuilder.DropColumn(
                name: "PayloadIv",
                table: "VaultItems");

            migrationBuilder.DropColumn(
                name: "MasterKeyIv",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BlindIndex",
                table: "VaultItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ItemKeyIv",
                table: "VaultItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PayloadIv",
                table: "VaultItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MasterKeyIv",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_VaultItems_BlindIndex",
                table: "VaultItems",
                column: "BlindIndex");
        }
    }
}
