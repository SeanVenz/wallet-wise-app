namespace wallet_wise_api.Service
{
    public interface IFoodService
    {
        /// <summary>
        /// Creates Food
        /// </summary>
        /// <param name="food">Food Dto in creation</param>
        /// <returns>Newly created Food</returns>
        public Task<FoodDto?> CreateFood(FoodCreationDto food);

        /// <summary>
        /// Gets all Foods
        /// </summary>
        /// <returns>IEnumerable of Food</returns>
        public Task<IEnumerable<FoodDto>> GetAllFoods();
    }
}
