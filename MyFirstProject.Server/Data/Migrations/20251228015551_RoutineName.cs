using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class RoutineName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Routines",
                newName: "Name");

            migrationBuilder.RenameIndex(
                name: "IX_Routines_Title_UserId",
                table: "Routines",
                newName: "IX_Routines_Name_UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Routines",
                newName: "Title");

            migrationBuilder.RenameIndex(
                name: "IX_Routines_Name_UserId",
                table: "Routines",
                newName: "IX_Routines_Title_UserId");
        }
    }
}
