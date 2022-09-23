using System;
using System.Collections.Generic;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class TimesheetPolicy : BaseEntity
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool? IsTimeSheetApplicable { get; set; }
        public bool? IsActive { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }
    }
}
