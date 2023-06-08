using wallet_wise_api.Dto;

namespace wallet_wise_api.Service
{
    public interface IFoodService
    {
        public Task<FoodDto?> CreateFood(FoodCreationDto food, IFormFile file);
        public Task<IEnumerable<FoodDto>> GetAllFoods();
    }
}
