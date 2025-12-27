const Category = require("../Models/Category");

// ➕ Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = await Category.create({
      userId: req.userId,
      name,
      type,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category already exists or invalid data",
    });
  }
};

// 📄 Get All Categories (for logged-in user)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};
