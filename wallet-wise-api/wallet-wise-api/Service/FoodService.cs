using wallet_wise_api.Repository;

namespace wallet_wise_api.Service
{
    public class FoodService : IFoodService
    {
        private readonly IFoodRepository _repository;

        public FoodService(IFoodRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> CreateFood(Food food)
        {
            return await _repository.CreateFood(food);
        }
    }
}
