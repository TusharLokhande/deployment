using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Phase;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class PhaseMasterController : ControllerBase
    {
        #region Fields

        private readonly IPhaseMasterService _phaseMasterService;
        #endregion

        #region Constructor
        public PhaseMasterController(IPhaseMasterService PhaseMasterService)
        {
            _phaseMasterService = PhaseMasterService;
        }

        #endregion

        #region Method


        [HttpPost]
        public JsonResponseModel getPhaseMasterGridData([FromBody] PhaseMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _phaseMasterService.GetPhaseMasterGridData(value);
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
        public JsonResponseModel insertUpdatPhaseMasterData([FromBody] PhaseMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                bool result = _phaseMasterService.InsertUpdatePhaseMasterData(value);
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
        public JsonResponseModel getPhaseMasterById([FromBody] PhaseMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                var phase = _phaseMasterService.GetPhaseMasterById(value);

                if (phase == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Phase Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = phase;
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
