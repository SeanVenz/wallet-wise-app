namespace wallet_wise_api.Repository
{
    public interface IFoodRepository
    {
        Task<string> CreateFood(Food food);
    }
}
