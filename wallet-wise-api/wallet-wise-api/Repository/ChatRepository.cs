using System;
using System.Threading.Tasks;
using Google.Cloud.Firestore;

namespace wallet_wise_api.Repository
{
    public class ChatRepository : IChatRepository
    {
        private readonly FirestoreContext _context;
        private readonly CollectionReference _chatCollection;

        public ChatRepository(FirestoreContext context)
        {
            _context = context;
            _chatCollection = _context.Db.Collection("chats");
        }

        public async Task<Chat> GetChat(string id)
        {
            var chatDocument = await _chatCollection.Document(id).GetSnapshotAsync();
            if (chatDocument.Exists)
            {
                return chatDocument.ConvertTo<Chat>();
            }

            return null;
        }

        public async Task<Chat> SendChat(Chat chat)
        {
            if (chat == null)
            {
                throw new ArgumentNullException(nameof(chat));
            }

            chat.TimeStamp = DateTime.UtcNow; // Set the timestamp to the current UTC time
            var chatDocumentReference = await _chatCollection.AddAsync(chat);
            var chatDocumentSnapshot = await chatDocumentReference.GetSnapshotAsync();
            if (chatDocumentSnapshot.Exists)
            {
                return chatDocumentSnapshot.ConvertTo<Chat>();
            }

            return null;
        }

        public async Task<Chat> SetChatRoom(User userA, User userB)
        {
            // Create a new chat room document that represents the chat room.
            var chatRoom = new Chat
            {
                Sender = "system", // You can use "system" or any other identifier for system-generated messages.
                Text = $"Chat room created between {userA.FullName} and {userB.FullName}",
                TimeStamp = DateTime.UtcNow
            };

            var chatDocumentReference = await _chatCollection.AddAsync(chatRoom);
            var chatDocumentSnapshot = await chatDocumentReference.GetSnapshotAsync();
            if (chatDocumentSnapshot.Exists)
            {
                return chatDocumentSnapshot.ConvertTo<Chat>();
            }

            return null;
        }

        public async Task<Chat> GetChatRoom(string id)
        {
            // Retrieve a chat room document by its ID.
            var chatDocument = await _chatCollection.Document(id).GetSnapshotAsync();
            if (chatDocument.Exists)
            {
                return chatDocument.ConvertTo<Chat>();
            }

            return null;
        }
    }
}
