import React from 'react';
import { Layers, Server, Database, Cloud, Cpu, Activity } from 'lucide-react';

const ArchitectureBlueprint = ({ architecture, category, title }) => {
  const arch = architecture || {
    client: 'React 19, Vite, Glassmorphism UI',
    api: 'Node.js, Express REST API, JWT Auth',
    database: 'MongoDB Atlas NoSQL, Mongoose ODM',
    cloud: 'Render Cloud Engine, Vercel Edge',
    complexityScore: 88,
  };

  const score = arch.complexityScore || 85;

  return (
    <div style={{
      background: 'rgba(10, 13, 22, 0.9)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      {/* Blueprint Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '8px',
            borderRadius: '8px',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              System Architecture Blueprint
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Interactive Full-Stack Node Visualizer
            </span>
          </div>
        </div>

        {/* Complexity Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(236, 72, 153, 0.12)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 12px',
        }}>
          <Activity size={14} color="#ec4899" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f472b6' }}>
            Complexity: {score}/100
          </span>
        </div>
      </div>

      {/* Interactive System Flow Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Node 1: Client */}
        <div style={{
          background: 'rgba(22, 29, 47, 0.8)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#818cf8' }}>
            <Layers size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              1. Client Layer
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            {arch.client}
          </p>
        </div>

        {/* Node 2: API Gateway */}
        <div style={{
          background: 'rgba(22, 29, 47, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c084fc' }}>
            <Server size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              2. API Gateway
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            {arch.api}
          </p>
        </div>

        {/* Node 3: Database */}
        <div style={{
          background: 'rgba(22, 29, 47, 0.8)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#34d399' }}>
            <Database size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              3. Cloud Database
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            {arch.database}
          </p>
        </div>

        {/* Node 4: Infrastructure */}
        <div style={{
          background: 'rgba(22, 29, 47, 0.8)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f472b6' }}>
            <Cloud size={16} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              4. Deployment Cloud
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
            {arch.cloud}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureBlueprint;
