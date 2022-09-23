using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class ResourceCapacityModel : BaseEntity
    {
        public string Month { get; set; }
        public int Year { get; set; }

        public string Name { get; set; }
        public int PlannedTM { get; set; }
        public int PlannedAMC { get; set; }

        public int PlannedProject { get; set; }
        public int PlannedProduct { get; set; }
        public int PlannedInternal { get; set; }
        public int Leaves { get; set; }

        public int Spare { get; set; }

        public int PlannedTotal { get; set; }


        public float ActualTM { get; set; }

        public float ActualAMC { get; set; }
        public float ActualProject { get; set; }

        public float ActualProduct { get; set; }
        public float ActualInternal { get; set; }
        public float NonChargeable { get; set; }

        public float ActualSpare { get; set; }
        public float ActualTotal { get; set; }

        public long count { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

    }
}
