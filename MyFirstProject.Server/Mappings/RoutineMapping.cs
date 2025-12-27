using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class RoutineMapping : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // Map t? RequestRoutineDto -> Routine
            config.NewConfig<RequestRoutineDto, Routine>()
                .Map(dest => dest.LinkedFormIds, src => src.LinkedFormIds ?? new List<string>())
                .Map(dest => dest.LinkedGoalIds, src => src.LinkedGoalIds ?? new List<int>());
            
            // Map t? Routine -> SimpleResponseRoutineDto
            config.NewConfig<Routine, SimpleResponseRoutineDto>();
        }
    }
}
