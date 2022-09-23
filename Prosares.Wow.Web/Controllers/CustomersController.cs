using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Customers;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {

        #region Fields

        private readonly ICustomerService _customerService; 
        #endregion

        #region Constructor
        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        #endregion

        #region My method


        [HttpPost]
        public JsonResponseModel getCustomerData([FromBody] Customer value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _customerService.GetCustomerMasterGridData(value);
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
        public JsonResponseModel insertUpdateCustomerData([FromBody] Customer value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {


                bool result = _customerService.InsertUpdateCustomerMasterData(value);
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
        public JsonResponseModel getCustomerDataById([FromBody] Customer value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                Customer customer = _customerService.GetCustomerById(value);

                if (customer == null)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "No Customer Found";
                }
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = customer;
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

    #endregion
}

