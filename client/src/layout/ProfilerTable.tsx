import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeadCell,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FetchProfilerMetrics } from "../services/dbService";
import { useMiniProfiler } from "../context/useMiniProfiler";

// Tvoj Profiler tip (isti kao što si već naveo)
type Profiler = {
  Id: string;
  Name: string;
  Started: string;
  DurationMilliseconds: number;
  MachineName: string;
  User: string;
  HasUserViewed: boolean;
  RootTimingId: string;
  Root: {
    Id: string;
    Name: string;
    DurationMilliseconds: number;
    StartMilliseconds: number;
    HasCustomTimings: boolean;
    CustomTimings?: {
      "resource-metrics"?: Array<{
        Id: string;
        CommandString: string;
        StackTraceSnippet: string;
        StartMilliseconds: number;
        Errored: boolean;
      }>;
    };
    Children: Array<{
      Id: string;
      Name: string;
      DurationMilliseconds: number;
      StartMilliseconds: number;
      HasCustomTimings: boolean;
      Children: Array<{
        Id: string;
        Name: string;
        DurationMilliseconds: number;
        StartMilliseconds: number;
        HasCustomTimings: boolean;
        CustomTimings?: {
          sql?: Array<{
            Id: string;
            CommandString: string;
            ExecuteType: string;
            StackTraceSnippet: string;
            StartMilliseconds: number;
            DurationMilliseconds: number;
            Errored: boolean;
          }>;
        };
      }>;
    }>;
  };
};

export default function ProfilerMetricsTable() {
  const { id: metricId } = useMiniProfiler();
  const [profiler, setProfiler] = useState<Profiler | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function GetMetrics() {
      if (metricId) {
        try {
          setLoading(true);
          const data = await FetchProfilerMetrics(metricId);
          setProfiler(data);
        } catch (error) {
          console.error("Failed to fetch profiler metrics:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    GetMetrics();
  }, [metricId]);

  if (loading || !profiler) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  const root = profiler.Root;
  const totalExecutionTime = root.DurationMilliseconds;
  const routeName = root.Name.substring(22);

  const sqlTimings =
    root.Children?.[0]?.Children?.[2]?.CustomTimings?.sql ?? [];

  const getDuration = (type: string): number =>
    sqlTimings.find((s) => s.ExecuteType === type)?.DurationMilliseconds ?? 0;

  const sqlExecuteReader = getDuration("ExecuteReader (Async)");
  const sqlOpen = getDuration("OpenAsync");
  const sqlClose = getDuration("CloseAsync");

  const resourceCommand =
    root.CustomTimings?.["resource-metrics"]?.[0]?.CommandString ?? "";

  const cpu = resourceCommand.match(/CPU\(ms\):\s*([\d,]+)/)?.[1];
  const allocatedBytes = resourceCommand.match(
    /Allocated bytes:\s*(-?\d+)/
  )?.[1];
  const ram = resourceCommand.match(/RAM\(MB\):\s*(\d+)/)?.[1];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2 text-gray-400">
        Route: <span className="text-gray-400">{routeName}</span>
      </h2>
      <h3 className="text-md font-medium mb-4 text-gray-500">Results</h3>

      <Table striped hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Metric</TableHeadCell>
            <TableHeadCell>Value</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total Execution Time</TableCell>
            <TableCell>{totalExecutionTime.toFixed(2)} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SQL - ExecuteReader</TableCell>
            <TableCell>{sqlExecuteReader.toFixed(2)} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SQL - Open Connection</TableCell>
            <TableCell>{sqlOpen.toFixed(2)} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SQL - Close Connection</TableCell>
            <TableCell>{sqlClose.toFixed(2)} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPU Time</TableCell>
            <TableCell>{cpu} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Allocated Memory</TableCell>
            <TableCell>{allocatedBytes} bytes</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>RAM Usage</TableCell>
            <TableCell>{ram} MB</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
