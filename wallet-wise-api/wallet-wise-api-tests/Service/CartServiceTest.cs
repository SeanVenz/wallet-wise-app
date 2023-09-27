using AutoMapper;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using wallet_wise_api.Dto;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;
using Xunit;

namespace wallet_wise_api_tests.Service
{
    public class CartServiceTest
    {
        private readonly CartService _service;
        private readonly Mock<ICartRepository> _mockCartRepository;
        private readonly Mock<IMapper> _mockMapper;

        public CartServiceTest()
        {
            _mockCartRepository = new Mock<ICartRepository>();
            _mockMapper = new Mock<IMapper>();

            _service = new CartService(_mockCartRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task AddToCart_ValidCartItem_AddsCartItem()
        {
            // Arrange
            var cartItemDto = new CartDto();
            var cartItemModel = new Cart();

            _mockMapper.Setup(mapper => mapper.Map<Cart>(cartItemDto))
                .Returns(cartItemModel);

            // Act
            await _service.AddToCart(cartItemDto);

            // Assert
            _mockCartRepository.Verify(repository => repository.AddToCart(cartItemModel), Times.Once);
        }

        [Fact]
        public async Task AddToCart_InvalidCartItem_ThrowsException()
        {
            // Arrange
            CartDto cartItemDto = null;

            // Act
            async Task Act() => await _service.AddToCart(cartItemDto);

            // Assert
            var exception = await Assert.ThrowsAsync<ArgumentNullException>(Act);
            Assert.Equal("cartItemDto", exception.ParamName);
        }

        [Fact]
        public async Task GetCartItems_ValidUserId_ReturnsCartItems()
        {
            // Arrange
            var userId = "testUserId";
            var cartItemsModel = new List<Cart> { new Cart(), new Cart() };
            var cartItemsDto = new List<CartDto> { new CartDto(), new CartDto() };

            _mockCartRepository.Setup(repository => repository.GetCartItems(userId))
                .ReturnsAsync(cartItemsModel);
            _mockMapper.Setup(mapper => mapper.Map<List<CartDto>>(cartItemsModel))
                .Returns(cartItemsDto);

            // Act
            var result = await _service.GetCartItems(userId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<List<CartDto>>(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task RemoveFromCart_ValidUserIdAndFoodId_RemovesCartItem()
        {
            // Arrange
            var userId = "testUserId";
            var foodId = "food1";

            // Act
            await _service.RemoveFromCart(userId, foodId);

            // Assert
            _mockCartRepository.Verify(repository => repository.RemoveFromCart(userId, foodId), Times.Once);
        }
    }
}
