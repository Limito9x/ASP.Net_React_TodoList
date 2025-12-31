using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Enums;

public record RequestRoutineDto(
    string Name,
    string? Description,
    DateTime? StartDate,
    DateTime? EndDate,
    TimeOnly ScheduledTime,
    RecurrenceRule Rule,
    List<int>? LinkedFormIds, // Dùng int ngay từ đầu
    List<LinkedGoal>? LinkedGoals,
    int? PhaseId
);

public record CheckinRoutineDto(
    TaskLogStatus Outcome,
    List<Contribution>? Contributions,
    string? Note,
    List<MetadataForm>? Data
);

public record ResponseRoutineDto(
    int Id,
    string Name,
    string? Description,
    TimeOnly ScheduledTime,
    RecurrenceRule Rule,
    DateTime NextOccurrence,
    List<ResponseFormDto>? Forms,
    List<LinkedGoal>? LinkedGoals,
    int? PhaseId,
    List<TaskLogDto>? TaskLogs
);

public record SimpleResponseRoutineDto(
    int Id,
    string Name,
    string? Description,
    TimeOnly ScheduledTime,
    RecurrenceRule Rule,
    DateTime NextOccurrence, // Sửa chính tả 2 chữ r
    List<LinkedGoal> LinkedGoals,
    int? PhaseId
);