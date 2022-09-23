using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.LeavesReson;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class LeaveResonController : ControllerBase
    {
        #region Fields

        private readonly ILeavesResonService _leavesResonService;
        #endregion

        #region Constructor
        public LeaveResonController(ILeavesResonService leavesResonService)
        {
            _leavesResonService = leavesResonService;
        }

        #endregion

        #region Method

        [HttpPost]
        public JsonResponseModel getMasterGridData([FromBody] LeavesResonMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _leavesResonService.GetLeaveResonMasterGridData(value);
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
        public JsonResponseModel insertUpdateLeaveResonMasterData([FromBody] LeavesResonMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _leavesResonService.InsertUpdateLeaveResonMasterData(value);
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
        public JsonResponseModel getLeaveResonById([FromBody] LeavesResonMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                LeavesResonMaster leavesReson = _leavesResonService.GetLeaveResonById(value);

                if (leavesReson == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Leave Reson Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = leavesReson;
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
