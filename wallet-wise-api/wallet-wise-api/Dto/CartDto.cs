using Google.Cloud.Firestore;

[FirestoreData]
public class CartDto
{
    [FirestoreProperty]
    public string? FoodId { get; set; }
    [FirestoreProperty]
    public string? Name { get; set; }
    [FirestoreProperty]
    public int? UnitPrice { get; set; }
    [FirestoreProperty]
    public int Quantity { get; set; }
    [FirestoreProperty]
    public int TotalPrice { get; set; }
    [FirestoreProperty]
    public string? StoreName { get; set; }
    [FirestoreProperty]
    public int? Number { get; set; }
}
