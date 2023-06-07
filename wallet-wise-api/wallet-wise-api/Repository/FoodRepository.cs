using Google.Cloud.Firestore;

namespace wallet_wise_api.Repository
{
    public class FoodRepository : IFoodRepository
    {
        private readonly FirestoreContext _context;
        private readonly CollectionReference _foodCollection;
        private DocumentReference _foodDocument;

        public FoodRepository(FirestoreContext context)
        {
            _context = context;
            _foodCollection = _context.Db.Collection("food");
        }

        public async Task<string> CreateFood(Food food)
        {
            _foodDocument = await _foodCollection.AddAsync(food);
            return _foodDocument.Id;
        }
    }
}
