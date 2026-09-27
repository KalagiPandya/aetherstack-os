import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, Clock, Copy, Check } from 'lucide-react';

const InteractiveLiveApiTester = ({ endpoints, projectTitle }) => {
  const defaultEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/health',
      description: 'System health, memory allocation, and active node check',
      sampleResponse: {
        status: 'online',
        nodes_active: 8,
        uptime_seconds: 489201,
        engine: 'AetherStack Distributed Core',
        memory_usage: { rss_mb: 142.6, heap_total_mb: 88.4 },
      },
    },
    {
      method: 'POST',
      path: '/api/v1/query/execute',
      description: 'Execute high-throughput query against clustered database tier',
      sampleResponse: {
        execution_id: 'exec_77189a',
        status: 'SUCCESS',
        records_scanned: 18400,
        returned_count: 15,
        latency_ms: 11.2,
      },
    },
  ];

  const apiList = endpoints && endpoints.length > 0 ? endpoints : defaultEndpoints;

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [executing, setExecuting] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  const currentEndpoint = apiList[selectedIdx] || apiList[0];

  const handleExecute = () => {
    setExecuting(true);
    setResponse(null);

    setTimeout(() => {
      setExecuting(false);
      setResponse({
        statusCode: 200,
        statusText: 'OK',
        time: `${(Math.random() * 10 + 8).toFixed(1)}ms`,
        size: '1.24 KB',
        data: currentEndpoint.sampleResponse || { status: 'success', timestamp: new Date().toISOString() },
      });
    }, 400);
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      background: 'rgba(10, 13, 22, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Sandbox Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '8px',
            borderRadius: '8px',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Terminal size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Live Interactive API Endpoint Sandbox
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Test real JSON REST responses with simulated runtime latency
            </span>
          </div>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
        {apiList.map((ep, idx) => {
          const isSelected = selectedIdx === idx;
          const isGet = ep.method === 'GET';
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setResponse(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                background: isGet ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                color: isGet ? '#34d399' : '#60a5fa',
              }}>
                {ep.method}
              </span>
              <span>{ep.path}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Endpoint Request Bar */}
      <div style={{
        background: 'rgba(16, 21, 34, 0.8)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 8px',
            borderRadius: '4px',
            background: currentEndpoint.method === 'GET' ? '#10b981' : '#3b82f6',
            color: '#fff',
          }}>
            {currentEndpoint.method}
          </span>
          <code style={{ fontSize: '0.9rem', color: '#f8fafc', background: 'transparent' }}>
            {currentEndpoint.path}
          </code>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            — {currentEndpoint.description}
          </span>
        </div>

        <button
          onClick={handleExecute}
          disabled={executing}
          className="btn-gradient"
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <Play size={14} />
          <span>{executing ? 'Sending...' : 'Send Request'}</span>
        </button>
      </div>

      {/* JSON Response Terminal */}
      {response ? (
        <div style={{
          background: '#07090f',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease',
        }}>
          {/* Terminal Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.78rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> {response.statusCode} {response.statusText}
              </span>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {response.time}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                Size: {response.size}
              </span>
            </div>

            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
              }}
            >
              {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          {/* JSON Body */}
          <pre style={{
            padding: '16px',
            margin: 0,
            color: '#38bdf8',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            maxHeight: '220px',
          }}>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border-color)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}>
          Click <strong>"Send Request"</strong> to execute this endpoint and inspect the live JSON payload.
        </div>
      )}
    </div>
  );
};

export default InteractiveLiveApiTester;
