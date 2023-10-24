using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using wallet_wise_api.Controllers;
using wallet_wise_api.Service;
using Xunit;

namespace wallet_wise_api_tests.Controllers
{
    public class CartControllerTest
    {
        [Fact]
        public async Task GetCartItems_ValidUserId_ReturnsOkResult()
        {
            // Arrange
            var userId = "testUserId";
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.GetCartItems(userId))
                .ReturnsAsync(new List<CartDto> { new CartDto(), new CartDto() });

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.GetCartItems(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var cartItems = Assert.IsType<List<CartDto>>(okResult.Value);
            Assert.Equal(2, cartItems.Count); 
        }

        [Fact]
        public async Task AddToCart_InvalidCartItem_ReturnsBadRequest()
        {
            // Arrange
            var cartServiceMock = new Mock<ICartService>();
            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.AddToCart(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task RemoveFromCart_ValidUserIdAndFoodId_ReturnsNoContent()
        {
            // Arrange
            var userId = "testUserId";
            var foodId = "food1";
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.RemoveFromCart(userId, foodId))
                .Returns(Task.CompletedTask);

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.RemoveFromCart(userId, foodId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task RemoveCartItems_ValidUserId_ReturnsNoContent()
        {
            // Arrange
            var userId = "testUserId";
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.RemoveCartItems(userId))
                .Returns(Task.CompletedTask);

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.RemoveCartItems(userId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task AddHasCurrentOrder_ValidUserId_ReturnsNoContent()
        {
            // Arrange
            var userId = "testUserId";
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.AddHasCurrentOrder(userId))
                .Returns(Task.CompletedTask);

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.AddHasCurrentOrder(userId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task CheckHasCurrentOrder_ValidUserId_ReturnsOkResult()
        {
            // Arrange
            var userId = "testUserId";
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.CheckHasCurrentOrder(userId))
                .ReturnsAsync(true); 

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.CheckHasCurrentOrder(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.True((bool)okResult.Value);
        }

        [Fact]
        public async Task CheckHasCurrentOrder_InvalidUserId_ReturnsOkResult()
        {
            // Arrange
            var userId = "invalidUserId";
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.CheckHasCurrentOrder(userId))
                .ReturnsAsync(false); 

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.CheckHasCurrentOrder(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.False((bool)okResult.Value);
        }

        //[Fact]
        //public async Task Checkout_ValidUserId_ReturnsNoContent()
        //{
        //    // Arrange
        //    var userId = "testUserId";
        //    var cartServiceMock = new Mock<ICartService>();
        //    cartServiceMock.Setup(service => service.Checkout(userId))
        //        .Returns(Task.CompletedTask);

        //    var controller = new CartController(cartServiceMock.Object, null);

        //    // Act
        //    var result = await controller.Checkout(userId);

        //    // Assert
        //    Assert.IsType<NoContentResult>(result);
        //}

        [Fact]
        public async Task UpdateFoodQuantity_ValidUserIdAndFoodId_ReturnsNoContent()
        {
            // Arrange
            var userId = "testUserId";
            var foodId = "food1";
            var newQuantity = 5;
            var cartServiceMock = new Mock<ICartService>();
            cartServiceMock.Setup(service => service.UpdateFoodQuantity(userId, foodId, newQuantity))
                .Returns(Task.CompletedTask);

            var controller = new CartController(cartServiceMock.Object, null);

            // Act
            var result = await controller.UpdateFoodQuantity(userId, foodId, newQuantity);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}