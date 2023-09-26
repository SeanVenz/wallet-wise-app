namespace wallet_wise_api.Repository
{
    public interface IUserRepository
    {
        public Task<string> SignUp(User user);

        public Task <string> Login(string email, string password);

        public Task<string> SendVerificationEmail(string email);

        public void Logout();

        public void sendResetPasswordEmail(string email);
    }
}
