using AutoMapper;

namespace wallet_wise_api.Mappings
{
    public class UserMappings : Profile
    {
        public UserMappings() 
        {
            CreateMap<User, UserDto>();
        }
    }
}
