namespace wallet_wise_api.Repository
{
    public interface IChatRepository
    {
        public Task <Chat> GetChat(string id);
        
        public Task <Chat> SendChat(Chat chat);

        public Task<Chat> SetChatRoom(User userA, User userB);

        public Task<Chat> GetChatRoom(string id);
    }
}
