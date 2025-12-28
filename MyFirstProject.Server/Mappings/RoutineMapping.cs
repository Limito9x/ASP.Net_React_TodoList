using Mapster;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Helpers;

public class RoutineMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<RequestRoutineDto, Routine>()
            .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds ?? new List<int>())
            .Map(dest => dest.LinkedGoalIds, src => src.LinkedGoalIds ?? new List<string>())
            .AfterMapping((src, dest) =>
            {
                // Dùng UtcNow để đồng bộ với Database Postgres
                var now = DateTime.UtcNow;
                var todaySchedule = now.Date.Add(src.ScheduledTime.ToTimeSpan());

                // Nếu giờ hẹn hôm nay đã qua, tính từ thời điểm hiện tại để tìm lần tới
                var baseDate = todaySchedule < now ? now : todaySchedule;

                // Tính toán ngày xuất hiện đầu tiên
                dest.NextOccurrence = RoutineHelper.GetFirstOccurrence(baseDate, dest.ScheduledTime, dest.Rule);
            });
    }
}