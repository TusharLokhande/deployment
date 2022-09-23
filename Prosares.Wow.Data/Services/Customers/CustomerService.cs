using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Customers
{
    public class CustomerService : ICustomerService
    {
        #region Prop
        private readonly IRepository<Customer> _customers;
        private readonly ILogger<CustomerService> _logger;
        #endregion

        #region Constructor
        public CustomerService(IRepository<Customer> Customers,
                        ILogger<CustomerService> logger)
        {
            _customers = Customers;
            _logger = logger;
        }
        #endregion

        #region Methods

        public Customer GetCustomerById(Customer value)
        {
            var customer = _customers.GetById(value.Id);

            return customer;
        }

        public CustomerResponse GetCustomerMasterGridData(Customer value)
        {
            var data = new CustomerResponse();

            Expression<Func<Entities.Customer, bool>> InitialCondition;
            Expression<Func<Entities.Customer, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.Name.Contains(value.searchText) || k.Abbreviation.Contains(value.searchText);

            }
            else
            {
                SearchText = k => k.Name != "";
            }

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _customers.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.customerData = _customers.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _customers.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.customerData = _customers.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _customers.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.customerData = _customers.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            return data;
        }


        public dynamic InsertUpdateCustomerMasterData(Entities.Customer value)
        {

            try
            {
                if (value.Id == 0) // Insert in DB
                {
                    bool checkDuplicate = _customers.Table.Any(k => (k.Name == value.Name || k.Abbreviation == value.Abbreviation));

                    if (checkDuplicate)
                    {
                        return false;
                    }

                    _customers.Insert(value);
                    return true;
                }
                else // Update in DB
                {
                    bool checkDuplicate = _customers.Table.Any(k => k.Id != value.Id && (k.Name == value.Name || k.Abbreviation == value.Abbreviation));

                    if (checkDuplicate)
                    {
                        return false;
                    }
                    _customers.Update(value);
                    return true;
                }
            }
            catch (Exception ex)
            {

                throw;
            }


        }

        /// <summary>
        /// CustomerExportToExcel -- This method is for Export the data into Excel
        /// </summary>
        /// <param name= "SearchText" name="sortColumn" name="sortDirection"></param>
        /// <returns> This method returns the data of Customer table </returns>
        public List<Customer> CustomerExportToExcel(string SearchText, string sortColumn, string sortDirection)
        {
            SqlCommand command = new SqlCommand("stpCustomerForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@SearchText", SqlDbType.VarChar).Value = SearchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection;
            var data = _customers.GetRecords(command).ToList();

            return data;
        }

        #endregion

        #region Models

        public class CustomerResponse
        {
            public int count { get; set; }
            public List<Entities.Customer> customerData { get; set; }
        }
        #endregion
    }
}
