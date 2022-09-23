using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Utility.Entities
{
    public class AdminEmailModel:BaseEntity
    {
        public long Id { get; set; }

        public string LoginId { get; set; }
    }
}
