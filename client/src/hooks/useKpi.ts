
import { useState, useEffect } from 'react';
import { KpiMetrics, getLiveKpi } from '@/api/kpi';
import { io, Socket } from 'socket.io-client';

export const useKpi = () => {
  const [metrics, setMetrics] = useState<KpiMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    let socket: Socket;

    const initializeKpi = async () => {
      try {
        // Initial fetch
        const initialMetrics = await getLiveKpi();
        setMetrics(initialMetrics);
        setLoading(false);

        // Setup WebSocket connection for real-time updates
        socket = io(window.location.origin, {
          auth: {
            token: localStorage.getItem('authToken')
          }
        });

        socket.on('kpi:update', (updatedMetrics: KpiMetrics) => {
          setMetrics(updatedMetrics);
        });

        socket.on('connect_error', (err) => {
          console.warn('Socket connection failed, falling back to polling:', err);
          setupPolling();
        });

        socket.on('disconnect', () => {
          console.warn('Socket disconnected, falling back to polling');
          setupPolling();
        });

      } catch (err) {
        console.error('KPI initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load KPI data');
        setLoading(false);
        setupPolling();
      }
    };

    const setupPolling = () => {
      if (pollInterval) clearInterval(pollInterval);
      
      pollInterval = setInterval(async () => {
        try {
          const freshMetrics = await getLiveKpi();
          setMetrics(freshMetrics);
          setError(null);
        } catch (pollError) {
          console.warn('KPI polling failed:', pollError);
          setError('Connection issues - retrying...');
        }
      }, 30000);
    };

    initializeKpi().catch(console.error);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (socket) socket.disconnect();
    };
  }, []);

  return { metrics, loading, error };
};
