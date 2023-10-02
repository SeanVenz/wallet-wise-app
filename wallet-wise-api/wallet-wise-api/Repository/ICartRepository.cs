namespace wallet_wise_api.Repository
{
    /// <summary>
    /// Represents the repository interface for managing shopping cart-related operations.
    /// </summary>
    public interface ICartRepository
    {
        /// <summary>
        /// Adds an item to the user's shopping cart.
        /// </summary>
        /// <param name="cartItems">The cart item to be added.</param>
        public void AddToCart(Cart cartItems);

        /// <summary>
        /// Retrieves the list of items in the user's shopping cart.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A list of cart items.</returns>
        public Task<List<Cart>> GetCartItems(string userId);

        /// <summary>
        /// Removes a specific item from the user's shopping cart.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="foodId">The unique identifier of the food item to be removed.</param>
        public void RemoveFromCart(string userId, string foodId);

        /// <summary>
        /// Removes all items from the user's shopping cart.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        public void RemoveCartItems(string userId);

        /// <summary>
        /// Marks that the user has a current order.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        public void AddHasCurrentOrder(string userId);

        /// <summary>
        /// Checks if the user has a current order.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>True if the user has a current order, otherwise false.</returns>
        public Task<bool> CheckHasCurrentOrder(string userId);

        public void AddHasCurrentDelivery(string userId);

        public Task<bool> CheckHasCurrentDelivery(string userId);

        /// <summary>
        /// Completes the checkout process for the user's current order.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        public void Checkout(string userId);

        /// <summary>
        /// Adds a specified quantity to the food item in the user's shopping cart.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="foodId">The unique identifier of the food item.</param>
        /// <param name="newQuantity">The quantity to be added.</param>
        public void AddFoodQuantity(string userId, string foodId, int newQuantity);

        /// <summary>
        /// Deducts a specified quantity from the food item in the user's shopping cart.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="foodId">The unique identifier of the food item.</param>
        /// <param name="newQuantity">The quantity to be deducted.</param>
        public void DeductFoodQuantity(string userId, string foodId, int newQuantity);

        /// <summary>
        /// Updates the quantity of a food item in the user's shopping cart.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="foodId">The unique identifier of the food item.</param>
        /// <param name="newQuantity">The new quantity.</param>
        public void UpdateFoodQuantity(string userId, string foodId, int newQuantity);
    }
}
