using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangePlanTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Categories_CategoryId",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Tasks",
                newName: "PlanId");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_CategoryId",
                table: "Tasks",
                newName: "IX_Tasks_PlanId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Categories",
                newName: "Title");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Categories",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Progress",
                table: "Categories",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Categories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Categories_PlanId",
                table: "Tasks",
                column: "PlanId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Categories_PlanId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "PlanId",
                table: "Tasks",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_PlanId",
                table: "Tasks",
                newName: "IX_Tasks_CategoryId");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Categories",
                newName: "Name");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Categories_CategoryId",
                table: "Tasks",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
