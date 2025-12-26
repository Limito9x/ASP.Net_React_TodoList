using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class PhaseMapping : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<RequestPhaseDto, Phase>()
                .Map(dest => dest.Goals, src => src.Goals);
        }
    }
}
