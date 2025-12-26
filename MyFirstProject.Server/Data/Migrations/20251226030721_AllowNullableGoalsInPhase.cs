using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using MyFirstProject.Server.Models;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AllowNullableGoalsInPhase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<GoalConfig>>(
                name: "Goals",
                table: "Phases",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(List<GoalConfig>),
                oldType: "jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<GoalConfig>>(
                name: "Goals",
                table: "Phases",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(List<GoalConfig>),
                oldType: "jsonb",
                oldNullable: true);
        }
    }
}
