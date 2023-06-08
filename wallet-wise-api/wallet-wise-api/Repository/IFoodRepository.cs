namespace wallet_wise_api.Repository
{
    public interface IFoodRepository
    {
        public Task<string> CreateFood(Food food, IFormFile file);
        public Task<IEnumerable<Food>> GetAllFoods();
        public Task<Food?> GetFood(string documentId);
    }
}
