namespace wallet_wise_api.Repository
{
    /// <summary>
    /// Represents the repository interface for managing user-related operations.
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Registers a new user with the system.
        /// </summary>
        /// <param name="user">The user model to be registered.</param>
        /// <returns>A unique identifier for the registered user.</returns>
        public Task<string> SignUp(User user);

        /// <summary>
        /// Logs in a user using their email and password.
        /// </summary>
        /// <param name="email">The email address of the user.</param>
        /// <param name="password">The password of the user.</param>
        /// <returns>A unique identifier for the logged-in user.</returns>
        public Task<string> Login(string email, string password);

        /// <summary>
        /// Sends a verification email to a user's email address.
        /// </summary>
        /// <param name="email">The email address to send the verification email to.</param>
        /// <returns>A message indicating the status of the email sending operation.</returns>
        public Task<string> SendVerificationEmail(string email);

        /// <summary>
        /// Logs out the currently authenticated user.
        /// </summary>
        public void Logout();

        /// <summary>
        /// Sends a reset password email to a user's email address.
        /// </summary>
        /// <param name="email">The email address to send the reset password email to.</param>
        public void SendResetPasswordEmail(string email);
    }
}
