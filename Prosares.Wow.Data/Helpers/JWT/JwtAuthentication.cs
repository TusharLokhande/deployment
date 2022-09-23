using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Helpers.JWT
{
    public class JwtAuthentication : IJwtAuthentication
    {
        private IConfiguration _config;
        public JwtAuthentication(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJSONWebToken(dynamic employee, dynamic RolesAndPermissions)
        {
            List<string> PermissionsArray = new List<string>();

            var set = new HashSet<long>();
            foreach (var s in RolesAndPermissions)
            {
                set.Add(s.RoleId);
            }

            var result = string.Join(",", set);


            foreach (var permission in RolesAndPermissions)
            {
                PermissionsArray.Add(permission.PermissionsName);
            }

            var PermissionsString = string.Join(", ", PermissionsArray);

            var claims = new[] {

                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("EmployeeId",Convert.ToString(employee.Id)),
                        new Claim("UserName",employee.Name),
                        new Claim("UserNameShort",employee.ShortName),
                        new Claim("EmployeeWorkPolicyId",Convert.ToString(employee.WorkPolicyId)),
                        new Claim("RoleId",result),
                        new Claim("Permissions",PermissionsString),
                        new Claim("IsFirstLogin",Convert.ToString(employee.FirstLogin))
                    };
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            _config["Jwt:Issuer"],
            claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
