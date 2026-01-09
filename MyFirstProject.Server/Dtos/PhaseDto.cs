using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Dtos
{
    public record RequestPhaseDto
    (
        string Title,
        string? Description,
        DateTime? StartDate,
        DateTime? EndDate,
        int PlanId,
        int UserId,
        List<GoalConfig>? Goals,
        List<RequestRoutineDto>? RequestRoutineDtos,
        List<RequestSingleTaskDto>? RequestSingleTaskDtos
    );

    public record UpdatePhaseDto
(
    int? Id,
    string Title,
    string? Description,
    DateTime? StartDate,
    DateTime? EndDate,
    int PlanId,
    int UserId,
    List<GoalConfig>? Goals,
    List<RequestRoutineDto>? RequestRoutineDtos,
    List<RequestSingleTaskDto>? RequestSingleTaskDtos
);

    public record ResponsePhaseDto
    (
        int Id,
        string Title,
        string? Description,
        DateTime? StartDate,
        DateTime? EndDate,
        int PlanId,
        int Order,
        List<GoalConfig>? Goals,
        decimal? Progress,
        List<SimpleResponseRoutineDto>? Routines,
        List<SimpleResponseSingleTaskDto>? SingleTasks
    );

    public record SimpleResponsePhaseDto
    (
        int Id,
        string Title,
        string? Description,
        DateTime? StartDate,
        DateTime? EndDate,
        SimpleResponsePlanDto? Plan,
        List<GoalConfig>? Goals,
        int Order,
        decimal? Progress
    );
}
