using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.PunchInOut;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class PunchInOutController : ControllerBase
    {
        #region Fields
        private readonly IPunchInOutService _punchInOutService;

        #endregion

        public PunchInOutController(IPunchInOutService punchInOutService)
        {
            _punchInOutService = punchInOutService;
        }

        [HttpPost]
        public JsonResponseModel InsertIntoPunchInOut(Data.Entities.PunchInOut value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                 _punchInOutService.InsertIntoPunchInOut(value);
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
