using AutoMapper;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;

public class CartService : ICartService
{
    private readonly ICartRepository _repository;
    private readonly IMapper _mapper;

    public CartService(ICartRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task AddToCart(CartDto cartItemDto)
    {
        if (cartItemDto == null)
        {
            throw new ArgumentNullException(nameof(cartItemDto));
        }

        var cartItem = _mapper.Map<Cart>(cartItemDto);
        _repository.AddToCart(cartItem);
    }

    public async Task<List<CartDto>> GetCartItems(string userId)
    {
        var cartItems = await _repository.GetCartItems(userId);
        return _mapper.Map<List<CartDto>>(cartItems);
    }

    public async Task RemoveFromCart(string userId, string foodId)
    {
       _repository.RemoveFromCart(userId, foodId);
    }

    public async Task RemoveCartItems(string userId)
    {
        _repository.RemoveCartItems(userId);
    }

    public async Task AddHasCurrentOrder(string userId)
    {
        _repository.AddHasCurrentOrder(userId);
    }

    public async Task<bool> CheckHasCurrentOrder(string userId)
    {
        return await _repository.CheckHasCurrentOrder(userId);
    }

    public async Task Checkout(string userId)
    {
        _repository.Checkout(userId);
    }

    public async Task UpdateFoodQuantity(string userId, string foodId, int newQuantity)
    {
        _repository.UpdateFoodQuantity(userId, foodId, newQuantity);
    }
}