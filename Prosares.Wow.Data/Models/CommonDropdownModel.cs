using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class CommonDropdownModel
    {
        public string SearchFor { get; set; }
        public int SearchValue { get; set; }

        public DateTime? fromDate { get; set; }
        public DateTime? toDate { get; set; }
    }
}
