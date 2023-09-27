using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading.Tasks;
using wallet_wise_api.Controllers;
using wallet_wise_api.Dto;
using wallet_wise_api.Service;
using Xunit;

namespace wallet_wise_api_tests.Controllers
{
    public class ChatControllerTest
    {
        [Fact]
        public async Task GetChat_ValidId_ReturnsOkResult()
        {
            // Arrange
            var chatId = "testChatId";
            var chatServiceMock = new Mock<IChatService>();
            chatServiceMock.Setup(service => service.GetChat(chatId))
                .ReturnsAsync(new ChatDto { Sender = "UserA", Text = "Hello" });

            var loggerMock = new Mock<ILogger<ChatController>>();
            var controller = new ChatController(chatServiceMock.Object, loggerMock.Object);

            // Act
            var result = await controller.GetChat(chatId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var chatDto = Assert.IsType<ChatDto>(okResult.Value);
            Assert.Equal("UserA", chatDto.Sender);
            Assert.Equal("Hello", chatDto.Text);
        }

        [Fact]
        public async Task SendChat_ValidChatDto_ReturnsCreatedAtAction()
        {
            // Arrange
            var chatDto = new ChatDto { Sender = "UserA", Text = "Hello" };
            var chatServiceMock = new Mock<IChatService>();
            chatServiceMock.Setup(service => service.SendChat(chatDto))
                .ReturnsAsync(new ChatDto { Sender = "UserA", Text = "Hello" });

            var loggerMock = new Mock<ILogger<ChatController>>();
            var controller = new ChatController(chatServiceMock.Object, loggerMock.Object);

            // Act
            var result = await controller.SendChat(chatDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var chatResponse = Assert.IsType<ChatDto>(createdAtActionResult.Value);
            Assert.Equal("UserA", chatResponse.Sender);
            Assert.Equal("Hello", chatResponse.Text);
        }

        [Fact]
        public async Task SendChat_InvalidChatDto_ReturnsBadRequest()
        {
            // Arrange
            var chatServiceMock = new Mock<IChatService>();
            var loggerMock = new Mock<ILogger<ChatController>>();
            var controller = new ChatController(chatServiceMock.Object, loggerMock.Object);

            // Act
            var result = await controller.SendChat(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SetChatRoom_InvalidRequest_ReturnsBadRequest()
        {
            // Arrange
            var chatServiceMock = new Mock<IChatService>();
            var loggerMock = new Mock<ILogger<ChatController>>();
            var controller = new ChatController(chatServiceMock.Object, loggerMock.Object);

            // Act
            var result = await controller.SetChatRoom(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetChatRoom_ValidId_ReturnsOkResult()
        {
            // Arrange
            var chatRoomId = "testChatRoomId";
            var chatServiceMock = new Mock<IChatService>();
            chatServiceMock.Setup(service => service.GetChatRoom(chatRoomId))
                .ReturnsAsync(new ChatDto { Sender = "UserA", Text = "Hello" });

            var loggerMock = new Mock<ILogger<ChatController>>();
            var controller = new ChatController(chatServiceMock.Object, loggerMock.Object);

            // Act
            var result = await controller.GetChatRoom(chatRoomId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var chatDto = Assert.IsType<ChatDto>(okResult.Value);
            Assert.Equal("UserA", chatDto.Sender);
            Assert.Equal("Hello", chatDto.Text);
        }
    }
}
