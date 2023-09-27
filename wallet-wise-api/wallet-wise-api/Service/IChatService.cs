using System.Threading.Tasks;
using wallet_wise_api.Dto;

namespace wallet_wise_api.Service
{
    public interface IChatService
    {
        Task<ChatDto> GetChat(string id);
        Task<ChatDto> SendChat(ChatDto chatDto);
        Task<ChatDto> SetChatRoom(UserDto userA, UserDto userB);
        Task<ChatDto> GetChatRoom(string id);
    }
}
