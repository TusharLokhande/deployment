using System;
using System.Collections.Generic;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class PunchInOut:BaseEntity
    {
        public long Id { get; set; }
        public long EmployeeId { get; set; }
        public DateTime? PunchIn { get; set; }
        public DateTime? PunchOut { get; set; }
        public bool? IsActive { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
