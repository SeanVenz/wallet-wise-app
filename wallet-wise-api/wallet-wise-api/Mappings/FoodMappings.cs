using AutoMapper;

public class FoodMappings : Profile
{
    public FoodMappings()
    {
        //CreateMap<Food, FoodCreationDto>();
        CreateMap<FoodCreationDto, Food>();
        CreateMap<Food, FoodDto>();
    }
}
