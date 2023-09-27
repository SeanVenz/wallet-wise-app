namespace wallet_wise_api.Repository
{
    /// <summary>
    /// Represents the repository interface for managing chat-related operations.
    /// </summary>
    public interface IChatRepository
    {
        /// <summary>
        /// Retrieves a chat conversation by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the chat conversation.</param>
        /// <returns>The chat conversation.</returns>
        public Task<Chat> GetChat(string id);

        /// <summary>
        /// Sends a chat message within a chat conversation.
        /// </summary>
        /// <param name="chat">The chat message to be sent.</param>
        /// <returns>The updated chat conversation.</returns>
        public Task<Chat> SendChat(Chat chat);

        /// <summary>
        /// Sets up a chat room for two users.
        /// </summary>
        /// <param name="userA">The first user in the chat room.</param>
        /// <param name="userB">The second user in the chat room.</param>
        /// <returns>The created chat room.</returns>
        public Task<Chat> SetChatRoom(User userA, User userB);

        /// <summary>
        /// Retrieves a chat room by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the chat room.</param>
        /// <returns>The chat room.</returns>
        public Task<Chat> GetChatRoom(string id);
    }
}
