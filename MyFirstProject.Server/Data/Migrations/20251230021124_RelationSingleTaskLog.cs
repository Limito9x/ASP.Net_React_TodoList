using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using MyFirstProject.Server.Models;

#nullable disable

namespace MyFirstProject.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class RelationSingleTaskLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLogs_Routines_RoutineId",
                table: "TaskLogs");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "LinkedGoalIds",
                table: "Tasks",
                newName: "LinkedGoals");

            migrationBuilder.RenameColumn(
                name: "LinkedGoalIds",
                table: "Routines",
                newName: "LinkedGoals");

            migrationBuilder.AlterColumn<int>(
                name: "RoutineId",
                table: "TaskLogs",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletedAt",
                table: "TaskLogs",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<List<Contribution>>(
                name: "Contributions",
                table: "TaskLogs",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PhaseId",
                table: "TaskLogs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SingleTaskId",
                table: "TaskLogs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "TaskLogs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Routines",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExpectedTotalCount",
                table: "Routines",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Routines",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_TaskLogs_PhaseId",
                table: "TaskLogs",
                column: "PhaseId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskLogs_SingleTaskId",
                table: "TaskLogs",
                column: "SingleTaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLogs_Phases_PhaseId",
                table: "TaskLogs",
                column: "PhaseId",
                principalTable: "Phases",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLogs_Routines_RoutineId",
                table: "TaskLogs",
                column: "RoutineId",
                principalTable: "Routines",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLogs_Tasks_SingleTaskId",
                table: "TaskLogs",
                column: "SingleTaskId",
                principalTable: "Tasks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskLogs_Phases_PhaseId",
                table: "TaskLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskLogs_Routines_RoutineId",
                table: "TaskLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskLogs_Tasks_SingleTaskId",
                table: "TaskLogs");

            migrationBuilder.DropIndex(
                name: "IX_TaskLogs_PhaseId",
                table: "TaskLogs");

            migrationBuilder.DropIndex(
                name: "IX_TaskLogs_SingleTaskId",
                table: "TaskLogs");

            migrationBuilder.DropColumn(
                name: "Contributions",
                table: "TaskLogs");

            migrationBuilder.DropColumn(
                name: "PhaseId",
                table: "TaskLogs");

            migrationBuilder.DropColumn(
                name: "SingleTaskId",
                table: "TaskLogs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TaskLogs");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Routines");

            migrationBuilder.DropColumn(
                name: "ExpectedTotalCount",
                table: "Routines");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Routines");

            migrationBuilder.RenameColumn(
                name: "LinkedGoals",
                table: "Tasks",
                newName: "LinkedGoalIds");

            migrationBuilder.RenameColumn(
                name: "LinkedGoals",
                table: "Routines",
                newName: "LinkedGoalIds");

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "Tasks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<List<MetadataForm>>(
                name: "Data",
                table: "Tasks",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Tasks",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "RoutineId",
                table: "TaskLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CompletedAt",
                table: "TaskLogs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskLogs_Routines_RoutineId",
                table: "TaskLogs",
                column: "RoutineId",
                principalTable: "Routines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
