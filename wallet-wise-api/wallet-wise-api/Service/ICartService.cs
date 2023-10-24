namespace wallet_wise_api.Service
{
    /// <summary>
    /// Represents the service interface for managing shopping cart-related operations.
    /// </summary>
    public interface ICartService
    {
        /// <summary>
        /// Adds an item to the user's shopping cart.
        /// </summary>
        /// <param name="cartItemDto">The cart item DTO to add to the cart.</param>
        public Task AddToCart(CartDto cartItemDto);

        /// <summary>
        /// Retrieves the items in the user's shopping cart.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        /// <returns>A list of cart item DTOs in the user's cart.</returns>
        public Task<List<CartDto>> GetCartItems(string userId);

        /// <summary>
        /// Removes an item from the user's shopping cart.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        /// <param name="foodId">The unique identifier of the food item to remove.</param>
        public Task RemoveFromCart(string userId, string foodId);

        /// <summary>
        /// Removes all items from the user's shopping cart.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        public Task RemoveCartItems(string userId);

        /// <summary>
        /// Marks that the user has a current order in progress.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        public Task AddHasCurrentOrder(string userId);

        /// <summary>
        /// Checks if the user has a current order in progress.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        /// <returns>True if the user has a current order; otherwise, false.</returns>
        public Task<bool> CheckHasCurrentOrder(string userId);

        public Task AddHasCurrentDelivery(string userId);

        public Task<bool> CheckHasCurrentDelivery(string userId);

        /// <summary>
        /// Completes the checkout process for the user's shopping cart.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        //public Task Checkout(string userId);

        /// <summary>
        /// Updates the quantity of a food item in the user's shopping cart.
        /// </summary>
        /// <param name="userId">The user's unique identifier.</param>
        /// <param name="foodId">The unique identifier of the food item.</param>
        /// <param name="newQuantity">The new quantity of the food item.</param>
        public Task UpdateFoodQuantity(string userId, string foodId, int newQuantity);
    }
}
