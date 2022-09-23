using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using Prosares.Wow.Data.Services.Mail;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Prosares.Wow.Data.Services.Employee
{
    public class EmployeeService : IEmployeeService
    {
        #region Prop
        private readonly IRepository<EmployeeMasterEntity> _employeeMaster;
        private readonly IRepository<EmployeeLeaveBalance> _employeeLeaveBalance;


        private readonly IRepository<CostCenter> _costCentre;
        private readonly IRepository<WorkPoliciesMaster> _workPolicyMaster;

        private readonly ILogger<EmployeeService> _logger;
        private readonly SqlDbContext _context;
        private readonly IRepository<RolePermission> _rolePermission;
        private readonly IRepository<Permission> _permission;
        private readonly IRepository<EmployeeRoleMapping> _employeeRoleMapping;
        private readonly IRepository<RolesMaster> _roleMaster;
        private readonly IRepository<EmployeeReportingManagerMapping> _employeeReportingManagerMapping;
        private readonly IMailService _mailService;
        #endregion

        #region Constructor
        public EmployeeService(IRepository<EmployeeMasterEntity> employeeMaster, ILogger<EmployeeService> logger,
        IRepository<CostCenter> costCentre, IRepository<WorkPoliciesMaster> workPolicyMaster, SqlDbContext context,
        IRepository<RolePermission> rolePermission, IRepository<Permission> permission,
        IRepository<EmployeeRoleMapping> employeeRoleMapping, IRepository<EmployeeLeaveBalance> employeeLeaveBalance, IRepository<RolesMaster> roleMaster, IRepository<EmployeeReportingManagerMapping> employeeReportingManagerMapping, IMailService mailService)
        {
            _costCentre = costCentre;
            _workPolicyMaster = workPolicyMaster;
            _employeeMaster = employeeMaster;

            _logger = logger;

            _context = context;
            _rolePermission = rolePermission;
            _permission = permission;
            _employeeRoleMapping = employeeRoleMapping;
            _employeeLeaveBalance = employeeLeaveBalance;
            _roleMaster = roleMaster;
            _employeeReportingManagerMapping = employeeReportingManagerMapping;
            _mailService = mailService;
        }
        #endregion


        #region Methods
        public EmployeeMasterEntity GetEmployeeByLoginId(string LoginId)
        {
            EmployeeMasterEntity employeeData = new EmployeeMasterEntity();
            try
            {


                employeeData = _employeeMaster.Get(k => k.Where(employee => employee.LoginId == LoginId && employee.IsActive == true)).FirstOrDefault();

            }
            catch (Exception ex)
            {
                throw;
            }
            return employeeData;
        }

        public dynamic GetEmployeeRoleAndPermissions(long LoginId)
        {
            //string sqlQuery;

            //List<SqlParameter> sqlParameters = new List<SqlParameter>
            //    {
            //         new SqlParameter("@LoginId", LoginId)
            //    };


            //sqlQuery = "spGetEmployeeRoleAndPermissions @LoginId";

            //var Data = _context.RolesAndPermissionsSet.FromSqlRaw(sqlQuery, sqlParameters.ToArray()).ToList();

            var query = (from rp in _rolePermission.Table
                         join p in _permission.Table on rp.PermissionId equals p.Id
                         select new
                         {
                             RoleId = rp.RoleId,
                             PermissionName = p.Name,
                         }).Distinct().ToList();

            var result = (from q in query
                          join erm in _employeeRoleMapping.Table on q.RoleId equals erm.RoleId
                          select new
                          {
                              Id = erm.Id,
                              PermissionsName = q.PermissionName,
                              RoleId = q.RoleId,
                              EmployeeId = erm.EmployeeId
                          }).Where(k => k.EmployeeId == LoginId).Select(
                                s => new RolesAndPermissions
                                {
                                    Id = s.Id,
                                    PermissionsName = s.PermissionsName,
                                    RoleId = s.RoleId,
                                }).Distinct().ToList();


            return result;

        }


        public EmployeeMasterResponse GetEmployeeMasterGridData(EmployeeMasterEntity value)
        {
            var data = new EmployeeMasterResponse();

            Expression<Func<Entities.EmployeeMasterEntity, bool>> InitialCondition;
            Expression<Func<Entities.EmployeeMasterEntity, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.Name.Contains(value.searchText) || k.ShortName.Contains(value.searchText);

            }
            else
            {
                SearchText = k => k.Name != "";
            }

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _employeeMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.employeeData = _employeeMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _employeeMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.employeeData = _employeeMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _employeeMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.employeeData = _employeeMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            return data;
        }

        public dynamic InsertUpdateEmployeeMasterData(Entities.EmployeeMasterEntity value)
        {
            EmployeeMasterEntity data = new EmployeeMasterEntity();

            data.Id = value.Id;

            if (data.Id == 0) // Insert in DB
            {

                bool checkDuplicate = _employeeMaster.Table.Any(k => (k.Name == value.Name || k.ShortName == value.ShortName || k.Eid == value.Eid || k.LoginId == value.LoginId));

                if (checkDuplicate)
                {
                    return false;
                }

                data.Eid = value.Eid;
                data.Name = value.Name;
                data.ShortName = value.ShortName;
                data.CostCenterId = value.CostCenterId;
                data.WorkPolicyId = value.WorkPolicyId;
                data.TimeSheetPolicy = value.TimeSheetPolicy;
                data.Efficiency = value.Efficiency;
                data.IsActive = value.IsActive;
                data.CreatedBy = value.CreatedBy;
                data.LoginId = value.LoginId;
                data.Location = value.Location;
                data.FirstLogin = true;
                data.Password = CreateRandomPassword(10);
                var newEmployee = _employeeMaster.InsertAndGet(data);
                if (newEmployee != null)
                {

                    //Mail Start
                    SendMailModel MailDetails = new SendMailModel();
                    EmailTemplate template = new EmailTemplate();

                    string TempBody = "<p>Dear Sir/ Madam,</br>Here are your login details for <a href=\"https://wow.azurewebsites.net/\">WoW</a> portal.</p><p> Login Id: " + newEmployee.LoginId + "</p><p> Password: " + newEmployee.Password + "</p><p>Thank You.</p></br><p>(Note: This is a system generated message.)</p>";
                    string TempSub = "Login Details";
                    template.Body = TempBody;
                    template.Subject = TempSub;

                    string TemplateBody = template.Body;
                    string TemplateSubject = template.Subject;
                    StringBuilder sbTemplateBody = new StringBuilder(TemplateBody);
                    StringBuilder sbTemplateSubject = new StringBuilder(TemplateSubject);

                    //MailDetails.Subject = sbTemplateSubject.ToString();
                    MailDetails.To = newEmployee.LoginId;  //mail

                    MailDetails.Body = sbTemplateBody.ToString();
                    MailDetails.Subject = sbTemplateSubject.ToString();
                    var returnValue = _mailService.SendMail(MailDetails);

                    //Mail End 



                    foreach (var item in value.employeeRole) //insert role to new employee
                    {
                        EmployeeRoleMapping employeeRoleMapping = new EmployeeRoleMapping();
                        employeeRoleMapping.EmployeeId = newEmployee.Id;
                        employeeRoleMapping.RoleId = (long)item.Value;
                        employeeRoleMapping.IsActive = value.IsActive;
                        employeeRoleMapping.CreatedBy = value.CreatedBy;
                        _employeeRoleMapping.Insert(employeeRoleMapping);
                    }
                    //insert leave of new employee
                    EmployeeLeaveBalance balance = new EmployeeLeaveBalance();
                    balance.EmployeeId = newEmployee.Id;
                    balance.LeaveBalance = value.LeaveBalance;
                    balance.Year = (long)DateTime.Now.Year;
                    balance.IsActive = value.IsActive;
                    balance.CreatedBy = value.CreatedBy;

                    _employeeLeaveBalance.Insert(balance);

                    //insert employeeReportingManager
                    EmployeeReportingManagerMapping employeeReportingManagerMapping = new EmployeeReportingManagerMapping();
                    employeeReportingManagerMapping.EmployeeId = newEmployee.Id;
                    employeeReportingManagerMapping.ReportingManagerId = value.reportingManagerId;
                    employeeReportingManagerMapping.IsActive = value.IsActive;
                    employeeReportingManagerMapping.CreatedBy = value.CreatedBy;
                    _employeeReportingManagerMapping.Insert(employeeReportingManagerMapping);
                }
                return true;
            }
            else
            {
                bool checkDuplicate = _employeeMaster.Table.Any(k => k.Id != value.Id && (k.Name == value.Name || k.ShortName == value.ShortName || k.Eid == value.Eid || k.LoginId == value.LoginId));

                if (checkDuplicate)
                {
                    return false;
                }

                // find if employee has leaveBalance 
                bool hasLeaveBalance = _employeeLeaveBalance.Table.Any(k => k.EmployeeId == value.Id);
                EmployeeLeaveBalance employeeLeaveBalance = new EmployeeLeaveBalance();
                if (hasLeaveBalance)
                {
                    //update leave balance
                    employeeLeaveBalance = _employeeLeaveBalance.Table.Where(k => k.EmployeeId == value.Id).FirstOrDefault();

                    employeeLeaveBalance.LeaveBalance = value.LeaveBalance;
                    employeeLeaveBalance.Year = (long)DateTime.Now.Year;
                    employeeLeaveBalance.IsActive = value.IsActive;
                    employeeLeaveBalance.ModifiedBy = value.ModifiedBy;
                    employeeLeaveBalance.ModifiedDate = DateTime.UtcNow;
                    _employeeLeaveBalance.Update(employeeLeaveBalance);
                }
                else
                {
                    //insert leave balance
                    employeeLeaveBalance.EmployeeId = value.Id;
                    employeeLeaveBalance.LeaveBalance = value.LeaveBalance;
                    employeeLeaveBalance.Year = (long)DateTime.Now.Year;
                    employeeLeaveBalance.IsActive = value.IsActive;
                    employeeLeaveBalance.CreatedBy = value.ModifiedBy;
                    _employeeLeaveBalance.Insert(employeeLeaveBalance);
                }

                // find if employee has reporting manager 
                bool hasReportingManager = _employeeReportingManagerMapping.Table.Any(k => k.EmployeeId == value.Id);
                EmployeeReportingManagerMapping employeeReportingManager = new EmployeeReportingManagerMapping();
                if (hasReportingManager)
                {
                    //update reporting manager
                    employeeReportingManager = _employeeReportingManagerMapping.Table.Where(k => k.EmployeeId == value.Id).FirstOrDefault();

                    employeeReportingManager.ReportingManagerId = value.reportingManagerId;
                    employeeReportingManager.IsActive = value.IsActive;
                    employeeReportingManager.ModifiedBy = value.ModifiedBy;
                    employeeReportingManager.ModifiedDate = DateTime.UtcNow;
                    _employeeReportingManagerMapping.Update(employeeReportingManager);
                }
                else
                {
                    //insert reporting manager
                    employeeReportingManager.EmployeeId = value.Id;
                    employeeReportingManager.ReportingManagerId = value.reportingManagerId;
                    employeeReportingManager.IsActive = value.IsActive;
                    employeeReportingManager.CreatedBy = (long)value.ModifiedBy;
                    _employeeReportingManagerMapping.Insert(employeeReportingManager);

                }
                // find if employee has role 
                bool hasRole = _employeeRoleMapping.Table.Any(k => k.EmployeeId == value.Id);
                if (hasRole)
                {
                    // delete previous roles
                    _employeeRoleMapping.Table.RemoveRange(_employeeRoleMapping.Table.Where(c => c.EmployeeId == value.Id));
                    _employeeRoleMapping.SaveChanges();

                }
                // then insert roles
                foreach (var item in value.employeeRole)
                {
                    EmployeeRoleMapping employeeRoleMapping = new EmployeeRoleMapping();
                    employeeRoleMapping.EmployeeId = value.Id;
                    employeeRoleMapping.RoleId = (long)item.Value;
                    employeeRoleMapping.IsActive = value.IsActive;
                    employeeRoleMapping.CreatedBy = value.ModifiedBy;
                    _employeeRoleMapping.Insert(employeeRoleMapping);
                }

                // Update in DB
                var employeeData = _employeeMaster.GetById(value.Id);
                employeeData.Eid = value.Eid;
                employeeData.Name = value.Name;
                employeeData.ShortName = value.ShortName;
                employeeData.WorkPolicyId = value.WorkPolicyId;
                employeeData.TimeSheetPolicy = value.TimeSheetPolicy;
                employeeData.Efficiency = value.Efficiency;
                employeeData.IsActive = value.IsActive;
                employeeData.ModifiedBy = value.ModifiedBy;
                employeeData.ModifiedDate = DateTime.UtcNow;
                employeeData.LoginId = value.LoginId;
                employeeData.Location = value.Location;
                //employeeData.Password = value.Password;
                _employeeMaster.Update(employeeData);
                return true;

            }
        }

        public dynamic GeEmployeeMasterById(EmployeeMasterEntity value)//EmployeeMasterEntity
        {
            //var employeeMaster = _employeeMaster.GetById(value.Id);

            var response = (from em in _employeeMaster.Table
                            join cc in _costCentre.Table on em.CostCenterId equals cc.Id
                            join wc in _workPolicyMaster.Table on em.WorkPolicyId equals wc.Id
                            join elb in _employeeLeaveBalance.Table on em.Id equals elb.EmployeeId into elbg
                            from elb in elbg.DefaultIfEmpty()
                            join ermm in _employeeReportingManagerMapping.Table on em.Id equals ermm.EmployeeId into ermmg
                            from ermm in ermmg.DefaultIfEmpty()
                            select new
                            {
                                Eid = em.Eid,
                                Name = em.Name,
                                ShortName = em.ShortName,
                                CostCenterId = em.CostCenterId,
                                CostCenter = cc.CostCenter1,
                                WorkPolicyId = em.WorkPolicyId,
                                WorkPolicy = wc.PolicyName,
                                TimeSheetPolicy = em.TimeSheetPolicy,
                                Efficiency = em.Efficiency,
                                Id = em.Id,
                                LoginId = em.LoginId,
                                Location = em.Location,
                                //Password = em.Password,
                                isActive = em.IsActive,
                                leaveBalance = elb == null ? 0 : elb.LeaveBalance,
                                employeeRoleIds = _employeeRoleMapping.Table.Where(k => k.EmployeeId == em.Id)
                                 .Select(s => s.RoleId).ToArray().DefaultIfEmpty(),
                                reportingManagerId = ermm == null ? 0 : ermm.ReportingManagerId,
                            }).Where(k => k.Id == value.Id).ToList();
            return response;
            // return employeeMaster;
        }

        public double GetEmployeeAvailableLeaveBalance(EmployeeLeaveRequest value)
        {

            EmployeeLeaveBalance data = _employeeLeaveBalance.GetAll(k => k.Where(employee => employee.EmployeeId == value.EmployeeId && employee.IsActive == true && employee.Year == (long)DateTime.Now.Year)).FirstOrDefault();

            return data.LeaveBalance;
        }

        public string CreateRandomPassword(int PasswordLength)
        {
            string _allowedChars = "0123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ";
            Random randNum = new Random();
            char[] chars = new char[PasswordLength];
            int allowedCharCount = _allowedChars.Length;
            for (int i = 0; i < PasswordLength; i++)
            {
                chars[i] = _allowedChars[(int)((_allowedChars.Length) * randNum.NextDouble())];
            }
            return new string(chars);
        }

        public dynamic GetEmployeeReportingManager(EmployeeLeaveRequest value)
        {
            var data = _employeeReportingManagerMapping.Table.Where(k => k.EmployeeId == value.EmployeeId)
                        .Select(s=> s.ReportingManagerId).FirstOrDefault();

            return data;
        }

        /// <summary>
        /// EmployeeExportToExcel -- This method is for Export the data into Excel
        /// </summary>
        /// <param name= "SearchText" name="sortColumn" name="sortDirection"></param>
        /// <returns> This method returns the data of EmployeeMaste table </returns>
        public List<EmployeeMasterEntity> EmployeeExportToExcel(string SearchText, string sortColumn, string sortDirection)
        {
            SqlCommand command = new SqlCommand("stpEmployeeMasterForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@searchText", SqlDbType.VarChar).Value = SearchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection;
            var data = _employeeMaster.GetRecords(command).ToList();
            return data;
        }
        #endregion

        #region ChangePassword & Forgetpassword service 

        public dynamic ChangeEmployeePasswordByEmployeeId(EmployeeMasterEntity emp)
        {

            try
            {
                if (emp.CurrentPassword != null)
                {
                    bool checkPassword = _employeeMaster.Table.Any(k => k.Id == emp.Id && k.Password == emp.CurrentPassword);
                    if (checkPassword)
                    {
                        EmployeeMasterEntity data = _employeeMaster.Get(k => k.Where(x => x.Id == emp.Id && x.IsActive == true)).FirstOrDefault();
                        data.Password = emp.Password;
                        data.FirstLogin = false;
                        _employeeMaster.Update(data);
                        return true;
                    }
                    return false;
                }
                else
                {
                    EmployeeMasterEntity data = _employeeMaster.Get(k => k.Where(x => x.Id == emp.Id && x.IsActive == true)).FirstOrDefault();
                    data.Password = emp.Password;
                    data.FirstLogin = false;
                    _employeeMaster.Update(data);
                    return true;
                }

            }
            catch (Exception)
            {
                return false;
                throw;
            }

        }

        public dynamic CheckCurrentPasswordByEmployeeId(EmployeeMasterEntity emp)
        {
            var data = (from x in _employeeMaster.Table
                        where x.Id == emp.Id && x.Password == emp.CurrentPassword
                        select x
                        );

            if (data.ToList().Count > 0)
            {
                return true;
            }

            return false;
        }


        public EmployeeMasterEntity CheckFirstLogin(long Id)
        {
            EmployeeMasterEntity data = _employeeMaster.Table.Where(k => k.Id == Id).FirstOrDefault();

            return data;
        }

        #endregion

        #region Models

        public class EmployeeMasterResponse
        {
            public int count { get; set; }
            public List<Entities.EmployeeMasterEntity> employeeData { get; set; }
        }

        public class EmployeeLeaveRequest
        {
            public long EmployeeId { get; set; }
        }
        #endregion
    }
}
