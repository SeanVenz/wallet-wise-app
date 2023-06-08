using AutoMapper;
using wallet_wise_api.Dto;

namespace wallet_wise_api.Mappings
{
    public class FoodMappings : Profile
    {
        public FoodMappings()
        {
            CreateMap<FoodCreationDto, Food>();
            CreateMap<Food, FoodCreationDto>();
            CreateMap<Food, FoodDto>();
        }
    }
}
