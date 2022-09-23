using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.CapicityAllocation.CapicityAllocationService;

namespace Prosares.Wow.Data.Services.CapicityAllocation
{
    public interface ICapicityAllocationService
    {
        public dynamic GetCapacityAllocationGridData(CapacityAllocation value);//CapacityAllocationMasterResponse
        public dynamic GetCapacityAllocationById(CapacityAllocation value);
        public dynamic InsertUpdateCapacityAllocation(CapacityAllocation value);
        public dynamic GetTotalResourceAllocation(CapacityAllocation value);

        public dynamic GetTotalAllocatedMandays(CapacityAllocation value);
        public dynamic GetCapacityAllocationDataByEngagement(CapacityAllocation value);
        public dynamic GetAllocatedMandaysPerMonth(CapacityAllocation value);

        public dynamic GetAllocatedResourcePerMonth(CapacityAllocation value);

    }
}
