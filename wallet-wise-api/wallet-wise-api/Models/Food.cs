using Google.Cloud.Firestore;

[FirestoreData]
public class Food
{
    [FirestoreProperty]
    public string? FoodType { get; set; }
    [FirestoreProperty]
    public string? Name { get; set; }
    [FirestoreProperty]
    public bool isAvailable { get; set; }
    [FirestoreProperty]
    public int Price { get; set; }
}
