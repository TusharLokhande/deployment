using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Calendar;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        #region Fields

        private readonly ICalendarService _calendarService;

        #endregion

        #region Constructor

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }
        #endregion

        #region Methods

        [HttpPost]
        public JsonResponseModel getCalendarData([FromBody] CalendarService.calendarRequestMode value)
        {

            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _calendarService.getCalendarData(value);
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
