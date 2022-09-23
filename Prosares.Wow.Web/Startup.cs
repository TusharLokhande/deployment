using log4net.Core;
using log4net.Repository.Hierarchy;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Prosares.Wow.Data;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Repository;
using Prosares.Wow.Data.Services.Common.DropdownService;
using Prosares.Wow.Data.Services.Customers;
using Prosares.Wow.Data.Services.Dashboard;
using Prosares.Wow.Data.Services.Employee;
using Prosares.Wow.Data.Services.EngagementMaster;
using Prosares.Wow.Data.Services.Ticket;
using Prosares.Wow.Data.Services.Milestone;
using Prosares.Wow.Data.Services.LeaveRequest;
using Prosares.Wow.Data.Services.LeavesReson;
using Prosares.Wow.Data.Services.WorkPolicy;
using Prosares.Wow.Data.Services.Application;
using System.Text;
using Prosares.Wow.Data.Services.Task;
using Prosares.Wow.Data.Services.CapicityAllocation;
using Prosares.Wow.Data.Services.CostCenterMaster;
using Prosares.Wow.Data.Services.Phase;
using Prosares.Wow.Data.Services.Calendar;
using Prosares.Wow.Data.Services.ManagerDashboard;
using Prosares.Wow.Data.Services.PunchInOut;
using Prosares.Wow.Data.Services.Mail;
using Prosares.Wow.Data.Services.TimeSheetPolicy;
using Prosares.Wow.Data.Services.CapacityUtilizationReport;
using Prosares.Wow.Data.Services.ResourceCapacity;
using Prosares.Wow.Data.Services.MilestoneReport;

namespace Prosares.Wow.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
        };
    });
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            //Passing ConnectionString to SQLDBContext
            services.AddDbContextPool<SqlDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))); //use on local
            //services.AddDbContextPool<SqlDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("ProductionConnection"))); // use on production
            //services.AddScoped(ILogger)
            services.Configure<ConnectionString>(Configuration.GetSection("ConnectionString")); //use on local
            //services.Configure<ConnectionString>(Configuration.GetSection("ProdConnectionString")); // use on production
            services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
            services.AddScoped<ICustomerService, CustomerService>();

            services.AddScoped<IEngagementMasterService, EngagementMasterService>();
            // services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<IDropdownService, DropdownService>();
            services.AddScoped<ITicketService, TicketService>();

            services.AddScoped<IMilestoneService, MilestoneService>();
            services.AddScoped<IDashboardService, DashboardService>();

            services.AddScoped<ILeavesResonService, LeavesResonService>();
            services.AddScoped<ILeaveRequestMasterService, LeaveRequestMasterService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<IWorkPoliciesService, WorkPoliciesService>();
            services.AddScoped<IDropdownService, DropdownService>();
            services.AddScoped<ITaskService, TaskService>();
            services.AddScoped<ICapicityAllocationService, CapicityAllocationService>();
            services.AddScoped<IApplicationService, ApplicationService>();
            services.AddScoped<ICostCenterService, CostCenterService>();
            services.AddScoped<IPhaseMasterService, PhaseMasterService>();
            services.AddScoped<ICalendarService, CalendarService>();
            services.AddScoped<IManagerDashboardService, ManagerDashboardService>();
            services.AddScoped<IPunchInOutService, PunchInOutService>();
            services.AddScoped<IMailService, MailService>();
            services.AddScoped<ITimeSheetPolicyService, TimeSheetPolicyService>();
            services.AddScoped<ICapacityUtilizationReport, CapacityUtilizationReportService>();
            services.AddScoped<IResourceCapacity, ResourceCapacityService>();
            services.AddScoped<IMileStoneReport, MileStoneReport>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //Logger
            //loggerFactory.

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
