import Goal from '../models/Goal.js';
import mongoose from 'mongoose';

// @desc    Get active goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id, isDeleted: false });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set a goal
// @route   POST /api/goals
// @access  Private
export const setGoal = async (req, res) => {
  try {
    const { title, description, category, scheduledDate } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Please add a title and category' });
    }

    const goal = await Goal.create({
      title,
      description,
      category,
      scheduledDate, // Plugs identical string matching HTML5 form into DB record securely
      user: req.user.id,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    goal.isDeleted = true;
    await goal.save();

    res.status(200).json({ id: req.params.id, message: 'Goal softly deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get progress and statistics
// @route   GET /api/goals/progress
// @access  Private
export const getGoalProgress = async (req, res) => {
  try {
    // Explicitly convert to ObjectId for aggregation
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Aggregate by category
    const stats = await Goal.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
          completed: { 
            $sum: { 
              $cond: [
                { $and: [{ $eq: ["$isCompleted", true] }, { $eq: ["$isDeleted", false] }] }, 
                1, 
                0
              ] 
            } 
          },
          deleted: {
            $sum: { $cond: [{ $eq: ["$isDeleted", true] }, 1, 0] }
          },
          activeTotal: {
            $sum: { $cond: [{ $eq: ["$isDeleted", false] }, 1, 0] }
          }
        }
      }
    ]);

    // Format scores on a scale of 10
    const progress = stats.map(stat => {
      let score = 0;
      if (stat.activeTotal > 0) {
        score = (stat.completed / stat.activeTotal) * 10;
      }
      return {
        category: stat._id,
        score: score.toFixed(2), // Formatted strictly to 2 decimal places per user formulation rule
        totalTasksCreated: stat.total,
        totalCompleted: stat.completed,
        totalDeleted: stat.deleted,
        activeTasks: stat.activeTotal
      };
    });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
