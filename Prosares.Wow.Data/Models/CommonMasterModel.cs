namespace Prosares.Wow.Web.Controllers
{
    namespace Prosares.Wow.Data.Models
    {
        public class CommonMasterModel
        {
            public string master { get; set; }
            public string? sortColumn { get; set; }
            public string? sortDirection { get; set; }
            public string? searchText { get; set; }
        }
    }
}