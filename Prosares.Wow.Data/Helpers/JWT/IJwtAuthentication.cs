using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Helpers.JWT
{
    public interface IJwtAuthentication
    {
        string GenerateJSONWebToken(dynamic employee, dynamic RolesAndPermissions);
    }
}
