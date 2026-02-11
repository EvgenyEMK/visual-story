/**
 * Hook to poll export rendering progress at 3-second intervals.
 * Automatically stops polling when the export completes or fails.
 * @source docs/modules/export-publish/video-export.md
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ExportStatusResponse } from '@/types/billing';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Polling interval in milliseconds. */
const POLL_INTERVAL_MS = 3_000;

/** Maximum number of consecutive errors before stopping. */
const MAX_ERRORS = 5;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useExportProgress(exportId: string | null) {
  const [status, setStatus] = useState<ExportStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const errorCountRef = useRef(0);

  const fetchStatus = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/exports/${id}/status`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: ExportStatusResponse = await response.json();
      setStatus(data);
      setError(null);
      errorCountRef.current = 0;
      return data;
    } catch (err) {
      errorCountRef.current += 1;
      if (errorCountRef.current >= MAX_ERRORS) {
        setError('Failed to fetch export status. Please check your connection.');
      }
      return null;
    }
  }, []);

  useEffect(() => {
    if (!exportId) {
      setStatus(null);
      setError(null);
      errorCountRef.current = 0;
      return;
    }

    // Initial fetch
    fetchStatus(exportId);

    const pollInterval = setInterval(async () => {
      const data = await fetchStatus(exportId);

      // Stop polling on terminal states
      if (data?.status === 'complete' || data?.status === 'failed') {
        clearInterval(pollInterval);
      }

      // Stop polling on too many errors
      if (errorCountRef.current >= MAX_ERRORS) {
        clearInterval(pollInterval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollInterval);
  }, [exportId, fetchStatus]);

  return { status, error };
}
