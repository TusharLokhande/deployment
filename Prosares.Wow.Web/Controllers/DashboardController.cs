using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Dashboard;
using Prosares.Wow.Data.Services.Milestone;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
            #region Fields

            private readonly IDashboardService _dashboardService;
            #endregion

            #region Constructor
            public DashboardController(IDashboardService dashboardService)
            {
            _dashboardService = dashboardService;
            }

            #endregion

            #region Methods
            [HttpPost]
        public JsonResponseModel getDashboardData([FromBody] DashboardRequestModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _dashboardService.GetDashboardData(value);
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
        public JsonResponseModel insertUpdateDashboardData([FromBody] DashboardResponseModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                if(value.Id != 0) { 

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _dashboardService.InsertUpdateDashboardData(value);
                apiResponse.Message = "Ok";
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

        #endregion
    }
}
