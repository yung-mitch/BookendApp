using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SymmetricSecurityKey _key; // symmetric key because this always stays on the server for encryption and decryption; don't need asymmetric public/private keys

        public TokenService(IConfiguration config, UserManager<AppUser> userManager) // secret key stored in configuration
        {
            _userManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public async Task<string> CreateToken(AppUser user)
        {
            // Create list of claims to include in JSON Web Token
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Create signingcredentials for creating the token
            // Uses key from app configuration
            // Using HmacSha256 algorithm
            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

            // Create the token using the key, algorithm and claims configured above
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Return the token new token as a string for use with subsequent server requests
            return tokenHandler.WriteToken(token);
        }
    }
}
