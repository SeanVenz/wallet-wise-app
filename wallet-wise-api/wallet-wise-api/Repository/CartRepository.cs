using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

namespace wallet_wise_api.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly FirestoreContext _context;
        private readonly CollectionReference _cartCollection;

        public CartRepository(FirestoreContext context)
        {
            _context = context;
            _cartCollection = _context.Db.Collection("carts");
        }

        public async void AddToCart(Cart cartItem)
        {
            if (cartItem == null)
            {
                throw new ArgumentNullException(nameof(cartItem));
            }

            await _cartCollection.AddAsync(cartItem);
        }

        public async Task<List<Cart>> GetCartItems(string userId)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<Cart>()).ToList();
        }

        public async void RemoveFromCart(string userId, string foodId)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId).WhereEqualTo("FoodId", foodId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            if (snapshot.Documents.Any())
            {
                var document = snapshot.Documents.First();
                await document.Reference.DeleteAsync();
            }
        }

        public async void RemoveCartItems(string userId)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            foreach (var document in snapshot.Documents)
            {
                await document.Reference.DeleteAsync();
            }
        }

        public async void AddHasCurrentOrder(string userId)
        {
            var userRef = _context.Db.Collection("users").Document(userId);

            var updateData = new Dictionary<string, object>
            {
                { "hasCurrentOrder", true }
            };
            await userRef.UpdateAsync(updateData);
        }


        public async Task<bool> CheckHasCurrentOrder(string userId)
        {
            var orderQuery = _context.Db.Collection("orders").WhereEqualTo("UserId", userId).WhereEqualTo("OrderDate", DateTime.Today);
            var snapshot = await orderQuery.GetSnapshotAsync();

            return snapshot.Documents.Any();
        }

        public async void Checkout(string userId)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            if (snapshot.Documents.Any())
            {
                var orderedItems = snapshot.Documents.Select(doc => doc.ConvertTo<Cart>()).ToList();
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.Now,
                    OrderedItems = orderedItems.Select(item => new Food
                    {
                        Id = item.FoodId,
                        Quantity = item.Quantity,
                        // Add more ordered item details as needed
                    }).ToList()
                };

                var orderRef = await _context.Db.Collection("orders").AddAsync(order);

                foreach (var document in snapshot.Documents)
                {
                    await document.Reference.DeleteAsync();
                }
            }
        }

        public async void UpdateFoodQuantity(string userId, string foodId, int newQuantity)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId).WhereEqualTo("FoodId", foodId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            if (snapshot.Documents.Any())
            {
                var document = snapshot.Documents.First();
                var cartItem = document.ConvertTo<Cart>();
                cartItem.Quantity = newQuantity;

                await document.Reference.SetAsync(cartItem);
            }
        }

        public async void AddFoodQuantity(string userId, string foodId, int newQuantity)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId).WhereEqualTo("FoodId", foodId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            if (snapshot.Documents.Any())
            {
                var document = snapshot.Documents.First();
                var cartItem = document.ConvertTo<Cart>();
                cartItem.Quantity = newQuantity + 1;

                await document.Reference.SetAsync(cartItem);
            }
        }

        public async void DeductFoodQuantity(string userId, string foodId, int newQuantity)
        {
            var cartQuery = _cartCollection.WhereEqualTo("UserId", userId).WhereEqualTo("FoodId", foodId);
            var snapshot = await cartQuery.GetSnapshotAsync();

            if (snapshot.Documents.Any())
            {
                var document = snapshot.Documents.First();
                var cartItem = document.ConvertTo<Cart>();
                cartItem.Quantity = newQuantity - 1;

                await document.Reference.SetAsync(cartItem);
            }
        }

        public async void AddHasCurrentDelivery(string userId)
        {
            var userRef = _context.Db.Collection("users").Document(userId);

            var updateData = new Dictionary<string, object>
            {
                { "hasCurrentDelivery", true }
            };
            await userRef.UpdateAsync(updateData);
        }

        public async Task<bool> CheckHasCurrentDelivery(string userId)
        {
            var orderQuery = _context.Db.Collection("orders").WhereEqualTo("UserId", userId).WhereEqualTo("OrderDate", DateTime.Today);
            var snapshot = await orderQuery.GetSnapshotAsync();

            return snapshot.Documents.Any();
        }
    }
}
