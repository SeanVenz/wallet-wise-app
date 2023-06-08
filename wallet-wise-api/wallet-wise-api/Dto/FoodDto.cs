using Google.Cloud.Firestore;

namespace wallet_wise_api.Dto
{
    [FirestoreData]
    public class FoodDto
    {
        [FirestoreProperty]
        public string? FoodType { get; set; }
        [FirestoreProperty]
        public string? Name { get; set; }
        [FirestoreProperty]
        public bool isAvailable { get; set; }
        [FirestoreProperty]
        public int Price { get; set; }
        [FirestoreProperty]
        public string? ImageUrl { get; set; }
    }
}
