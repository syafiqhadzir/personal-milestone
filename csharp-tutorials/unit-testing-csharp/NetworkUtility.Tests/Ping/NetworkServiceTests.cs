using FluentAssertions;
using NetworkUtility.Ping;

namespace NetworkUtility.Tests.Ping
{
    public class NetworkServiceTests
    {
        [Fact]
        public void NetworkService_SendPing_ReturnString()
        {
            // Arrange - variables, classes, mocks
            var pingService = new NetworkService();

            // Act
            var result = pingService.SendPing();

            // Assert
            result.Should().NotBeNullOrWhiteSpace();
            result.Should().Be("Success: Ping sent!");
            result.Should().Contain("Success", Exactly.Once());
        }
    }
}