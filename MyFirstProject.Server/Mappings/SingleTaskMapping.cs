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
                .Map(dest => dest.LinkedGoalIds, src => src.LinkedGoalIds ?? new List<string>())
                .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds ?? new List<int>());
            
            // Map từ ExecuteSingleTaskDto -> SingleTask (chỉ update Data và các field liên quan)
            config.NewConfig<ExecuteSingleTaskDto, SingleTask>()
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.CompletedAt, src => src.CompletedAt)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.Data, src => src.Data ?? new List<MetadataForm>())
                .IgnoreNonMapped(true);
            
            // Map từ SingleTask -> SimpleResponseSingleTaskDto
            config.NewConfig<SingleTask, SimpleResponseSingleTaskDto>();
        }
    }
}
