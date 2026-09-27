import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing records from MongoDB Atlas...');
    await Project.deleteMany();
    await User.deleteMany();

    console.log('👤 Creating Master Developer & Architect profiles...');
    // Create Master Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Elena Rostova',
        email: 'elena@aetherstack.dev',
        password: hashedPassword,
        role: 'developer',
        bio: 'Principal Distributed Systems Engineer & AI Pipeline Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@aetherstack.dev',
        password: hashedPassword,
        role: 'creator',
        bio: 'High-Frequency FinTech & Ledger Infrastructure Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      },
      {
        name: 'Aria Chen',
        email: 'aria@aetherstack.dev',
        password: hashedPassword,
        role: 'developer',
        bio: 'Spatial WebRTC & Real-time Visual Compute Engineer',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
      },
    ]);

    console.log('⚡ Seeding Master-Level Architecture Stacks...');
    await Project.insertMany([
      {
        title: 'NexusVector AI',
        tagline: 'Distributed Vector Indexing & Semantic Neural Search Gateway',
        description: `NexusVector AI is a high-throughput, low-latency neural search engine built for AI applications.
Features:
- Distributed HNSW Vector indexing for million-scale embeddings.
- Automatic cosine similarity and dense vector ranking.
- Sub-15ms search response time with hybrid caching.
- Scalable Node.js stream ingestion connected to MongoDB Atlas Vector Search.`,
        category: 'AI & ML',
        tags: ['FastAPI', 'Node.js', 'MongoDB Atlas Vector', 'OpenAI', 'Redis', 'HNSW Index'],
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
        liveUrl: 'https://nexusvector.ai.dev',
        githubUrl: 'https://github.com/aetherstack/nexus-vector-core',
        user: users[0]._id,
        likes: [users[0]._id, users[1]._id, users[2]._id],
        architecture: {
          client: 'React 19 + WebGL Neural Visualizer',
          api: 'Express Async Stream Gateway + Python Microservices',
          database: 'MongoDB Atlas Vector Search + In-Memory Redis Tier',
          cloud: 'Kubernetes Cluster on AWS EKS with Edge CDN',
          complexityScore: 98,
        },
        benchmarks: {
          latency: '14ms',
          throughput: '34.5k req/s',
          dbQueryTime: '1.6ms',
          cacheHitRate: '98.2%',
        },
        apiEndpoints: [
          {
            method: 'POST',
            path: '/api/v1/vector/embed',
            description: 'Generate dense mathematical embeddings from natural language text',
            sampleResponse: {
              status: 'success',
              dimensions: 1536,
              tokens_processed: 42,
              latency_ms: 12.4,
              vector_sample: [0.0142, -0.0481, 0.0892, -0.0019, 0.0543],
            },
          },
          {
            method: 'GET',
            path: '/api/v1/vector/search?q=neural_mesh',
            description: 'Execute nearest-neighbor semantic search with cosine ranking',
            sampleResponse: {
              hits: 3,
              time_ms: 14.1,
              results: [
                { id: 'doc_902', similarity: 0.984, title: 'Distributed Graph Sharding' },
                { id: 'doc_441', similarity: 0.941, title: 'HNSW Index Acceleration' },
              ],
            },
          },
        ],
        comments: [
          {
            user: users[1]._id,
            text: 'The sub-15ms latency on HNSW index lookup is remarkably fast for a Node.js gateway! Great separation of concerns.',
            createdAt: new Date(Date.now() - 3600000 * 5),
          },
          {
            user: users[2]._id,
            text: 'Are you using Redis for caching cosine scores before hitting Atlas? Very smart design.',
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
        ],
      },
      {
        title: 'HyperMesh FinTech',
        tagline: 'Sub-Millisecond Multi-Currency Liquidity & Double-Entry Ledger',
        description: `An institutional-grade ledger and automated market liquidity engine.
Features:
- ACID-compliant multi-document transactions in MongoDB.
- Real-time orderbook matching with WebSocket streaming.
- Double-entry cryptographic audit verification.
- Zero-loss failover architecture with Kafka event sourcing.`,
        category: 'Full Stack',
        tags: ['React 19', 'Express', 'MongoDB Transactions', 'Kafka', 'WebSockets', 'Tailwind'],
        thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1000',
        liveUrl: 'https://hypermesh.trade.dev',
        githubUrl: 'https://github.com/aetherstack/hypermesh-ledger',
        user: users[1]._id,
        likes: [users[0]._id, users[1]._id],
        architecture: {
          client: 'React 19 Orderbook UI with Canvas Charts',
          api: 'Express REST & High-Throughput WebSocket Gateway',
          database: 'MongoDB Atlas Distributed Replica Set with ACID Sessions',
          cloud: 'Bare-Metal FinTech Cloud Nodes with 10Gbps Fiber',
          complexityScore: 97,
        },
        benchmarks: {
          latency: '8ms',
          throughput: '58.2k req/s',
          dbQueryTime: '0.8ms',
          cacheHitRate: '99.4%',
        },
        apiEndpoints: [
          {
            method: 'POST',
            path: '/api/v1/ledger/transfer',
            description: 'Execute atomic double-entry funds transfer with cryptographic verification',
            sampleResponse: {
              transaction_id: 'tx_998124801',
              status: 'COMMITTED',
              execution_time_ms: 7.8,
              balance_updates: { debit: -50000.0, credit: 50000.0, currency: 'USD' },
            },
          },
          {
            method: 'GET',
            path: '/api/v1/market/depth?pair=BTC_USD',
            description: 'Stream current L2 orderbook snapshot and liquidity depth',
            sampleResponse: {
              pair: 'BTC_USD',
              spread: 0.15,
              bids_count: 1420,
              asks_count: 1390,
              mid_price: 94820.5,
            },
          },
        ],
        comments: [
          {
            user: users[0]._id,
            text: 'Handling double-entry ledger with MongoDB sessions and atomic transaction guarantees is pristine.',
            createdAt: new Date(Date.now() - 3600000 * 8),
          },
        ],
      },
      {
        title: 'Chronos Spatial Cloud',
        tagline: 'WebRTC Mesh & Low-Latency Spatial Audio Collaborative Canvas',
        description: `Chronos is an ultra-fast collaborative whiteboard and spatial audio engine for distributed teams.
Features:
- Multi-peer WebRTC mesh routing with dynamic bandwidth adaptation.
- Proximity-based 3D spatial audio panning.
- Operational Transformation (OT) conflict resolution for concurrent canvas edits.
- Delta compression over binary WebSockets.`,
        category: 'Frontend',
        tags: ['WebRTC', 'React 19', 'Socket.io', 'Canvas API', 'Node.js', 'Redis Pub/Sub'],
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000',
        liveUrl: 'https://chronos-spatial.dev',
        githubUrl: 'https://github.com/aetherstack/chronos-webrtc-mesh',
        user: users[2]._id,
        likes: [users[0]._id, users[2]._id],
        architecture: {
          client: 'HTML5 60FPS Canvas + Web Audio API + React 19',
          api: 'Node.js SFU Signaling Server + Socket.io Clustering',
          database: 'MongoDB Atlas User State & Session Archives',
          cloud: 'Global Anycast Edge Network with UDP Routing',
          complexityScore: 95,
        },
        benchmarks: {
          latency: '18ms',
          throughput: '22.0k req/s',
          dbQueryTime: '1.9ms',
          cacheHitRate: '95.6%',
        },
        apiEndpoints: [
          {
            method: 'POST',
            path: '/api/v1/room/create',
            description: 'Allocate an ephemeral spatial room with dedicated SFU relay',
            sampleResponse: {
              room_id: 'room_spatial_7781',
              relay_endpoint: 'wss://sfu-01.chronos.dev',
              max_peers: 50,
              audio_codec: 'Opus 48kHz',
            },
          },
        ],
        comments: [
          {
            user: users[1]._id,
            text: 'The WebRTC mesh with spatial audio fallbacks is mind-blowing. Super smooth Canvas rendering!',
            createdAt: new Date(Date.now() - 3600000 * 4),
          },
        ],
      },
      {
        title: 'AetherDevOps Telemetry',
        tagline: 'Kernel-Level eBPF Telemetry & Automated Canary Deployment Engine',
        description: `Cloud-native observability and progressive delivery platform.
Features:
- Kernel-level packet inspection using eBPF probes.
- Automated progressive Canary traffic shifting with error-rate circuit breaking.
- Prometheus-compatible metrics scraping engine.
- Instant incident response webhooks and Slack integrations.`,
        category: 'DevOps',
        tags: ['Kubernetes', 'Docker', 'eBPF', 'Prometheus', 'Express', 'MongoDB Atlas'],
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000',
        liveUrl: 'https://aether-telemetry.io',
        githubUrl: 'https://github.com/aetherstack/aether-ebpf-engine',
        user: users[0]._id,
        likes: [users[0]._id, users[1]._id, users[2]._id],
        architecture: {
          client: 'React 19 Real-Time Telemetry Dashboard',
          api: 'Express gRPC Bridge + Prometheus Metric Pipeline',
          database: 'MongoDB Atlas Time Series Collections',
          cloud: 'Multi-Region Kubernetes (EKS & GKE)',
          complexityScore: 96,
        },
        benchmarks: {
          latency: '11ms',
          throughput: '48.0k req/s',
          dbQueryTime: '1.2ms',
          cacheHitRate: '98.7%',
        },
        apiEndpoints: [
          {
            method: 'GET',
            path: '/api/v1/telemetry/nodes',
            description: 'Fetch real-time CPU, Memory, and Kernel socket statistics',
            sampleResponse: {
              cluster_nodes: 18,
              healthy_nodes: 18,
              active_ebpf_probes: 240,
              avg_cpu_load: '34.2%',
            },
          },
        ],
        comments: [
          {
            user: users[2]._id,
            text: 'eBPF probe aggregation stored in MongoDB time-series collections is pure genius.',
            createdAt: new Date(Date.now() - 3600000 * 1),
          },
        ],
      },
    ]);

    console.log('🎉 MongoDB Atlas Seeding Successfully Completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
