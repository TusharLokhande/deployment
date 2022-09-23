using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.CapacityUtilizationReport;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CapacityUtilizationReportController : ControllerBase
    {
        private readonly ICapacityUtilizationReport _CapacityUtilizationReport;


        public CapacityUtilizationReportController(ICapacityUtilizationReport CapacityUtilizationReport)
        {
            _CapacityUtilizationReport = CapacityUtilizationReport;
        }

        [HttpPost]
        public JsonResponseModel GetCustomers()
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _CapacityUtilizationReport.Getallcustomers();
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
        public JsonResponseModel GetEngagementType()
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _CapacityUtilizationReport.Getallengagementtype();
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
        public JsonResponseModel GetEngagement()
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _CapacityUtilizationReport.Getallengagement();
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
        public JsonResponseModel GetCapacityAllocation([FromBody] CapacityUtilizationReport value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _CapacityUtilizationReport.GetCapacityAllocation(value);
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
