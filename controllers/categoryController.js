const { prisma } = require("../DB/db.config")
const AppError = require("../utils/appError")
const catchAsync = require('../utils/catchAsync')


exports.createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    const newData = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
  
    if (!newData) {
      return next(new AppError('Category creation failed', 500));
    }
  
    return res.status(201).json({
      status: 'success',
      data: newData,
    });
  });
  
  // Get All Categories
  exports.getAllCategory = catchAsync(async (req, res, next) => {
    const allData = await prisma.category.findMany();
  
    if (!allData || allData.length === 0) {
      return next(new AppError('No categories found', 404));
    }
  
    return res.status(200).json({
      status: 'success',
      data: allData,
    });
  });
  
  // Get Single Category
  exports.getSingleCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const singleData = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
  
    if (!singleData) {
      return next(new AppError('Category not found', 404));
    }
  
    return res.status(200).json({
      status: 'success',
      data: singleData,
    });
  });
  
  // Update Category
  exports.updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    const updatedData = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });
  
    if (!updatedData) {
      return next(new AppError('Category update failed', 500));
    }
  
    return res.status(200).json({
      status: 'success',
      data: updatedData,
    });
  });
  
  // Delete Category
  exports.deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const deletedData = await prisma.category.delete({
      where: { id: parseInt(id) },
    });
  
    if (!deletedData) {
      return next(new AppError('Category deletion failed', 500));
    }
  
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });