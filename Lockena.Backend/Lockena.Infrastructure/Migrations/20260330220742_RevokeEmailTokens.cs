using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lockena.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RevokeEmailTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRevoked",
                table: "EmailTokens",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRevoked",
                table: "EmailTokens");
        }
    }
}
