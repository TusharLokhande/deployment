using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.CapicityAllocation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class CapicityAllocationController : ControllerBase
    {
        private readonly ICapicityAllocationService _capicityAllocationService;
        public CapicityAllocationController(ICapicityAllocationService capicityAllocationService)
        {
            _capicityAllocationService = capicityAllocationService;
        }

        [HttpPost]
        public JsonResponseModel GetCapacityAllocationGridData([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetCapacityAllocationGridData(value);
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
        public JsonResponseModel GetCapacityAllocationById([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetCapacityAllocationById(value);
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
        public JsonResponseModel InsertUpdateCapacityAllocation([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.InsertUpdateCapacityAllocation(value);
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
        public JsonResponseModel GetTotalResourceAllocation([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetTotalResourceAllocation(value);
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
        public JsonResponseModel GetTotalAllocatedMandays([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetTotalAllocatedMandays(value);
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
        public JsonResponseModel GetCapacityAllocationDataByEngagement([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetCapacityAllocationDataByEngagement(value);
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
        public JsonResponseModel GetAllocatedMandaysPerMonth([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetAllocatedMandaysPerMonth(value);
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
        public JsonResponseModel GetAllocatedResourcePerMonth([FromBody] CapacityAllocation value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _capicityAllocationService.GetAllocatedResourcePerMonth(value);
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
