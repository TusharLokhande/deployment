using Prosares.Wow.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Task
{
    public interface ITaskService
    {
        dynamic AutoPopulateMandaysFields(AutoPopulateRequestModel value);

        dynamic AutoPopulateAssignedHoursFields(AutoPopulateAssignedHoursRequestModel value);
        void InsertIntoTaskMaster(Entities.TaskMaster value);
    }
}
