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
        List<LinkedGoal>? LinkedGoals,
        List<int>? LinkedFormIds,
        int? PhaseId
    );

    public record ExecuteSingleTaskDto
    (
        TaskLogStatus Outcome,
        List<Contribution>? Contributions,
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
        List<MetadataForm> Data,
        List<LinkedGoal> LinkedGoals,
        List<int> LinkedFormIds,
        int? PhaseId
    );

    public record SimpleResponseSingleTaskDto
    (
        int Id,
        string Name,
        string? Description,
        DateTime? DueDate,
        DateTime? CompletedAt,
        SingleTaskStatus Status,
        SingleTaskType Type,
        int? PhaseId,
        List<string>? LinkedGoalIds,
        List<int>? LinkedFormIds
    );
}
