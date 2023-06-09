namespace wallet_wise_api.Repository
{
    public interface IFoodRepository
    {
        /// <summary>
        /// Creates Food in Firebase
        /// </summary>
        /// <param name="food">Food model</param>
        /// <returns>Newly created food</returns>
        public Task<string> CreateFood(Food food);

        /// <summary>
        /// Gets all Food form Firebase
        /// </summary>
        /// <returns>IENumerable of FOod</returns>
        public Task<IEnumerable<Food>> GetAllFoods();

        /// <summary>
        /// Gets a single Food from Firebase using its documentId
        /// </summary>
        /// <param name="documentId">Document ID of the Food</param>
        /// <returns>A single Food</returns>
        public Task<Food?> GetFood(string documentId);
    }
}
