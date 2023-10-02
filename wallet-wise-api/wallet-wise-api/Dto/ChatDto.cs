using Google.Cloud.Firestore;
using Google.Type;
using DateTime = System.DateTime;

[FirestoreData]
public class ChatDto
{
    [FirestoreProperty]
    public string? Sender { get; set; }
    [FirestoreProperty]
    public string? Text { get; set; }
    [FirestoreProperty]
    public DateTime? TimeStamp { get; set; }
}
