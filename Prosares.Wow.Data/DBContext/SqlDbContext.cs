using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;

#nullable disable

namespace Prosares.Wow.Data.DBContext
{
    public partial class SqlDbContext : DbContext
    {
        //public SqlDbContext()
        //{
        //}

        public SqlDbContext(DbContextOptions<SqlDbContext> options)
            : base(options)
        {
        }

        #region Tables
        public virtual DbSet<ApplicationsMaster> ApplicationsMasters { get; set; }
        public virtual DbSet<AttendenceMaster> AttendenceMasters { get; set; }
        public virtual DbSet<CapacityAllocation> CapacityAllocations { get; set; }
        public virtual DbSet<CostCenter> CostCenters { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<EmployeeMasterEntity> EmployeeMasters { get; set; }
        public virtual DbSet<EngagementLeadsMaster> EngagementLeadsMasters { get; set; }
        public virtual DbSet<EngagementMaster> EngagementMasters { get; set; }
        public virtual DbSet<LeaveRequestsMaster> LeaveRequestsMasters { get; set; }
        public virtual DbSet<LeavesResonMaster> LeavesResonMasters { get; set; }
        public virtual DbSet<MileStone> MileStones { get; set; }
        public virtual DbSet<NotificationMaster> NotificationMasters { get; set; }
        public virtual DbSet<PhaseMaster> PhaseMasters { get; set; }
        public virtual DbSet<PolicyWiseHoliday> PolicyWiseHolidays { get; set; }
        public virtual DbSet<PolicyWiseWorkingDay> PolicyWiseWorkingDays { get; set; }
        public virtual DbSet<TaskMaster> TaskMasters { get; set; }
        public virtual DbSet<TaskTicketStatus> TaskTicketStatuses { get; set; }
        public virtual DbSet<TasksTimeSheet> TasksTimeSheets { get; set; }
        public virtual DbSet<TicketTimeSheet> TicketTimeSheets { get; set; }
        public virtual DbSet<TicketsMaster> TicketsMasters { get; set; }
        public virtual DbSet<WorkPoliciesMaster> WorkPoliciesMasters { get; set; }
        public virtual DbSet<EngagementEmployeeMapping> EngagementEmployeeMappings { get; set; }
        public virtual DbSet<RolesMaster> RolesMasters { get; set; }

        public virtual DbSet<EmployeeRoleMapping> EmployeeRoleMappings { get; set; }

        public virtual DbSet<DashboardResponseModel> DashboardDbSet { get; set; }

        public virtual DbSet<ManagerDashboardResponseModel> ManagerDashboardDbSet { get; set; }
        public virtual DbSet<EngagementByIdResponseModel> EngagementDbSet { get; set; }

        public virtual DbSet<AutoPopulateResponseModel> AutoPopulateResponseSet { get; set; }

        public virtual DbSet<AutoPopulateAssignedHoursResponseModel> AutoPopulateAssignedHoursResponseSet { get; set; }

        public virtual DbSet<RolesAndPermissions> RolesAndPermissionsSet { get; set; }


        public virtual DbSet<RolePermission> RolePermissions { get; set; }
        public virtual DbSet<Permission> Permissions { get; set; }


        public virtual DbSet<NoChargesReason> NoChargesReasons { get; set; }

        public virtual DbSet<EmployeeCalendar> EmployeeCalendars { get; set; }

        public virtual DbSet<EmployeeLeaveBalance> EmployeeLeaveBalances { get; set; }
        //for sp
        public virtual DbSet<Models.GetEngagementDropdown> GetEngagementDropdownSet { get; set; }

        public virtual DbSet<LeaveType> LeaveTypes { get; set; }

        public virtual DbSet<LeaveRequestStatus> LeaveRequestStatuses { get; set; }

        public virtual DbSet<EmployeeReportingManagerMapping> EmployeeReportingManagerMappings { get; set; }
        public virtual DbSet<PunchInOut> PunchInOuts { get; set; }

        public virtual DbSet<TimesheetPolicy> TimesheetPolicies { get; set; }

        public virtual DbSet<ConfigTable> ConfigTables { get; set; }

        public virtual DbSet<EngagementTypeOption> EngagementTypeOptions { get; set; }
        #endregion

        #region StoredProcedures
        #endregion

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        //        optionsBuilder.UseSqlServer("Data Source=sql.prosares.net; Initial Catalog=Prosares_wow_Preetishc; Integrated Security=False; User ID=Wow_user;Password=W0w!Admin;MultipleActiveResultSets=True; Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;");
        //    }
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<ApplicationsMaster>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.EngagementName);

                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.ApplicationsMasters)
                    .HasForeignKey(d => d.EngagementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Applicati__Engag__14270015");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
            });

            modelBuilder.Entity<AttendenceMaster>(entity =>
            {
                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.AttendenceMasters)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Attendenc__Emplo__03F0984C");
            });

            modelBuilder.Entity<CapacityAllocation>(entity =>
            {
                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.CapacityAllocations)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CapacityA__Emplo__01142BA1");

                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.CapacityAllocations)
                    .HasForeignKey(d => d.EngagementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CapacityA__Engag__00200768");

                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.EmployeeName);
                entity.Ignore(e => e.EngagementType);
                entity.Ignore(e => e.allocatedMandaysPerMonth);
                entity.Ignore(e => e.allocatedResourcePerMonth);
                entity.Ignore(e => e.totalAllocatedMandays);
                entity.Ignore(e => e.totalResourceAllocation);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);

            });

            modelBuilder.Entity<CostCenter>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);

            });

            modelBuilder.Entity<LeavesResonMaster>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);

            });

            modelBuilder.Entity<WorkPoliciesMaster>(entity =>
            {
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.HolidayDates);
                entity.Ignore(e => e.WorkingDates);
                entity.ToTable("WorkPoliciesMaster");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Holiday1).HasColumnType("date");

                entity.Property(e => e.Holiday10).HasColumnType("date");

                entity.Property(e => e.Holiday11).HasColumnType("date");

                entity.Property(e => e.Holiday2).HasColumnType("date");

                entity.Property(e => e.Holiday3).HasColumnType("date");

                entity.Property(e => e.Holiday4).HasColumnType("date");

                entity.Property(e => e.Holiday5).HasColumnType("date");

                entity.Property(e => e.Holiday6).HasColumnType("date");

                entity.Property(e => e.Holiday7).HasColumnType("date");

                entity.Property(e => e.Holiday8).HasColumnType("date");

                entity.Property(e => e.Holiday9).HasColumnType("date");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.PolicyName)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.ValidFrom).HasColumnType("date");

                entity.Property(e => e.ValidTill).HasColumnType("date");

                entity.Property(e => e.WorkingDay1)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("WorkingDay_1");

                entity.Property(e => e.WorkingDay2)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("WorkingDay_2");

                entity.Property(e => e.WorkingDay3)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("WorkingDay_3");

                entity.Property(e => e.WorkingDay4)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("WorkingDay_4");

                entity.Property(e => e.WorkingDay5)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("WorkingDay_5");

                entity.Property(e => e.WorkingDay6)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("WorkingDay_6");

            });

            modelBuilder.Entity<EmployeeMasterEntity>(entity =>
            {

                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.employeeRole);
                entity.Ignore(e => e.LeaveBalance);
                entity.Ignore(e => e.reportingManagerId);
                entity.Ignore(e => e.Email);
                entity.Ignore(e => e.Url);
                entity.Ignore(e => e.CostCenter_Name);
                entity.Ignore(e => e.PolicyName_Name);
                entity.Ignore(e => e.TimeSheetPolicy_Name);
                entity.Ignore(e => e.CurrentPassword);



                entity.ToTable("EmployeeMaster");

                entity.HasOne(d => d.CostCenter)
                    .WithMany(p => p.EmployeeMasters)
                    .HasForeignKey(d => d.CostCenterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__EmployeeM__CostC__71D1E811");

                entity.HasOne(d => d.WorkPolicy)
                    .WithMany(p => p.EmployeeMasters)
                    .HasForeignKey(d => d.WorkPolicyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__EmployeeM__WorkP__72C60C4A");

            });

            modelBuilder.Entity<EngagementLeadsMaster>(entity =>
            {
                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EngagementLeadsMasters)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Engagemen__Emplo__7D439ABD");

                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.EngagementLeadsMasters)
                    .HasForeignKey(d => d.EngagementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Engagemen__Engag__7C4F7684");
            });

            modelBuilder.Entity<EngagementMaster>(entity =>
            {
                entity.ToTable("EngagementMaster");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ActualCompletionDate).HasColumnType("date");

                entity.Property(e => e.ActualCost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BalanceMandays).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BalanceValue).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BudgetMandays).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BudgetMandaysPerMonth).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BudgetResoucesPerMonth).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Engagement).HasMaxLength(1000);

                entity.Property(e => e.InvoiceValue).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.PlannedCompletionDate).HasColumnType("date");

                entity.Property(e => e.PocompletionDate)
                    .HasColumnType("date")
                    .HasColumnName("POCompletionDate");

                entity.Property(e => e.Poexpiry)
                    .HasColumnType("date")
                    .HasColumnName("POExpiry");

                entity.Property(e => e.PomanDays)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("POManDays");

                entity.Property(e => e.PomanDaysPerMonth)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("POManDaysPerMonth");

                entity.Property(e => e.Pomonths)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("POMonths");

                entity.Property(e => e.PoresourcesPerMonth)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("POResourcesPerMonth");

                entity.Property(e => e.Postatus).HasColumnName("POStatus");

                entity.Property(e => e.Povalue)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("POValue");

                entity.Property(e => e.SpentMandates).HasColumnType("decimal(18, 2)");
                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.EngagementMasters)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Engagemen__Custo__75A278F5");
                entity.Ignore(p => p.start);
                entity.Ignore(p => p.searchText);
                entity.Ignore(p => p.sortColumn);
                entity.Ignore(p => p.sortDirection);
                entity.Ignore(p => p.pageSize);
                entity.Ignore(e => e.HoursSpent);
                entity.Ignore(e => e.CustomerName);
                entity.Ignore(e => e.Poexpiry);
                entity.Ignore(e => e.PocompletionDate);
                entity.Ignore(e => e.PlannedCompletionDate);
                entity.Ignore(e => e.Engagement_Type);


                //entity.Ignore(e => e.ApplicationsData);
                //entity.Ignore(e => e.PhasesData);
            });


            modelBuilder.Entity<LeaveRequestsMaster>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.IsPlanned);
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.LeavesReson);
                entity.Ignore(e => e.ApproverName);
                entity.Ignore(e => e.RequesterName);
                entity.Ignore(e => e.ApproverId);
                entity.Ignore(e => e.RoleId);
                entity.Ignore(e => e.FYIUsersList);
                entity.Ignore(e => e.FYIUsersIntList);
                entity.Ignore(e => e.EmployeeId);
                entity.Ignore(e => e.FYIUsersNames);
                entity.Ignore(e => e.LeaveTypeName);
                entity.Ignore(e => e.CreatedByName);


                entity.HasOne(d => d.Approver)
                    .WithMany(p => p.LeaveRequestsMasterApprovers)
                    .HasForeignKey(d => d.ApproverId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__LeaveRequ__Appro__3864608B");

                entity.HasOne(d => d.Requestor)
                    .WithMany(p => p.LeaveRequestsMasterRequestors)
                    .HasForeignKey(d => d.RequestorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__LeaveRequ__Reque__37703C52");

                entity.HasOne(d => d.Reson)
                    .WithMany(p => p.LeaveRequestsMasters)
                    .HasForeignKey(d => d.ResonId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__LeaveRequ__Reson__395884C4");
            });

            modelBuilder.Entity<MileStone>(entity =>
            {
                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.MileStones)
                    .HasForeignKey(d => d.EngagementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__MileStone__Engag__797309D9");

                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.fromDate);
                entity.Ignore(e => e.toDate);
                entity.Ignore(e => e.Engagement_Name);

            });

            modelBuilder.Entity<NotificationMaster>(entity =>
            {
                entity.HasOne(d => d.FromEmpNavigation)
                    .WithMany(p => p.NotificationMasterFromEmpNavigations)
                    .HasForeignKey(d => d.FromEmp)
                    .HasConstraintName("FK__Notificat__FromE__3D2915A8");

                entity.HasOne(d => d.ToEmpNavigation)
                    .WithMany(p => p.NotificationMasterToEmpNavigations)
                    .HasForeignKey(d => d.ToEmp)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Notificat__ToEmp__3C34F16F");
            });

            modelBuilder.Entity<PhaseMaster>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.EngagementName);

                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.PhaseMasters)
                    .HasForeignKey(d => d.EngagementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PhaseMast__Engag__17036CC0");
            });

            modelBuilder.Entity<PolicyWiseHoliday>(entity =>
            {
                entity.HasOne(d => d.Policy)
                    .WithMany(p => p.PolicyWiseHolidays)
                    .HasForeignKey(d => d.PolicyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PolicyWis__Polic__6C190EBB");
            });

            modelBuilder.Entity<PolicyWiseWorkingDay>(entity =>
            {
                entity.HasOne(d => d.Policy)
                    .WithMany(p => p.PolicyWiseWorkingDays)
                    .HasForeignKey(d => d.PolicyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PolicyWis__Polic__6EF57B66");
            });

            modelBuilder.Entity<TaskMaster>(entity =>
            {
                entity.HasOne(d => d.Application)
                    .WithMany(p => p.TaskMasters)
                    .HasForeignKey(d => d.ApplicationId)
                    .HasConstraintName("FK__TaskMaste__Appli__2739D489");

                entity.HasOne(d => d.AssignedToNavigation)
                    .WithMany(p => p.TaskMasters)
                    .HasForeignKey(d => d.AssignedTo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TaskMaste__Assig__282DF8C2");

                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.TaskMasters)
                    .HasForeignKey(d => d.EngagementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TaskMaste__Engag__25518C17");

                entity.HasOne(d => d.Phase)
                    .WithMany(p => p.TaskMasters)
                    .HasForeignKey(d => d.PhaseId)
                    .HasConstraintName("FK__TaskMaste__Phase__2645B050");
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.ApplicationString);
                entity.Ignore(e => e.PhaseString);
                entity.Ignore(e => e.AssignedToString);
                entity.Ignore(e => e.EngagementString);
                entity.Ignore(e => e.Customer);
                entity.Ignore(e => e.CreatedByString);
                entity.Ignore(e => e.StatusString);
                entity.Ignore(e => e.EngagementTypeString);

            });

            modelBuilder.Entity<TasksTimeSheet>(entity =>
            {
                entity.HasOne(d => d.Task)
                    .WithMany(p => p.TasksTimeSheets)
                    .HasForeignKey(d => d.TaskId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TasksTime__TaskI__31B762FC");
            });

            modelBuilder.Entity<TicketTimeSheet>(entity =>
            {
                entity.HasOne(d => d.Ticket)
                    .WithMany(p => p.TicketTimeSheets)
                    .HasForeignKey(d => d.TicketId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TicketTim__Ticke__3493CFA7");
            });

            modelBuilder.Entity<TicketsMaster>(entity =>
            {
                entity.HasOne(d => d.Application)
                    .WithMany(p => p.TicketsMasters)
                    .HasForeignKey(d => d.ApplicationId)
                    .HasConstraintName("FK__TicketsMa__Appli__2DE6D218");

                entity.HasOne(d => d.AssignedToNavigation)
                    .WithMany(p => p.TicketsMasters)
                    .HasForeignKey(d => d.AssignedTo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__TicketsMa__Assig__2EDAF651");

                entity.HasOne(d => d.Engagement)
                    .WithMany(p => p.TicketsMasters)
                    .HasForeignKey(d => d.EngagementId)
                    .HasConstraintName("FK__TicketsMa__Engag__2BFE89A6");

                entity.HasOne(d => d.Phase)
                    .WithMany(p => p.TicketsMasters)
                    .HasForeignKey(d => d.PhaseId)
                    .HasConstraintName("FK__TicketsMa__Phase__2CF2ADDF");

                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);
                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.ApplicationString);
                entity.Ignore(e => e.PhaseString);
                entity.Ignore(e => e.AssignedToString);
                entity.Ignore(e => e.EngagementString);
                entity.Ignore(e => e.Customer);
                entity.Ignore(e => e.CreatedByString);
                entity.Ignore(e => e.StatusString);
                entity.Ignore(e => e.PriorityString);
                entity.Ignore(e => e.EngagementTypeString);
            });

            modelBuilder.Entity<EngagementEmployeeMapping>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });


            modelBuilder.Entity<EmployeeRoleMapping>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<RolesMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("RolesMaster");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });


            modelBuilder.Entity<Permission>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
            });


            modelBuilder.Entity<NoChargesReason>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("NoChargesReason");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Reason).HasMaxLength(255);
            });

            modelBuilder.Entity<EmployeeCalendar>(entity =>
            {
                entity.ToTable("EmployeeCalendar");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.TotalHoursSpent).HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<EmployeeLeaveBalance>(entity =>
            {
                entity.ToTable("EmployeeLeaveBalance");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<LeaveType>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.LeaveName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<LeaveRequestStatus>(entity =>
            {
                entity.ToTable("LeaveRequestStatus");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.LeaveRequestName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<EmployeeReportingManagerMapping>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<PunchInOut>(entity =>
            {
                entity.ToTable("PunchInOut");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.PunchIn).HasColumnType("datetime");

                entity.Property(e => e.PunchOut).HasColumnType("datetime");
            });

            modelBuilder.Entity<TimesheetPolicy>(entity =>
            {
                entity.ToTable("TimesheetPolicy");

                entity.Ignore(e => e.sortColumn);
                entity.Ignore(e => e.searchText);
                entity.Ignore(e => e.sortDirection);
                entity.Ignore(e => e.pageSize);
                entity.Ignore(e => e.start);

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<ConfigTable>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("ConfigTable");

                entity.Property(e => e.ConfigKey)
                    .HasMaxLength(300)
                    .IsUnicode(false);

                entity.Property(e => e.ConfigValue)
                    .HasMaxLength(300)
                    .IsUnicode(false);

                entity.Property(e => e.Id).ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<EngagementTypeOption>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.EngagementType).HasMaxLength(255);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
