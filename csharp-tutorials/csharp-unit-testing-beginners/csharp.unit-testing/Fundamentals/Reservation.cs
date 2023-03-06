namespace csharp.unit_testing.Fundamentals
{
    public class Reservation
    {
        public User MadeBy { get; set; }

        public bool CanBeCancelledBy(User user)
        {
            return (user.IsAdmin || MadeBy == user);

            // Reservation Scenarios
            //
            // 1. When the user is an admin
            // 2. When the user is the same person who made the reservation
            // 3. When someone else tries to cancel the reservation
            //
        }
    }

    public class User
    {
        public bool IsAdmin { get; set; }
    }
}