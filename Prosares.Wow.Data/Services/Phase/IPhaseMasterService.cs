using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.Phase.PhaseMasterService;

namespace Prosares.Wow.Data.Services.Phase
{
    public interface IPhaseMasterService
    {
        PhaseMasterResponse GetPhaseMasterGridData(PhaseMaster value);
        dynamic InsertUpdatePhaseMasterData(PhaseMaster value);
        dynamic GetPhaseMasterById(PhaseMaster value);

        List<PhaseMaster> PhaseExportToExcel(string SearchText, string sortColumn, string sortDirection);

    }
}
