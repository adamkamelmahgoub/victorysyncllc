
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { KpiMetrics, getLiveKpi } from '@/api/kpi';

export const useKpi = () => {
  const [metrics, setMetrics] = useState<KpiMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: Socket;
    let pollInterval: NodeJS.Timeout;

    const initializeKpi = async () => {
      try {
        // Initial fetch
        const initialMetrics = await getLiveKpi();
        setMetrics(initialMetrics);
        setLoading(false);

        // Setup Socket.IO for real-time updates
        socket = io();
        socket.on('kpi:update', (updatedMetrics: KpiMetrics) => {
          setMetrics(updatedMetrics);
        });

        // Fallback polling every 30 seconds
        pollInterval = setInterval(async () => {
          try {
            const freshMetrics = await getLiveKpi();
            setMetrics(freshMetrics);
          } catch (pollError) {
            console.warn('KPI polling failed:', pollError);
          }
        }, 30000);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load KPI data');
        setLoading(false);
      }
    };

    initializeKpi();

    return () => {
      if (socket) socket.disconnect();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  return { metrics, loading, error };
};
