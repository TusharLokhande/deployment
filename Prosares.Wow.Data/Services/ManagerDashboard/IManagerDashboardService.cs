using Prosares.Wow.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.ManagerDashboard
{
    public interface IManagerDashboardService
    {
        dynamic GetManagerDashboardData(ManagerDashboardModel value);
    }
}
