using System;
using System.Threading.Tasks;
using AutoMapper;
using wallet_wise_api.Repository;

namespace wallet_wise_api.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<string> SignUp(UserDto userDto)
        {
            if (userDto == null)
            {
                throw new ArgumentNullException(nameof(userDto));
            }

            var userModel = _mapper.Map<User>(userDto);
            return await _repository.SignUp(userModel);
        }

        public async Task<string> Login(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException("Email and password are required.");
            }

            return await _repository.Login(email, password);
        }

        public async Task<string> SendVerificationEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException(nameof(email));
            }

            return await _repository.SendVerificationEmail(email);
        }

        public async void Logout()
        {
            _repository.Logout();
        }

        public void SendResetPasswordEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException(nameof(email));
            }

            _repository.SendResetPasswordEmail(email);
        }
    }
}
