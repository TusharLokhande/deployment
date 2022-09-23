using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.PunchInOut
{
    public  interface IPunchInOutService
    {
          void InsertIntoPunchInOut(Entities.PunchInOut value);
    }
}
