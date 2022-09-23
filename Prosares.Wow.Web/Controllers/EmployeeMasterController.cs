using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Employee;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class EmployeeMasterController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        public EmployeeMasterController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        #region Method
        [HttpGet]
        public IActionResult Get()
        {
            EmployeeMasterEntity Employee = _employeeService.GetEmployeeByLoginId("");
            return Ok(Employee);
        }



        [HttpPost]
        public JsonResponseModel getEmployeeMasterGridData([FromBody] EmployeeMasterEntity value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _employeeService.GetEmployeeMasterGridData(value);
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = ex.Message;

            }

            return apiResponse;
        }

        [HttpPost]
        public JsonResponseModel insertUpdatEmployeeMasterData([FromBody] EmployeeMasterEntity value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                bool result = _employeeService.InsertUpdateEmployeeMasterData(value);
                if (result)

                {
                    apiResponse.Status = ApiStatus.OK;
                    apiResponse.Data = "Inserted";
                    apiResponse.Message = "Ok";
                }
                else
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "Record already Exists!";
                }
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = ex.Message;

            }

            return apiResponse;
        }

        [HttpPost]
        public JsonResponseModel getEmployeeById([FromBody] EmployeeMasterEntity value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                var employee = _employeeService.GeEmployeeMasterById(value);//EmployeeMasterEntity 
                if (employee == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Employee Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = employee;
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = ex.Message;

            }

            return apiResponse;
        }

        [HttpPost]
        public JsonResponseModel GetEmployeeAvailableLeaveBalance([FromBody] EmployeeService.EmployeeLeaveRequest employee)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _employeeService.GetEmployeeAvailableLeaveBalance(employee);
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = ex.Message;

            }
            return apiResponse;
        }

        [HttpPost]
        public JsonResponseModel GetEmployeeReportingManager([FromBody] EmployeeService.EmployeeLeaveRequest employee)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _employeeService.GetEmployeeReportingManager(employee);
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = ex.Message;

            }
            return apiResponse;
        }

        #endregion

    }
}

