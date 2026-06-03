// src/utils/payroll/bulkJobStatus.ts

export const bulkJobStatus: Record<
  string,
  {
    total: number;
    processed: number;
    failed: number;
    done: boolean;
    status: "idle" | "processing" | "completed" | "failed";
  }
> = {};
