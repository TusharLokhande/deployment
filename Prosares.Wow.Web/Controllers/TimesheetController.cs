using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.TimeSheetPolicy;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class TimesheetController : ControllerBase
    {

        private readonly ITimeSheetPolicyService _timeSheetPolicy;

        public TimesheetController(ITimeSheetPolicyService timeSheetPolicy)
        {
            _timeSheetPolicy = timeSheetPolicy;
        }



        [HttpPost]
        public JsonResponseModel GetAllTimeSheetPolicyDetails([FromBody] TimesheetPolicy timesheetPolicy)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _timeSheetPolicy.GetTimeSheetPolicy(timesheetPolicy);
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

        public JsonResponseModel InsertUpdateTimeSheetPolicyDetails([FromBody] TimesheetPolicy timesheetPolicy)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                bool result = _timeSheetPolicy.InsertUpdateTimesheet(timesheetPolicy);
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
        public JsonResponseModel GetTimeSheetById([FromBody] TimesheetPolicy timesheetPolicy)
       {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                TimesheetPolicy data = _timeSheetPolicy.GetTimeSheetPolicyById(timesheetPolicy);
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = data;
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

        
    }
}
