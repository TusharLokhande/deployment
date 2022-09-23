using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Common.DropdownService;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonDropdownController : ControllerBase
    {
        private readonly IDropdownService _dropdownService;
        public CommonDropdownController(IDropdownService dropdownService)
        {
            _dropdownService = dropdownService;
        }

        [HttpPost]
        public JsonResponseModel GetDropdownList([FromBody] CommonDropdownModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _dropdownService.GetDropdownList(value);
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
