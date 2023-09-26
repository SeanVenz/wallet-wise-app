namespace wallet_wise_api.Repository
{
    public interface ICartRepository
    {
        public void AddToCart(Cart cartItems);

        public Task<List<Cart>> GetCartItems(string userId);

        public void RemoveFromCart(string userId, string foodId);

        public void RemoveCartItems(string userId);

        public void AddHasCurrentOrder(string userId);

        public Task<bool> CheckHasCurrentOrder(string userId);

        public void Checkout(string userId);

        public void UpdateFoodQuantity(string userId, string foodId, int newQuantity);
    }
}
