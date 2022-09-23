using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.LeaveRequest.LeaveRequestMasterService;

namespace Prosares.Wow.Data.Services.LeaveRequest
{
    public interface ILeaveRequestMasterService
    {
        public dynamic GetLeaveReqMasterMasterGridData(Entities.LeaveRequestsMaster value);
        // public LeaveRequestsMasterResponse GetLeaveReqMasterMasterGridData(Entities.LeaveRequestsMaster value);
        public dynamic GetLeaveRequestMasterById(Entities.LeaveRequestsMaster value);
        public bool LeaveRequestMasterExists(long id);
        public dynamic InsertUpdateLeaveRequestMasterData(Entities.LeaveRequestsMaster value);
        public dynamic GetPendingLeavesById(Entities.LeaveRequestsMaster value);

    }
}
