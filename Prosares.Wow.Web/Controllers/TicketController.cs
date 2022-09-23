using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Ticket;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpPost]
        public JsonResponseModel InsertUpdateTicketDetails([FromBody] TicketsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _ticketService.InsertUpdateTicketDetails(value);
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
        public JsonResponseModel AutoPopulateMandaysFields([FromBody] AutoPopulateRequestModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                var data = _ticketService.AutoPopulateMandaysFields(value);
                apiResponse.Data = data;
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = "Error";
            }
            return apiResponse;
        }
    }
}
