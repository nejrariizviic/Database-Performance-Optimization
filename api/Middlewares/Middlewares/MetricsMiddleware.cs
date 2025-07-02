using System.Diagnostics;
using StackExchange.Profiling;

namespace api.Middlewares;

public class MetricsMiddleware
{
    private readonly RequestDelegate _next;

    public MetricsMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var profiler = MiniProfiler.Current;
        if (profiler == null)
        {
            await _next(context);
            return;
        }

        var process = Process.GetCurrentProcess();

        var cpuStart = process.TotalProcessorTime;
        var memoryStart = GC.GetAllocatedBytesForCurrentThread();
        var ramStart = process.WorkingSet64;

        var stopwatch = Stopwatch.StartNew();

        await _next(context);

        stopwatch.Stop();

        var cpuEnd = process.TotalProcessorTime;
        var memoryEnd = GC.GetAllocatedBytesForCurrentThread();
        var ramEnd = process.WorkingSet64;

        var cpuUsedMs = (cpuEnd - cpuStart).TotalMilliseconds;
        var memoryAllocated = memoryEnd - memoryStart;
        var ramUsedMb = ramEnd / (1024 * 1024);

        profiler.CustomTiming("resource-metrics", $"CPU(ms): {cpuUsedMs:F2}, Allocated bytes: {memoryAllocated}, RAM(MB): {ramUsedMb}");
    }
}
