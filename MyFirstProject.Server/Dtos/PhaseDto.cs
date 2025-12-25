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
        List<GoalConfig> Goals,
        decimal? Progress,
        List<Routine>? Routines,
        List<SingleTask>? SingleTasks
    );

    public record SimpleResponsePhaseDto
    (
        int Id,
        string Title,
        string? Description,
        DateTime? StartDate,
        DateTime? EndDate,
        int PlanId,
        int Order,
        decimal? Progress
    );
}
