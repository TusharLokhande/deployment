using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.CostCenterMaster.CostCenterService;

namespace Prosares.Wow.Data.Services.CostCenterMaster
{
    public interface ICostCenterService
    {
        CostCenterMasterResponse GetCostCentreMasterGridData(CostCenter value);
        dynamic InsertUpdateCostCenterMasterData(Entities.CostCenter value);
        CostCenter GetCostCenterMasterById(CostCenter value);
        bool CheckIfCostCenterExists(string CostCenter1);

        List<CostCenter> CostcenterExportToExcel(string SearchText, string sortColumn, string sortDirection);

    }
}
