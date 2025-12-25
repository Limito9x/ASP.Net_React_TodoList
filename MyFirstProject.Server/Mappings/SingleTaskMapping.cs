using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class SingleTaskMapping: IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ExecuteSingleTaskDto, SingleTask>()
                .Map(dest => dest.Data, src => src.Data);             
        }
    }
}
