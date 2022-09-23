using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Prosares.Wow.Data.Models;

namespace Prosares.Wow.Data.Services.ResourceCapacity
{
    public interface IResourceCapacity
    {

        public dynamic GetResourceCapacity(ResourceCapacityModel value);
    }
}
