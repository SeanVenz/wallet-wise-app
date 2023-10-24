using Google.Cloud.Firestore;

[FirestoreData]
public class Food
{
    [FirestoreProperty]
    public string? Id { get; set; }
    [FirestoreProperty]
    public string? FoodType { get; set; }
    [FirestoreProperty]
    public string? Name { get; set; }
    [FirestoreProperty]
    public bool isAvailable { get; set; }
    [FirestoreProperty]
    public string? Price { get; set; }
    [FirestoreProperty]
    public string? Quantity { get; set; }
    [FirestoreProperty]
    public string? ImageUrl { get; set; }
    public IFormFile? File { get; set; }
}
