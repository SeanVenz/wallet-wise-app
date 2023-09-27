using AutoMapper;

public class ChatMappings : Profile
{
    public ChatMappings()
    {
        CreateMap<Chat, ChatDto>();
        CreateMap<ChatDto, Chat >();
    }
}
