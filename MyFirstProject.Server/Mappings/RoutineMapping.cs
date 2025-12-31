using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Helpers;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Mappings
{
    public class RoutineMapping : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // Request -> Entity: Tạo Routine mới
            config.NewConfig<RequestRoutineDto, Routine>()
                .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds ?? new List<int>())
                .Map(dest => dest.LinkedGoals, src => src.LinkedGoals ?? new List<LinkedGoal>())
                .Map(dest => dest.StartDate, src => src.StartDate ?? DateTime.UtcNow)
                .Map(dest => dest.EndDate, src => src.EndDate)
                .AfterMapping((src, dest) =>
                {
                    try
                    {
                        // ✅ Sử dụng StartDate từ request hoặc UtcNow
                        var startDate = src.StartDate ?? DateTime.UtcNow;

                        // Tính NextOccurrence
                        dest.NextOccurrence = RoutineHelper.GetFirstOccurrence(
                            startDate,
                            src.ScheduledTime,
                            src.Rule
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[RoutineMapping] Error calculating NextOccurrence: {ex.Message}");
                        // Fallback: Set NextOccurrence = hôm nay + ScheduledTime
                        dest.NextOccurrence = DateTime.UtcNow.Date.Add(src.ScheduledTime.ToTimeSpan());
                    }
                });

            // Entity -> Response: Lấy Routine đầy đủ
            config.NewConfig<Routine, ResponseRoutineDto>()
                .Map(dest => dest.Forms, src => (List<ResponseFormDto>?)null)  // Populate riêng nếu cần
                .Map(dest => dest.TaskLogs, src => (List<TaskLogDto>?)null);   // Populate riêng nếu cần

            // Entity -> Simple: Lấy thông tin cơ bản
            config.NewConfig<Routine, SimpleResponseRoutineDto>();

            // Entity -> ScheduleToday: Map cho schedule view
            config.NewConfig<Routine, ScheduleTodayDto>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Type, src => "Routine")
                .Map(dest => dest.SubType, src => default(SingleTaskType?))
                .Map(dest => dest.StartAt, src => src.NextOccurrence)
                .Map(dest => dest.EndAt, src => default(DateTime?))
                .Map(dest => dest.DueDate, src => src.NextOccurrence)
                .Map(dest => dest.LinkedGoals, src => src.LinkedGoals)
                .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds)
                .Map(dest => dest.Phase, src => src.Phase);
        }
    }
}