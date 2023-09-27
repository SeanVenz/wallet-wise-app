namespace wallet_wise_api.Repository
{
    /// <summary>
    /// Represents the repository interface for user-related operations.
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Signs up a new user.
        /// </summary>
        /// <param name="user">The user DTO containing registration information.</param>
        /// <returns>A string representing the result of the signup operation.</returns>
        public Task<string> SignUp(UserDto user);

        /// <summary>
        /// Logs in a user with the provided email and password.
        /// </summary>
        /// <param name="email">The email of the user.</param>
        /// <param name="password">The password of the user.</param>
        /// <returns>A string representing the result of the login operation.</returns>
        public Task<string> Login(string email, string password);

        /// <summary>
        /// Sends a verification email to the specified email address.
        /// </summary>
        /// <param name="email">The email address to send the verification email to.</param>
        /// <returns>A string representing the result of the email sending operation.</returns>
        public Task<string> SendVerificationEmail(string email);

        /// <summary>
        /// Logs out the current user.
        /// </summary>
        public void Logout();

        /// <summary>
        /// Sends a reset password email to the specified email address.
        /// </summary>
        /// <param name="email">The email address to send the reset password email to.</param>
        public void SendResetPasswordEmail(string email);
    }
}
