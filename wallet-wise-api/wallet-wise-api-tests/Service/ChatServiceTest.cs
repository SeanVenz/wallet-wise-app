using AutoMapper;
using Moq;
using System;
using System.Threading.Tasks;
using wallet_wise_api.Dto;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;
using Xunit;

namespace wallet_wise_api_tests.Service
{
    public class ChatServiceTest
    {
        private readonly ChatService _service;
        private readonly Mock<IChatRepository> _mockChatRepository;
        private readonly Mock<IMapper> _mockMapper;

        public ChatServiceTest()
        {
            _mockChatRepository = new Mock<IChatRepository>();
            _mockMapper = new Mock<IMapper>();

            _service = new ChatService(_mockChatRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetChat_ValidId_ReturnsChatDto()
        {
            // Arrange
            var chatId = "testChatId";
            var chatModel = new Chat { };
            var chatDto = new ChatDto { };

            _mockChatRepository.Setup(repository => repository.GetChat(chatId))
                .ReturnsAsync(chatModel);
            _mockMapper.Setup(mapper => mapper.Map<ChatDto>(chatModel))
                .Returns(chatDto);

            // Act
            var result = await _service.GetChat(chatId);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<ChatDto>(result);
        }

        [Fact]
        public async Task GetChat_InvalidId_ReturnsNull()
        {
            // Arrange
            var chatId = "invalidChatId";

            _mockChatRepository.Setup(repository => repository.GetChat(chatId))
                .ReturnsAsync((Chat)null);

            // Act
            var result = await _service.GetChat(chatId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task SendChat_ValidChatDto_SendsChatAndReturnsChatDto()
        {
            // Arrange
            var chatDto = new ChatDto { };
            var chatModel = new Chat {  };

            _mockMapper.Setup(mapper => mapper.Map<Chat>(chatDto))
                .Returns(chatModel);
            _mockChatRepository.Setup(repository => repository.SendChat(chatModel))
                .ReturnsAsync(chatModel);
            _mockMapper.Setup(mapper => mapper.Map<ChatDto>(chatModel))
                .Returns(chatDto);

            // Act
            var result = await _service.SendChat(chatDto);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<ChatDto>(result);
        }

        [Fact]
        public async Task SendChat_InvalidChatDto_ThrowsException()
        {
            // Arrange
            ChatDto chatDto = null;

            // Act
            async Task Act() => await _service.SendChat(chatDto);

            // Assert
            var exception = await Assert.ThrowsAsync<ArgumentNullException>(Act);
            Assert.Equal("chatDto", exception.ParamName);
        }
    }
}
