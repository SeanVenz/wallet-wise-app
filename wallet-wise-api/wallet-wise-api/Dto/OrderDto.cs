using Google.Cloud.Firestore;
using Google.Type;

[FirestoreData]
public class OrderDto
{
    [FirestoreProperty]
    public string? Name { get; set; }
    [FirestoreProperty]
    public int? Quantity { get; set; }
    [FirestoreProperty]
    public string? Price { get; set; }
    [FirestoreProperty]
    public string? UserId { get; set; }
    [FirestoreProperty]
    public System.DateTime? OrderDate { get; set; }
    [FirestoreProperty]
    public List<Food> OrderedItems { get; set; }
}
