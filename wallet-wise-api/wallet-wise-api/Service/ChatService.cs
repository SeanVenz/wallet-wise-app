using AutoMapper;
using System;
using System.Threading.Tasks;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;

public class ChatService : IChatService
{
    private readonly IChatRepository _repository;
    private readonly IMapper _mapper;

    public ChatService(IChatRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ChatDto> GetChat(string id)
    {
        var chat = await _repository.GetChat(id);
        return _mapper.Map<ChatDto>(chat);
    }

    public async Task<ChatDto> SendChat(ChatDto chatDto)
    {
        if (chatDto == null)
        {
            throw new ArgumentNullException(nameof(chatDto));
        }

        var chat = _mapper.Map<Chat>(chatDto);
        var result = await _repository.SendChat(chat);
        return _mapper.Map<ChatDto>(result);
    }

    public async Task<ChatDto> SetChatRoom(UserDto userA, UserDto userB)
    {
        if (userA == null || userB == null)
        {
            throw new ArgumentNullException(nameof(userA) + ", " + nameof(userB));
        }

        var chatRoom = await _repository.SetChatRoom(_mapper.Map<User>(userA), _mapper.Map<User>(userB));
        return _mapper.Map<ChatDto>(chatRoom);
    }

    public async Task<ChatDto> GetChatRoom(string id)
    {
        var chatRoom = await _repository.GetChatRoom(id);
        return _mapper.Map<ChatDto>(chatRoom);
    }
}
