const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {prisma} = require('../DB/db.config')
// Create Product
exports.createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, stock, categoryId } = req.body;
  
    const newData = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
      },
    });
  
    if (!newData) {
      return next(new AppError('Product creation failed', 500));
    }
  
    return res.status(201).json({
      status: 'success',
      data: newData,
    });
  });
  
  // Get All Products
  exports.getAllProduct = catchAsync(async (req, res, next) => {
    const allData = await prisma.product.findMany()
  
    if (!allData || allData.length === 0) {
      return next(new AppError('No product found', 404));
    }
  
    return res.status(200).json({
      status: 'success',
      user:req.user.name,
      data: allData,
    });
  });
  
  // Get Single Product
  exports.getSingleProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const singleData = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
  
    if (!singleData) {
      return next(new AppError('Product not found', 404));
    }
  
    return res.status(200).json({
      status: 'success',
      data: singleData,
    });
  });
  
  // Update Product
  exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, stok, categoryId } = req.body;
  
    const updatedData = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name, 
        description, 
        price, 
        stok, 
        categoryId
      },
    });
  
    if (!updatedData) {
      return next(new AppError('Product update failed', 500));
    }
  
    return res.status(200).json({
      status: 'success',
      data: updatedData,
    });
  });
  
  // Delete Product
  exports.deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const deletedData = await prisma.product.delete({
      where: { id: parseInt(id) },
    });
  
    if (!deletedData) {
      return next(new AppError('Product deletion failed', 500));
    }
  
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });
  