using AutoMapper;

public class FoodMappings : Profile
{
    public FoodMappings()
    {
        CreateMap<FoodCreationDto, Food>();
        CreateMap<Food, FoodCreationDto>();
        CreateMap<Food, FoodDto>();
    }
}
