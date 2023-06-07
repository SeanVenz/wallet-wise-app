namespace wallet_wise_api.Service
{
    public interface IFoodService
    {
        Task<string> CreateFood(Food food);
    }
}
