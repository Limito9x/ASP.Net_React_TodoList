using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrationAssetPublicId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "Assets",
                newName: "PublicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PublicId",
                table: "Assets",
                newName: "FilePath");
        }
    }
}
