using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

public record RequestRoutineDto(
    string Name,
    string? Description,
    TimeOnly ScheduledTime,
    RecurrenceRule Rule,
    List<int>? LinkedFormIds, // Dùng int ngay từ đầu
    List<string>? LinkedGoalIds, // GoalId trong JSONB là UUID (string)
    int? PhaseId
);

public record ResponseRoutineDto(
    int Id,
    string Name,
    string? Description,
    TimeOnly ScheduledTime,
    RecurrenceRule Rule,
    DateTime NextOccurrence, // 2 chữ r
    List<ResponseFormDto>? Forms,
    List<string>? LinkedGoalIds,
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
    List<string> LinkedGoalIds,
    int? PhaseId
);