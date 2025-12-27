using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Dtos
{
    public record RequestRoutineDto
    (
        string Title,
        string? Description,
        TimeOnly ScheduledTime,
        RecurrenceRule Rule,
        List<string>? LinkedFormIds,
        List<int>? LinkedGoalIds,
        int? PhaseId
    );

    public record ResponseRoutineDto
    (
        int Id,
        string Title,
        string? Description,
        TimeOnly ScheduledTime,
        RecurrenceRule Rule,
        DateTime NextOccurence,
        List<ResponseFormDto> Forms,
        List<int> LinkedGoalIds,
        int? PhaseId,
        List<TaskLogDto>? TaskLogs
    );

    public record SimpleResponseRoutineDto
    (
        int Id,
        string Title,
        string? Description,
        TimeOnly ScheduledTime,
        RecurrenceRule Rule,
        DateTime NextOccurence,
        List<int> LinkedGoalIds,
        int? PhaseId
    );
}
