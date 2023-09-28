using AutoMapper;
using System;
using wallet_wise_api.Mappings;
using wallet_wise_api.Dto;
using Xunit;

namespace wallet_wise_api_tests.Mappings
{
    public class ChatMappingsTest
    {
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;

        public ChatMappingsTest()
        {
            _configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ChatMappings>();
            });
            _mapper = _configuration.CreateMapper();
        }

        [Fact]
        public void ChatMapsToChatDto_MapsCorrectly_ReturnsMappedChatDto()
        {
            // Arrange
            var chat = new Chat
            {
                Sender = "UserA",
                Text = "Hello",
                TimeStamp = DateTime.Now
            };

            // Act
            var result = _mapper.Map<ChatDto>(chat);

            // Assert
            Assert.Equal(chat.Sender, result.Sender);
            Assert.Equal(chat.Text, result.Text);
            Assert.Equal(chat.TimeStamp, result.TimeStamp);
        }

        [Fact]
        public void ChatMapsToChatDto_NullInput_ReturnsNull()
        {
            // Arrange
            Chat chat = null;

            // Act
            var result = _mapper.Map<ChatDto>(chat);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void ChatDtoMapsToChat_MapsCorrectly_ReturnsMappedChat()
        {
            // Arrange
            var chatDto = new ChatDto
            {
                Sender = "UserA",
                Text = "Hello",
                TimeStamp = DateTime.Now
            };

            // Act
            var result = _mapper.Map<Chat>(chatDto);

            // Assert
            Assert.Equal(chatDto.Sender, result.Sender);
            Assert.Equal(chatDto.Text, result.Text);
            Assert.Equal(chatDto.TimeStamp, result.TimeStamp);
        }

        [Fact]
        public void ChatDtoMapsToChat_NullInput_ReturnsNull()
        {
            // Arrange
            ChatDto chatDto = null;

            // Act
            var result = _mapper.Map<Chat>(chatDto);

            // Assert
            Assert.Null(result);
        }
    }
}
