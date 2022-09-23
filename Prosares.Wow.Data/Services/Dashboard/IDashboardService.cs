using Prosares.Wow.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Dashboard
{
    public interface IDashboardService
    {
        dynamic GetDashboardData(DashboardRequestModel value);
        dynamic InsertUpdateDashboardData(DashboardResponseModel value);
        //public dynamic sendMailAfterTaskTicketClose(DashboardResponseModel value)
    }
}
