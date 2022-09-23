using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Application;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {

        #region Fields

        private readonly IApplicationService _applicationService;
        #endregion

        #region Constructor
        public ApplicationController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        #endregion

        #region Method


        [HttpPost]
        public JsonResponseModel getApplicationMasterGridData([FromBody] ApplicationsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _applicationService.GetApplicationMasterGridData(value);
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
        public JsonResponseModel CheckIfApplicationExists([FromBody] ApplicationsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _applicationService.CheckIfApplicationExists(value.Application);
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
        public JsonResponseModel insertUpdateApplicationMasterData([FromBody] ApplicationsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _applicationService.InsertUpdateApplicationMasterData(value);
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
        public JsonResponseModel getApplicationById([FromBody] ApplicationsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                var applications = _applicationService.GeApplicationMasterById(value);

                if (applications == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Application Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = applications;
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
