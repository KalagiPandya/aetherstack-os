import React, { useState } from 'react';
import { Activity, Zap, Server, Database, Gauge, Play, CheckCircle2 } from 'lucide-react';

const BenchmarkSimulator = ({ benchmarks }) => {
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResult, setTestResult] = useState(null);

  const stats = benchmarks || {
    latency: '18ms',
    throughput: '28.4k req/s',
    dbQueryTime: '1.8ms',
    cacheHitRate: '97.2%',
  };

  const handleRunStressTest = () => {
    setTesting(true);
    setProgress(0);
    setTestResult(null);

    let curr = 0;
    const interval = setInterval(() => {
      curr += 20;
      setProgress(curr);
      if (curr >= 100) {
        clearInterval(interval);
        setTesting(false);
        setTestResult({
          requestsSent: 50000,
          p99Latency: '21.4ms',
          errorRate: '0.00%',
          status: 'Optimal (Grade A+)',
        });
      }
    }, 250);
  };

  return (
    <div style={{
      background: 'rgba(10, 13, 22, 0.9)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '8px',
            borderRadius: '8px',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Gauge size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Live System Benchmarks & Telemetry
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Hardware throughput & network telemetry simulator
            </span>
          </div>
        </div>

        <button
          onClick={handleRunStressTest}
          disabled={testing}
          className="btn-gradient"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          {testing ? <Activity size={15} className="spin" /> : <Play size={15} />}
          <span>{testing ? `Testing... ${progress}%` : 'Run Stress Benchmark'}</span>
        </button>
      </div>

      {/* Benchmark Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px',
        marginBottom: '20px',
      }}>
        <div style={{
          background: 'rgba(22, 29, 47, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            Avg Latency
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0 0' }}>
            {stats.latency}
          </h3>
        </div>

        <div style={{
          background: 'rgba(22, 29, 47, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            Max Throughput
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a855f7', margin: '4px 0 0' }}>
            {stats.throughput}
          </h3>
        </div>

        <div style={{
          background: 'rgba(22, 29, 47, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            DB Query Time
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', margin: '4px 0 0' }}>
            {stats.dbQueryTime}
          </h3>
        </div>

        <div style={{
          background: 'rgba(22, 29, 47, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
            Cache Hit Ratio
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ec4899', margin: '4px 0 0' }}>
            {stats.cacheHitRate}
          </h3>
        </div>
      </div>

      {/* Progress Bar (during stress test) */}
      {testing && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--accent-gradient)',
              transition: 'width 0.25s ease',
            }} />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
            Simulating 50,000 asynchronous concurrent HTTP calls...
          </span>
        </div>
      )}

      {/* Stress Test Results */}
      {testResult && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#34d399" />
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                Benchmark Complete: {testResult.status}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                50k Requests • P99 Latency: {testResult.p99Latency} • Error Rate: {testResult.errorRate}
              </span>
            </div>
          </div>
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981' }}>
            PASS 100%
          </span>
        </div>
      )}
    </div>
  );
};

export default BenchmarkSimulator;
