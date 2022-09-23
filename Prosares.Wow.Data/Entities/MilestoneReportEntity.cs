using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Entities
{
    public class ResponseModelEntity
    {

        public string Name { get; set; }

        public long Id { get; set; }
    }

    public class MilestoneReportEntity : BaseEntity
    {
        public string MileStone { get; set; }
        //  public string Name { get; set; }
        public string Engagement { get; set; }
        public long EngagementId { get; set; }
        public decimal Amount { get; set; }
        [Column(TypeName = "date")]
        public DateTime? PlannedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime ?RevisedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CompletedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? InvoicedDate { get; set; }
        public long MandaysBalance { get; set; }
        public string Customer { get; set; }

        public decimal POValue { get; set; }
        public string EngagementType { get; set; }
        public string SortColumn { get; set; }
        public string SortOrder { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string SearchText { get; set; }

        public long TotalCount { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public List<ResponseModelEntity> CustomerList { get; set; }

        public List<ResponseModelEntity> EngagementTypeList { get; set; }
    }
}