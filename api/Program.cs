using api;
using api.Data;
using api.Middlewares;
using api.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("SQLConnectionString");

builder.Services.AddDbContext<DBContext>(opt =>
{
    opt.UseSqlServer(connectionString, sql => sql.CommandTimeout(700));
});

var allowOrigin = "allowAllOriginSpecific";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(name: allowOrigin, policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().WithExposedHeaders("x-miniprofiler-ids");
    });
});

builder.Services.AddControllers();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();

builder.Services.AddMiniProfiler(options =>
{
    options.RouteBasePath = "/profiler";
    options.TrackConnectionOpenClose = true;
    options.MaxUnviewedProfiles = 0;
}).AddEntityFramework();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments(new PathString("/profiler")))
    {
        if (context.Request.Headers.TryGetValue("Origin", out var origin))
        {
            context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
            if (context.Request.Method == "OPTIONS")
            {
                context.Response.StatusCode = 200;
                context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type");
                context.Response.Headers.Append("Access-Control-Allow-Methods", "OPTIONS, GET");
                await context.Response.CompleteAsync();
                return;
            }
        }
    }

    await next();
});

app.UseMiniProfiler();
app.UseHttpsRedirection();
app.UseCors(allowOrigin);
app.UseMiddleware<MetricsMiddleware>();
app.MapControllers();
app.Run();