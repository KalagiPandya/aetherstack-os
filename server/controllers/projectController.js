import Project from '../models/Project.js';

// Helper: Calculate complexity score based on tech stack and category
const calculateComplexity = (category, tags = []) => {
  let score = 70;
  const tagList = tags.map((t) => t.toLowerCase());

  if (category === 'Full Stack' || category === 'AI & ML' || category === 'DevOps') score += 15;
  if (tagList.some((t) => t.includes('mongo') || t.includes('postgres') || t.includes('database'))) score += 5;
  if (tagList.some((t) => t.includes('jwt') || t.includes('auth') || t.includes('security'))) score += 4;
  if (tagList.some((t) => t.includes('docker') || t.includes('aws') || t.includes('cloud'))) score += 5;
  if (tagList.some((t) => t.includes('socket') || t.includes('webrtc') || t.includes('realtime'))) score += 5;

  return Math.min(score, 99);
};

// @desc    Get all projects (with Search, Category Filter, and Populated Relations)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    let sortBy = { createdAt: -1 };
    if (sort === 'popular') {
      sortBy = { likes: -1 };
    }

    const projects = await Project.find(query)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar role')
      .sort(sortBy);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('user', 'name avatar role bio')
      .populate('comments.user', 'name avatar role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Requires login)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      tags,
      thumbnail,
      liveUrl,
      githubUrl,
      architecture,
    } = req.body;

    if (!title || !tagline || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []);
    const complexityScore = calculateComplexity(category, parsedTags);

    const project = await Project.create({
      title,
      tagline,
      description,
      category,
      tags: parsedTags,
      thumbnail: thumbnail || undefined,
      liveUrl,
      githubUrl,
      architecture: {
        client: architecture?.client || (category === 'Mobile App' ? 'React Native / Flutter' : 'React 19, Vite, Glassmorphism'),
        api: architecture?.api || 'Node.js, Express REST API, JWT Auth',
        database: architecture?.database || 'MongoDB Atlas NoSQL, Mongoose ODM',
        cloud: architecture?.cloud || 'Render Cloud Engine, Vercel Edge',
        complexityScore,
      },
      user: req.user._id,
    });

    const populated = await Project.findById(project._id).populate('user', 'name avatar role');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name avatar role');

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle like on a project
// @route   POST /api/projects/:id/like
// @access  Private (Requires login)
export const toggleLikeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const alreadyLiked = project.likes.some(
      (likeId) => likeId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      project.likes = project.likes.filter(
        (likeId) => likeId.toString() !== req.user._id.toString()
      );
    } else {
      project.likes.push(req.user._id);
    }

    await project.save();

    res.status(200).json({
      success: true,
      likesCount: project.likes.length,
      likes: project.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to project
// @route   POST /api/projects/:id/comments
// @access  Private (Requires login)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const newComment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    project.comments.unshift(newComment);
    await project.save();

    const updated = await Project.findById(req.params.id)
      .populate('comments.user', 'name avatar role');

    res.status(201).json({
      success: true,
      data: updated.comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
