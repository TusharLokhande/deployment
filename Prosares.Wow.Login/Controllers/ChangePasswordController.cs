using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using Prosares.Wow.Data.Services.Employee;
using System.Linq;

namespace WowLoginModule.Controllers
{
    public class ChangePasswordController : Controller
    {
        private readonly IEmployeeService _employeeService;
        public ChangePasswordController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("/ChangePassword")]
        public IActionResult ChangePassword(long id)
        {
            EmployeeMasterEntity data = new EmployeeMasterEntity();
            data = _employeeService.CheckFirstLogin(id);
            return View(data);
        }


        [HttpPost]
        public bool ChangePasswordResponse(EmployeeMasterEntity emp)
        {

            bool data = _employeeService.ChangeEmployeePasswordByEmployeeId(emp);
            if (data)
            {
                return true;
            }

            return false;
        }

        [HttpPost]
        public bool CheckCurrentPassword(EmployeeMasterEntity emp)
        {
            bool check = _employeeService.CheckCurrentPasswordByEmployeeId(emp);
            return check;
        }

    }
}
