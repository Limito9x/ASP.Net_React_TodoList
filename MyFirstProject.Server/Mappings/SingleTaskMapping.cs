using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class SingleTaskMapping: IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // Map từ RequestSingleTaskDto -> SingleTask
            config.NewConfig<RequestSingleTaskDto, SingleTask>()
                .Map(dest => dest.LinkedGoals, src => src.LinkedGoals ?? new List<LinkedGoal>())
                .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds ?? new List<int>());
            
            // Map từ SingleTask -> SimpleResponseSingleTaskDto
            config.NewConfig<SingleTask, SimpleResponseSingleTaskDto>();

            config.NewConfig<SingleTask, ScheduleTodayDto>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Type, src => "Single") // Chuỗi literal
                .Map(dest => dest.SubType, src => src.Type) // SingleTaskType
                .Map(dest => dest.StartAt, src => src.StartAt ?? src.CreatedAt) // Fallback nếu null
                .Map(dest => dest.EndAt, src => src.EndAt)
                .Map(dest => dest.DueDate, src => src.DueDate)
                .Map(dest => dest.LinkedGoals, src => src.LinkedGoals)
                .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds)
                .Map(dest => dest.Phase, src => src.Phase);
        }
    }
}
