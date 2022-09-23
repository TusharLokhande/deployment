using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.CostCenterMaster;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class CostCenterController : ControllerBase
    {

        #region Fields

        private readonly ICostCenterService _costCenter;
        #endregion

        #region Constructor
        public CostCenterController(ICostCenterService costCenterService)
        {
            _costCenter = costCenterService;
        }

        #endregion

        #region Method


        [HttpPost]
        public JsonResponseModel getCostCenterGridData([FromBody] CostCenter value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _costCenter.GetCostCentreMasterGridData(value);
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
        public JsonResponseModel CheckIfCostCenterExists([FromBody] CostCenter value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _costCenter.CheckIfCostCenterExists(value.CostCenter1);
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
        public JsonResponseModel insertUpdatCostCenterData([FromBody] CostCenter value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                bool result = _costCenter.InsertUpdateCostCenterMasterData(value);
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
        public JsonResponseModel getCostCenterById([FromBody] CostCenter value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                CostCenter costCenter = _costCenter.GetCostCenterMasterById(value);

                if (costCenter == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Cost Center Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = costCenter;
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
