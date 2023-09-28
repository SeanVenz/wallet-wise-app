using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;

namespace wallet_wise_api.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly FirestoreContext _context;
        private readonly CollectionReference _userCollection;

        public UserRepository(FirestoreContext context)
        {
            _context = context;
            _userCollection = _context.Db.Collection("users");
        }

        public async Task<string> SignUp(User user)
        {
            user.Id = Guid.NewGuid().ToString();
            await _userCollection.Document(user.Id).SetAsync(user);
            return user.Id;
        }

        public async Task<string> Login(string email, string password)
        {
            var userQuery = await _userCollection.WhereEqualTo("Email", email).GetSnapshotAsync();
            var user = userQuery.Documents[0]?.ConvertTo<User>();

            if (user != null && user.Password == password)
            {
                return user.Id;
            }

            throw new Exception("Invalid credentials.");
        }

        public async Task<string> SendVerificationEmail(string email)
        {
            // Generate a verification token (for example, a GUID) and send it to the user's email.
            // You can use an email service library like SendGrid to send emails.

            var verificationToken = Guid.NewGuid().ToString();

            // TODO: Send an email to the user with the verificationToken.
            // Example using SendGrid:
            // SendGridService.SendVerificationEmail(email, verificationToken);

            return verificationToken;
        }

        public void Logout()
        {
            // Implement user logout logic here, e.g., clear session or token.
            // You can handle this based on your authentication mechanism.
        }

        public async Task<bool> ResetPassword(string email, string newPassword, string resetToken)
        {
            // Implement password reset logic here.
            // Verify the resetToken and update the user's password.

            var userQuery = await _userCollection.WhereEqualTo("Email", email).GetSnapshotAsync();
            var user = userQuery.Documents[0]?.ConvertTo<User>();

            if (user != null)
            {
                // Verify the resetToken (this is a simplified example, in practice, you'd use a more secure method).
                if (resetTokenIsValid(resetToken))
                {
                    // Update the user's password.
                    user.Password = newPassword;
                    await _userCollection.Document(user.Id).SetAsync(user);
                    return true;
                }
            }

            return false;
        }

        private bool resetTokenIsValid(string resetToken)
        {
            // Implement logic to check if the resetToken is valid (e.g., compare it to a stored token).

            // In practice, you might store reset tokens with expiration times and verify them accordingly.
            // This is a simplified example.

            // For security, consider using a more robust method to validate reset tokens.
            return true; // Placeholder validation logic.
        }

        public async Task<User> GetUserById(string userId)
        {
            // Retrieve a user by their ID from the database.

            var userDocument = await _userCollection.Document(userId).GetSnapshotAsync();
            if (userDocument.Exists)
            {
                return userDocument.ConvertTo<User>();
            }

            return null;
        }

        public void SendResetPasswordEmail(string email)
        {
            // Generate a reset token (for example, a GUID) and send it to the user's email.
            var resetToken = Guid.NewGuid().ToString();

            // You should store this resetToken in your database for later verification.

            // Configure your SMTP settings (adjust these based on your email service provider).
            var smtpServer = "smtp.example.com";
            var smtpPort = 587;
            var smtpUsername = "your_email@example.com";
            var smtpPassword = "your_email_password";

            var smtpClient = new SmtpClient(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUsername),
                Subject = "Password Reset",
                Body = $"Click the following link to reset your password: " +
                       $"https://walletwise.com/reset-password?token={resetToken}",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);

            try
            {
                smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to send reset password email.", ex);
            }
        }
    }
}
