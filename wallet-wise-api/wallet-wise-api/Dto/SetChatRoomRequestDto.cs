using Google.Cloud.Firestore;

namespace wallet_wise_api.Dto
{
    public class SetChatRoomRequestDto
    {
        [FirestoreProperty]
        public UserDto? UserA { get; set; }
        [FirestoreProperty]
        public UserDto? UserB { get; set; }
    }
}
