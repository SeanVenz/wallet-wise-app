namespace wallet_wise_api.Service
{
    public interface ICartService
    {
        Task AddToCart(CartDto cartItemDto);
        Task<List<CartDto>> GetCartItems(string userId);
        Task RemoveFromCart(string userId, string foodId);
        Task RemoveCartItems(string userId);
        Task AddHasCurrentOrder(string userId);
        Task<bool> CheckHasCurrentOrder(string userId);
        Task Checkout(string userId);
        Task UpdateFoodQuantity(string userId, string foodId, int newQuantity);
    }
}
