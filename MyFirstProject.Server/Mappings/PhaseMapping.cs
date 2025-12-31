using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class PhaseMapping : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // Map từ RequestPhaseDto -> Phase
            config.NewConfig<RequestPhaseDto, Phase>()
                .Map(dest => dest.Goals, src => src.Goals ?? new List<GoalConfig>());
            
            // Map từ Phase -> ResponsePhaseDto
            config.NewConfig<Phase, ResponsePhaseDto>()
                .Map(dest => dest.Routines, src => src.Routines)
                .Map(dest => dest.SingleTasks, src => src.SingleTasks);

            config.NewConfig<Phase, SimpleResponsePhaseDto>()
                .Map(dest => dest.Goals, src => src.Goals);
        }
    }
}
