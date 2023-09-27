using System.Threading.Tasks;
using wallet_wise_api.Dto;

namespace wallet_wise_api.Service
{
    /// <summary>
    /// Represents the service interface for managing chat-related operations.
    /// </summary>
    public interface IChatService
    {
        /// <summary>
        /// Retrieves a chat by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the chat.</param>
        /// <returns>A chat DTO representing the chat.</returns>
        public Task<ChatDto> GetChat(string id);

        /// <summary>
        /// Sends a chat message.
        /// </summary>
        /// <param name="chatDto">The chat DTO containing the message to send.</param>
        /// <returns>A chat DTO representing the sent message.</returns>
        public Task<ChatDto> SendChat(ChatDto chatDto);

        /// <summary>
        /// Sets up a chat room between two users.
        /// </summary>
        /// <param name="userA">The DTO of the first user.</param>
        /// <param name="userB">The DTO of the second user.</param>
        /// <returns>A chat DTO representing the chat room.</returns>
        public Task<ChatDto> SetChatRoom(UserDto userA, UserDto userB);

        /// <summary>
        /// Retrieves a chat room by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the chat room.</param>
        /// <returns>A chat DTO representing the chat room.</returns>
        public Task<ChatDto> GetChatRoom(string id);
    }
}
