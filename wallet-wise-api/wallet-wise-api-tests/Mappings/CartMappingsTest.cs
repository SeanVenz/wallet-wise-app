using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wallet_wise_api_tests.Mappings
{
    public class CartMappingsTest
    {
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;

        public CartMappingsTest()
        {
            _configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<CartMappings>();
            });
            _mapper = _configuration.CreateMapper();
        }

        [Fact]
        public void CartMapsToCartDto_MapsCorrectly_ReturnsMappedCartDto()
        {
            // Arrange
            var cart = new Cart
            {
                // Set properties according to your entity class
            };

            // Act
            var result = _mapper.Map<CartDto>(cart);

            // Assert
            Assert.Equal(cart.Name, result.Name); // Replace with actual property names
            Assert.Equal(cart.StoreName, result.StoreName);
            // Add more assertions for other properties
        }

        [Fact]
        public void CartMapsToCartDto_NullInput_ReturnsNull()
        {
            // Arrange
            Cart cart = null;

            // Act
            var result = _mapper.Map<CartDto>(cart);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void CartDtoMapsToCart_MapsCorrectly_ReturnsMappedCart()
        {
            // Arrange
            var cartDto = new CartDto
            {
                // Set properties according to your DTO class
            };

            // Act
            var result = _mapper.Map<Cart>(cartDto);

            // Assert
            Assert.Equal(cartDto.StoreName, result.StoreName); 
            Assert.Equal(cartDto.Name, result.Name);
        }

        [Fact]
        public void CartDtoMapsToCart_NullInput_ReturnsNull()
        {
            // Arrange
            CartDto cartDto = null;

            // Act
            var result = _mapper.Map<Cart>(cartDto);

            // Assert
            Assert.Null(result);
        }
    }
}
