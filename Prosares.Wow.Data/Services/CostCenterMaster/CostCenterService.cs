using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.CostCenterMaster
{
    public class CostCenterService : ICostCenterService
    {
        #region Prop
        private readonly IRepository<CostCenter> _costcenter;
        private readonly ILogger<CostCenterService> _logger;
        #endregion

        #region Constructor
        public CostCenterService(IRepository<CostCenter> costcenter, ILogger<CostCenterService> logger)
        {
            _costcenter = costcenter;

            _logger = logger;
        }
        #endregion

        #region Methods

        public CostCenterMasterResponse GetCostCentreMasterGridData(CostCenter value)
        {
            var data = new CostCenterMasterResponse();

            Expression<Func<Entities.CostCenter, bool>> InitialCondition;
            Expression<Func<Entities.CostCenter, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.CostCenter1.Contains(value.searchText);

            }
            else
            {
                SearchText = k => k.CostCenter1 != "";
            }

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _costcenter.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.costCenterData = _costcenter.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _costcenter.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.costCenterData = _costcenter.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _costcenter.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.costCenterData = _costcenter.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            return data;
        }

        public bool CheckIfCostCenterExists(string CostCenter1)
        {
            var data = _costcenter.GetAll(b => b.Where(k => k.IsActive == true && k.CostCenter1 == CostCenter1)).ToList();
            if(data.Count > 0)
            {
                return true;
            }
            return false;
        }
        public dynamic InsertUpdateCostCenterMasterData(Entities.CostCenter value)
        {
            CostCenter data = new CostCenter();

            data.Id = value.Id;

            if (data.Id == 0) // Insert in DB
            {
                bool checkDuplicate = _costcenter.Table.Any(k => k.CostCenter1 == value.CostCenter1);

                if (checkDuplicate)
                {
                    return false;
                }

                data.CostCenter1 = value.CostCenter1;
                data.IsActive = value.IsActive;
                _costcenter.Insert(data);
                return true;
            }
            else
            {

                bool checkDuplicate = _costcenter.Table.Any(k => k.Id != value.Id && k.CostCenter1 == value.CostCenter1);

                if (checkDuplicate)
                {
                    return false;
                }
                // Update in DB
                var costCenterData = _costcenter.GetById(value.Id);
                costCenterData.CostCenter1 = value.CostCenter1;
                costCenterData.IsActive = value.IsActive;
                _costcenter.Update(costCenterData);
                return true;
            }
        }

        public CostCenter GetCostCenterMasterById(CostCenter value)
        {
            var costCenterMaster = _costcenter.GetById(value.Id);

            return costCenterMaster;
        }

        /// <summary>
        /// CostcenterExportToExcel -- This method is for Export the data into Excel
        /// </summary>
        /// <param name= "SearchText" name="sortColumn" name="sortDirection"></param>
        /// <returns> This method returns the data of CostMaster table </returns>
        public List<CostCenter> CostcenterExportToExcel(string SearchText, string sortColumn, string sortDirection)
        {
            SqlCommand command = new SqlCommand("stpCostcenterMasterForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@searchText", SqlDbType.VarChar).Value = SearchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection;
            var data = _costcenter.GetRecords(command).ToList();

            return data;
        }
        #endregion

        #region Models

        public class CostCenterMasterResponse
        {
            public int count { get; set; }
            public List<Entities.CostCenter> costCenterData { get; set; }
        }
        #endregion
    }
}
