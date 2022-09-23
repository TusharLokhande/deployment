using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.WorkPolicy.WorkPoliciesService;

namespace Prosares.Wow.Data.Services.WorkPolicy
{
    public interface IWorkPoliciesService
    {
        public Entities.WorkPoliciesMaster GetWorkPoliciesMasterById(Entities.WorkPoliciesMaster value);
        public bool WorkPoliciesMasterExists(long id);
        public WorkPoliciesMasterResponse GetWorkPoliciesMasterGridData(Entities.WorkPoliciesMaster value);
        bool CheckIfWorkPolicyExists(string PolicyName);
        public dynamic InsertUpdateWorkPoliciesMasterData(Entities.WorkPoliciesMaster value);

        dynamic getWorkPolicyHolidayList(WorkPolicyRequestModel value);
        dynamic getWorkPolicyWorkdayList(WorkPolicyRequestModel value);

        List<WorkPoliciesMaster> WorkPolicyExportToExcel(string SearchText, string sortColumn, string sortDirection);

    }
}
