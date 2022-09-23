using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Utility.Repository;
using Prosares.Wow.Utility.Services.Mail;
using Prosares.Wow.Utility.Services.UpdateHoursSpent;
using System;

namespace Prosares.Wow.Utility
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var Host = CreateHostBuilder(args).Build();

            UpdateHoursSpentService updateHoursSpent = Host.Services.GetService<UpdateHoursSpentService>();
            updateHoursSpent.Process();
        }

        static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration(app =>
                {
                    app.AddJsonFile("appsettings.json");
                })
                .ConfigureServices((context, services) =>
                {
                    //services.AddSingleton(context.Configuration.GetSection("myConfiguration").Get<MyConfiguration>());
                    services.Configure<ConnectionStrings>(context.Configuration.GetSection("ConnectionStrings"));
                    services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
                    services.AddTransient<UpdateHoursSpentService>();
                    services.AddScoped<IMailService, MailService>();
                })
            .ConfigureLogging(logBuilder =>
            {
                logBuilder.SetMinimumLevel(LogLevel.Trace);
                logBuilder.AddLog4Net("log4net.config");

            }).UseConsoleLifetime();
        }
    }
}
