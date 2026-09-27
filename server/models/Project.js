import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    tagline: {
      type: String,
      required: [true, 'Please provide a short tagline'],
      trim: true,
      maxlength: [160, 'Tagline cannot exceed 160 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a full description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Full Stack', 'Frontend', 'Backend', 'AI & ML', 'Mobile App', 'UI/UX Design', 'DevOps'],
      default: 'Full Stack',
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // System Architecture Blueprint
    architecture: {
      client: { type: String, default: 'React 19, Vite, Glassmorphism UI' },
      api: { type: String, default: 'Node.js, Express REST API, JWT Auth' },
      database: { type: String, default: 'MongoDB Atlas NoSQL, Mongoose ODM' },
      cloud: { type: String, default: 'Render Cloud Engine, Vercel Edge' },
      complexityScore: { type: Number, default: 85 },
    },
    // High-Level System Benchmarks (For Interviewers & Technical Evaluation)
    benchmarks: {
      latency: { type: String, default: '22ms' },
      throughput: { type: String, default: '14.2k req/s' },
      dbQueryTime: { type: String, default: '2.4ms' },
      cacheHitRate: { type: String, default: '95.2%' },
    },
    // Live Interactive API Sandbox Endpoints
    apiEndpoints: [
      {
        method: { type: String, default: 'GET' },
        path: { type: String, default: '/api/v1/health' },
        description: { type: String, default: 'Service health & node latency check' },
        sampleResponse: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    // Threaded Technical Discussions / Code Reviews
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: [true, 'Comment text cannot be empty'],
          maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
