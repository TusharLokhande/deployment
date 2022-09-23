
using System;
using System.Threading.Tasks;
using WowLoginModule.Models;
using WowLoginModule.Models.Login;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Services.Employee;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.Helpers.JWT;
using Prosares.Wow.Data.Helpers.Crypto;
using RestSharp;
using Microsoft.AspNetCore.Http;
using System.Security.Policy;
using Microsoft.Data.SqlClient;

namespace WowLoginModule.Controllers
{
    public class LoginController : Controller
    {
        private readonly IEmployeeService _employeeService;
        private readonly IJwtAuthentication _JwtAuthentication;

        private readonly ILogger<LoginController> _logger;
        public LoginController(IEmployeeService employeeService, ILogger<LoginController> logger, IJwtAuthentication JwtAuthentication)
        {
            _employeeService = employeeService;

            _JwtAuthentication = JwtAuthentication;

            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Microsoft.AspNetCore.Mvc.HttpPost] 
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {

            JsonResponseModel jsonResponse = new JsonResponseModel();
            try
            {
                EmployeeMasterEntity employee = _employeeService.GetEmployeeByLoginId(login.UserName);

                // if (login.Password == _cryptoService.Decrypt(userdata.Password))
                if (login.Password == employee.Password)
                 {
                    
                    var RolesAndPermissions = _employeeService.GetEmployeeRoleAndPermissions(employee.Id);
                    var token = _JwtAuthentication.GenerateJSONWebToken(employee, RolesAndPermissions);
                    var token2 = EncryptionDecryption.EncryptString(token);
                    jsonResponse.Status = ApiStatus.OK;
                    jsonResponse.Data = new { Status = true ,UID = employee.Id, token = token };

                    //adding cookie
                    Response.Cookies.Delete("ApplicationToken");
                    CookieOptions option = new CookieOptions();
                    option.Expires = DateTime.Now.AddDays(10);
                    
                    Response.Cookies.Append("ApplicationToken", token, option);

                    jsonResponse.Message = "Authentication Successful";

                    if (employee.FirstLogin) //redirect to changePassword if first login
                    {
                        jsonResponse.Data = new { Status = true, UID = employee.Id, token, FirstLogin = true };
                    }
                    else
                    {
                        jsonResponse.Data = new { Status = true, UID = employee.Id, token, FirstLogin = false };
                    }

                    return Json(jsonResponse);
                 }

                jsonResponse.Status = ApiStatus.OK;
                jsonResponse.Data = new { Status = false };
                jsonResponse.Message = "Authentication Failed";
            }
            catch (Exception ex)
            {
                jsonResponse.Status = ApiStatus.OK;
                jsonResponse.Data = new { Status = false };
                jsonResponse.Message = "Authentication Failed";
            }
            return Ok(jsonResponse);
        }

        public RedirectResult RedirectToModule(string UserID)
        {
         
            return Redirect("/WOW_API/Dashboard");
        }
    }

    
}
