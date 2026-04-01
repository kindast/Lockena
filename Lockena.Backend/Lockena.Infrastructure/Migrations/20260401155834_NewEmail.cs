using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lockena.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NewEmail",
                table: "EmailTokens",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewEmail",
                table: "EmailTokens");
        }
    }
}
