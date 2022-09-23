using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Task;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        #region properties
        private readonly ITaskService _taskService;
        #endregion

        #region constructor
        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        #endregion

        #region methods
        [HttpPost]
      
        public JsonResponseModel InsertAndUpdateTask([FromBody] Data.Entities.TaskMaster value)
        {
            JsonResponseModel apiResponse= new JsonResponseModel(); 
            try
            {
                _taskService.InsertIntoTaskMaster(value);
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {     
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = "Error";
            }
            return apiResponse;
        }

        [HttpPost]
        public JsonResponseModel AutoPopulateMandaysFields([FromBody] AutoPopulateRequestModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                var data=_taskService.AutoPopulateMandaysFields(value);
                apiResponse.Data = data;
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = "Error";
            }
            return apiResponse;
        }

        [HttpPost]
        public JsonResponseModel AutoPopulateAssignedHoursFields([FromBody] AutoPopulateAssignedHoursRequestModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                var data = _taskService.AutoPopulateAssignedHoursFields(value);
                apiResponse.Data = data;
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = "Error";
            }
            return apiResponse;
        }

        #endregion


    }
}
