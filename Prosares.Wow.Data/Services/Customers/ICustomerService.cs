using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.Customers.CustomerService;

namespace Prosares.Wow.Data.Services.Customers
{
    public interface ICustomerService
    {
        Customer GetCustomerById(Customer value);
        CustomerResponse GetCustomerMasterGridData(Entities.Customer value);
        dynamic InsertUpdateCustomerMasterData(Entities.Customer value);

        List<Customer> CustomerExportToExcel(string SearchText, string sortColumn, string sortDirection);
    }
}
