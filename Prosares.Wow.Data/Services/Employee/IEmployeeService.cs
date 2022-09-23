using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Prosares.Wow.Data.Services.Employee.EmployeeService;

namespace Prosares.Wow.Data.Services.Employee
{
    public interface IEmployeeService
    {
        public EmployeeMasterEntity GetEmployeeByLoginId(string LoginId);
        EmployeeMasterResponse GetEmployeeMasterGridData(EmployeeMasterEntity value);
        dynamic InsertUpdateEmployeeMasterData(Entities.EmployeeMasterEntity value);
        dynamic GeEmployeeMasterById(EmployeeMasterEntity value); //EmployeeMasterEntity
        dynamic GetEmployeeRoleAndPermissions(long LoginId);
        double GetEmployeeAvailableLeaveBalance(EmployeeLeaveRequest employee);
        dynamic GetEmployeeReportingManager(EmployeeLeaveRequest value);
        List<EmployeeMasterEntity> EmployeeExportToExcel(string SearchText, string sortColumn, string sortDirection);

        public EmployeeMasterEntity CheckFirstLogin(long Id);
        public dynamic ChangeEmployeePasswordByEmployeeId(EmployeeMasterEntity emp);

        public dynamic CheckCurrentPasswordByEmployeeId(EmployeeMasterEntity emp);


    }
}
