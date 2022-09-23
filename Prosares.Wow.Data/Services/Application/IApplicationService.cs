using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.Application.ApplicationService;

namespace Prosares.Wow.Data.Services.Application
{
    public interface IApplicationService
    {
        ApplicationMasterResponse GetApplicationMasterGridData(ApplicationsMaster value);
        dynamic InsertUpdateApplicationMasterData(Entities.ApplicationsMaster value);
        dynamic GeApplicationMasterById(ApplicationsMaster value);
        bool CheckIfApplicationExists(string Application);

        List<ApplicationsMaster> ApplicationExportToExcel(string SearchText, string sortColumn, string sortDirection);
    }
}
