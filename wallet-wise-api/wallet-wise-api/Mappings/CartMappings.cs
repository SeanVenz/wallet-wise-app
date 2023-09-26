using AutoMapper;

public class CartMappings : Profile
{
    public CartMappings()
    {
        CreateMap<Cart, CartDto>();
        CreateMap<CartDto, Cart>();
    }
}
