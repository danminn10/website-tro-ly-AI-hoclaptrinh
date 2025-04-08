const { Progress } = require('../models/Progress');

// Thêm Progress
const createProgress = async (req, res) => {
  try {
    const { userId, courseId, status } = req.body;
    const progress = await Progress.create({ userId, courseId, status });
    res.status(201).json({ message: 'Progress created successfully', progress });
  } catch (error) {
    res.status(400).json({ message: 'Error creating progress', error });
  }
};

// Cập nhật Progress
const updateProgress = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const progress = await Progress.findByPk(id);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    progress.status = status || progress.status;
    await progress.save();
    res.status(200).json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    res.status(400).json({ message: 'Error updating progress', error });
  }
};

// Xóa Progress
const deleteProgress = async (req, res) => {
  const { id } = req.params;
  try {
    const progress = await Progress.findByPk(id);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    await progress.destroy();
    res.status(200).json({ message: 'Progress deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting progress', error });
  }
};

// Tìm kiếm Progress
const searchProgress = async (req, res) => {
  const { status } = req.query;
  try {
    const progress = await Progress.findAll({
      where: {
        status: status
      }
    });
    res.status(200).json(progress);
  } catch (error) {
    res.status(400).json({ message: 'Error searching for progress', error });
  }
};

module.exports = {
  createProgress,
  updateProgress,
  deleteProgress,
  searchProgress
};
