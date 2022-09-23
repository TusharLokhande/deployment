using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.ManagerDashboard;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class ManagerDashboardController : ControllerBase
    {
        #region Fields

        private readonly IManagerDashboardService _managerDashboardService;
        #endregion
        public ManagerDashboardController(IManagerDashboardService managerDashboardService)
        {
            _managerDashboardService = managerDashboardService;
        }

        #region Methods
        [HttpPost]
        public JsonResponseModel GetManagerDashboardData([FromBody] ManagerDashboardModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _managerDashboardService.GetManagerDashboardData(value);
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
