using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.WorkPolicy;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class WorkPoliciesController : ControllerBase
    {
        #region Property
        private readonly IWorkPoliciesService _workPoliciesService;
        #endregion

        #region Constructour
        public WorkPoliciesController(IWorkPoliciesService workPoliciesService)
        {
            _workPoliciesService = workPoliciesService;                                
        }
        #endregion

        #region Method

        [HttpPost]
        public JsonResponseModel getMasterGridData([FromBody] WorkPoliciesMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _workPoliciesService.GetWorkPoliciesMasterGridData(value);
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
        public JsonResponseModel CheckIfWorkPolicyExists([FromBody] WorkPoliciesMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _workPoliciesService.CheckIfWorkPolicyExists(value.PolicyName);
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
        public JsonResponseModel insertUpdateWorkPoliciesMasterData([FromBody] WorkPoliciesMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _workPoliciesService.InsertUpdateWorkPoliciesMasterData(value);
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
        public JsonResponseModel getWorkPoliciesById([FromBody] WorkPoliciesMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                WorkPoliciesMaster workPolicies = _workPoliciesService.GetWorkPoliciesMasterById(value);

                if (workPolicies == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Work Policies Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = workPolicies;
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
        public JsonResponseModel getWorkPolicyHolidayList([FromBody] WorkPoliciesService.WorkPolicyRequestModel value)
        {

            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _workPoliciesService.getWorkPolicyHolidayList(value);
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
        public JsonResponseModel getWorkPolicyWorkdayList([FromBody] WorkPoliciesService.WorkPolicyRequestModel value)
        {

            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _workPoliciesService.getWorkPolicyWorkdayList(value);
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
