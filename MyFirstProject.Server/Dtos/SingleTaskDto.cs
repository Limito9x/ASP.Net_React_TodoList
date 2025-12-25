using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Dtos
{
    public record RequestSingleTaskDto
    (
        string Name,
        string? Description,
        DateTime? DueDate,
        DateTime? StartAt,
        DateTime? EndAt,
        SingleTaskType Type,
        List<int>? LinkedGoalIds,
        List<Form>? Forms,
        int? PhaseId
    );

    public record ExecuteSingleTaskDto
    (
        SingleTaskStatus Status,
        DateTime? CompletedAt,
        string? Note,
        List<MetadataForm>? Data
    );

    public record ResponseSingleTaskDto
    (
        int Id,
        string Name,
        string? Description,
        DateTime? DueDate,
        DateTime? CompletedAt,
        DateTime? StartAt,
        DateTime? EndAt,
        SingleTaskStatus Status,
        SingleTaskType Type,
        string? Note,
        List<MetadataForm> Forms,
        List<int> LinkedGoalIds,
        int? PhaseId
    );
}
