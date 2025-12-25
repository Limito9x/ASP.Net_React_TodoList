using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class TaskLogkMapping : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<RequestTaskLogDto, TaskLog>()
                .Map(dest => dest.Data, src => src.Data);
        }
    }
}
