using AutoMapper;

public class OrderMappings : Profile
{
    public OrderMappings()
    {
        CreateMap<Order, OrderDto>();
    }
}
