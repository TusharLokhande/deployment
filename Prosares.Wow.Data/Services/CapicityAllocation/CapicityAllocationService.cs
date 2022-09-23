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

namespace Prosares.Wow.Data.Services.CapicityAllocation
{
    public class CapicityAllocationService : ICapicityAllocationService
    {
        #region Prop
        private readonly IRepository<CapacityAllocation> _capicityAllocationMaster;
        private readonly IRepository<Entities.EngagementMaster> _engagementMaster;
        private readonly ILogger<CapicityAllocationService> _logger;
        #endregion

        #region Constructor
        public CapicityAllocationService(IRepository<CapacityAllocation> CapicityAllocationMaster,
                        ILogger<CapicityAllocationService> logger,
                        IRepository<Entities.EngagementMaster> EngagementMaster)
        {
            _capicityAllocationMaster = CapicityAllocationMaster;
            _engagementMaster = EngagementMaster;
            _logger = logger;
        }
        #endregion

        #region Methods
        public dynamic GetCapacityAllocationGridData(CapacityAllocation value)//CapacityAllocationMasterResponse
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetCapicityAllocationGridData");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EngagementId", SqlDbType.BigInt).Value = value.EngagementId;
                command.Parameters.Add("@FromDate", SqlDbType.Date).Value = value.FromDate;
                command.Parameters.Add("@ToDate", SqlDbType.Date).Value = value.ToDate;
                var capicityAllocationMasterData = _capicityAllocationMaster.GetRecords(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic GetCapacityAllocationById(CapacityAllocation value)
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetCapicityAllocationById");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@Id", SqlDbType.BigInt).Value = value.Id;
                var capicityAllocationMasterData = _capicityAllocationMaster.GetRecord(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic GetTotalResourceAllocation(CapacityAllocation value)
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetTotalResourceAllocationForCapacityAllocationScreen");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EmployeeId", SqlDbType.BigInt).Value = value.EmployeeId;
                command.Parameters.Add("@FromDate", SqlDbType.Date).Value = value.FromDate;
                command.Parameters.Add("@ToDate", SqlDbType.Date).Value = value.ToDate;
                var capicityAllocationMasterData = _capicityAllocationMaster.GetRecord(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic GetTotalAllocatedMandays(CapacityAllocation value)
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetTotalAllocatedMandaysForCapacityAllocationScreen");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EmployeeId", SqlDbType.BigInt).Value = value.EmployeeId;
                command.Parameters.Add("@FromDate", SqlDbType.Date).Value = value.FromDate;
                command.Parameters.Add("@ToDate", SqlDbType.Date).Value = value.ToDate;
                var capicityAllocationMasterData = _capicityAllocationMaster.GetRecord(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic GetCapacityAllocationDataByEngagement(CapacityAllocation value)
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetCapacityAllocationDataByEngagement");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EngagementId", SqlDbType.BigInt).Value = value.EngagementId;
                command.Parameters.Add("@Type", SqlDbType.VarChar).Value = value.EngagementType;
                var capicityAllocationMasterData = _engagementMaster.GetRecord(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic GetAllocatedMandaysPerMonth(CapacityAllocation value)
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetAllocatedMandaysPerMonthForCapacityAllocationScreen");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EngagementId", SqlDbType.BigInt).Value = value.EngagementId;
                command.Parameters.Add("@FromDate", SqlDbType.Date).Value = value.FromDate;
                command.Parameters.Add("@ToDate", SqlDbType.Date).Value = value.ToDate;
                var capicityAllocationMasterData = _capicityAllocationMaster.GetRecord(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic GetAllocatedResourcePerMonth(CapacityAllocation value)
        {
            try
            {
                SqlCommand command = new SqlCommand("spGetAllocatedResourcePerMonthForCapacityAllocationScreen");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EngagementId", SqlDbType.BigInt).Value = value.EngagementId;
                command.Parameters.Add("@FromDate", SqlDbType.Date).Value = value.FromDate;
                command.Parameters.Add("@ToDate", SqlDbType.Date).Value = value.ToDate;
                var capicityAllocationMasterData = _capicityAllocationMaster.GetRecord(command);
                return capicityAllocationMasterData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public dynamic InsertUpdateCapacityAllocation(CapacityAllocation value)
        {
            try
            {
                CapacityAllocation data = new CapacityAllocation();
                data.Id = value.Id;
                if (value.Id == 0) // Insert in DB
                {
                    value.CreatedDate = DateTime.UtcNow;
                    CapacityAllocation response = _capicityAllocationMaster.InsertAndGet(value);
                    return response.Id;
                }
                else if (value.Id != 0)
                {
                    CapacityAllocation capicityAllocationMasterGetById = _capicityAllocationMaster.GetById(value.Id);
                    DateTime abx = capicityAllocationMasterGetById.CreatedDate;
                    capicityAllocationMasterGetById = value;
                    capicityAllocationMasterGetById.CreatedDate = abx;
                    capicityAllocationMasterGetById.ModifiedDate = DateTime.UtcNow;
                    _capicityAllocationMaster.UpdateAsNoTracking(value);
                    return value.Id;
                }
                return 0;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #endregion
        public class CapacityAllocationMasterResponse
        {
            public int count { get; set; }
            public List<CapacityAllocation> capacityAllocationMasterData { get; set; }
        }

    }
}
