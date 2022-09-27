using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.Milestone.MilestoneService;

namespace Prosares.Wow.Data.Services.Milestone
{
    public interface IMilestoneService
    {
        MilestoneResponse GetMilestoneData(Entities.MileStone value);
        MileStone GetMilestoneById(MileStone value);

        bool CheckIfMilestoneExists(string MileStone);
        void InsertUpdateMilestoneData(Entities.MileStone value);

        public dynamic ExportToExcel(Entities.MileStone value);

        public dynamic MilestoneExportToExcel(MileStone value);
    }
}
