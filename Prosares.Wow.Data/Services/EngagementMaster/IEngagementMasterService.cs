using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.EngagementMaster.EngagementMasterService;

namespace Prosares.Wow.Data.Services.EngagementMaster
{
    public interface IEngagementMasterService
    {
        public dynamic GetEngagementMasterById(Entities.EngagementMaster value);
        public bool EngagementMasterExists(long id);
        public EngagementMasterResponse GetEngagementMasterGridData(Entities.EngagementMaster value);
        public long InsertUpdateEngagementMasterData(Entities.EngagementMaster value);

        List<Entities.EngagementMaster> EngagementExportToExcel(string SearchText, string sortColumn, string sortDirection);

    }
}
