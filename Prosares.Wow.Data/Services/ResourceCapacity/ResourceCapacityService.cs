using DocumentFormat.OpenXml.Bibliography;
using Microsoft.Data.SqlClient;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.ResourceCapacity
{
    public class ResourceCapacityService : IResourceCapacity
    {
        private readonly IRepository<ResourceCapacityModel> _resource;

        public ResourceCapacityService(IRepository<ResourceCapacityModel> resource)
        {
            _resource = resource;
        }

        public dynamic GetResourceCapacity(ResourceCapacityModel value)
        {
            ResourceCapacityResponse response = new ResourceCapacityResponse();
            SqlCommand command = new SqlCommand("sp_ResourceCapacity");
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Month", SqlDbType.VarChar).Value = value.Month;
            command.Parameters.Add("@Year", SqlDbType.NVarChar).Value = value.Year;

            var data = _resource.GetRecords(command);
            var count = data.Count();

            if (value.sortColumn == "" || value.sortDirection == "" || value.sortColumn == null)
            {

                data = data.Where( k => ((value.searchText != null) ? k.Name != null && k.Name.ToLower().Contains(value.searchText.ToLower())  : k.Name != "")).ToList();
                count = data.Count();
                data = data.AsQueryable().OrderByPropertyDescending("createdDate").ToList().Skip(value.start).Take(value.pageSize).ToList();
            }

            else if (value.sortDirection == "desc")
            {

                data = data.Where(k => ((value.searchText != null) ? k.Name != null && k.Name.ToLower().Contains(value.searchText.ToLower()) : k.Name != "")).ToList();
                count = data.Count();
                data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).ToList().Skip(value.start).Take(value.pageSize).ToList();

            }

            else if (value.sortDirection == "asc")
            {
                data = data.Where(k => ((value.searchText != null) ? k.Name != null && k.Name.ToLower().Contains(value.searchText.ToLower()) : k.Name != "")).ToList();
                count = data.Count();
                data = data.AsQueryable().OrderByProperty(value.sortColumn).ToList().Skip(value.start).Take(value.pageSize).ToList();

            }

            response.data = data;
            response.count = count;

            return response;
           
        }
    }

    public class ResourceCapacityResponse
    {
        public long count { get; set; }

        public dynamic data { get; set; }

        public dynamic report { get; set; }
    }
}
