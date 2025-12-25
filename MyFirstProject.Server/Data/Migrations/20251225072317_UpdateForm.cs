using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using MyFirstProject.Server.Models;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Plans_PlanId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_PlanId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Routines_Forms",
                table: "Routines");

            migrationBuilder.DropColumn(
                name: "LinkedGoalId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "PlanId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Forms",
                table: "Routines");

            migrationBuilder.DropColumn(
                name: "LinkedGoalId",
                table: "Routines");

            migrationBuilder.RenameColumn(
                name: "Forms",
                table: "TaskLogs",
                newName: "Data");

            migrationBuilder.RenameIndex(
                name: "IX_TaskLogs_Forms",
                table: "TaskLogs",
                newName: "IX_TaskLogs_Data");

            migrationBuilder.AddColumn<List<int>>(
                name: "LinkedGoalIds",
                table: "Tasks",
                type: "integer[]",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "LinkedGoalIds",
                table: "Routines",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "FormRoutines",
                columns: table => new
                {
                    FormsId = table.Column<int>(type: "integer", nullable: false),
                    RoutinesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormRoutines", x => new { x.FormsId, x.RoutinesId });
                    table.ForeignKey(
                        name: "FK_FormRoutines_Forms_FormsId",
                        column: x => x.FormsId,
                        principalTable: "Forms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormRoutines_Routines_RoutinesId",
                        column: x => x.RoutinesId,
                        principalTable: "Routines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormSingleTask",
                columns: table => new
                {
                    FormsId = table.Column<int>(type: "integer", nullable: false),
                    SingleTasksId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormSingleTask", x => new { x.FormsId, x.SingleTasksId });
                    table.ForeignKey(
                        name: "FK_FormSingleTask_Forms_FormsId",
                        column: x => x.FormsId,
                        principalTable: "Forms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormSingleTask_Tasks_SingleTasksId",
                        column: x => x.SingleTasksId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormRoutines_RoutinesId",
                table: "FormRoutines",
                column: "RoutinesId");

            migrationBuilder.CreateIndex(
                name: "IX_FormSingleTask_SingleTasksId",
                table: "FormSingleTask",
                column: "SingleTasksId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormRoutines");

            migrationBuilder.DropTable(
                name: "FormSingleTask");

            migrationBuilder.DropColumn(
                name: "LinkedGoalIds",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "LinkedGoalIds",
                table: "Routines");

            migrationBuilder.RenameColumn(
                name: "Data",
                table: "TaskLogs",
                newName: "Forms");

            migrationBuilder.RenameIndex(
                name: "IX_TaskLogs_Data",
                table: "TaskLogs",
                newName: "IX_TaskLogs_Forms");

            migrationBuilder.AddColumn<int>(
                name: "LinkedGoalId",
                table: "Tasks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlanId",
                table: "Tasks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<List<MetadataForm>>(
                name: "Forms",
                table: "Routines",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "LinkedGoalId",
                table: "Routines",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_PlanId",
                table: "Tasks",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Routines_Forms",
                table: "Routines",
                column: "Forms")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Plans_PlanId",
                table: "Tasks",
                column: "PlanId",
                principalTable: "Plans",
                principalColumn: "Id");
        }
    }
}
