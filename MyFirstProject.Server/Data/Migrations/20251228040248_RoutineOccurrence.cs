using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class RoutineOccurrence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NextOccurence",
                table: "Routines",
                newName: "NextOccurrence");

            migrationBuilder.RenameIndex(
                name: "IX_Routines_NextOccurence",
                table: "Routines",
                newName: "IX_Routines_NextOccurrence");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NextOccurrence",
                table: "Routines",
                newName: "NextOccurence");

            migrationBuilder.RenameIndex(
                name: "IX_Routines_NextOccurrence",
                table: "Routines",
                newName: "IX_Routines_NextOccurence");
        }
    }
}
