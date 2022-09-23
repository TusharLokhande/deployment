using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.LeavesReson.LeavesResonService;

namespace Prosares.Wow.Data.Services.LeavesReson
{
    public interface ILeavesResonService
    {
        LeavesResonResponse GetLeaveResonMasterGridData(LeavesResonMaster value);

        dynamic InsertUpdateLeaveResonMasterData(Entities.LeavesResonMaster value);

        LeavesResonMaster GetLeaveResonById(LeavesResonMaster value);

        //  dynamic DeleteLeaveResonData(Entities.LeavesResonMaster value);

        //void DeleteLeaveReson(long id);



    }
}
