using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Entities
{
    public class EngagementTypeOption: BaseEntity
    {
        public long EngagementTypeId { get; set; }

        public string EngagementType { get; set; }
    }
}
