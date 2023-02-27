using csharp.unit_testing.Fundamentals;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace csharp.unit_testing.Tests
{
    [TestClass]
    public class ReservationTests
    {
        [TestMethod]
        public void CanBeCancelledBy_UserIsAdmin_ReturnsTrue()
        {
            // Arrange
            var reservation = new Reservation();

            // Act
            var result = reservation.CanBeCancelledBy(new User { IsAdmin = true });

            // Assert
            Assert.IsTrue(result);
        }
    }
}