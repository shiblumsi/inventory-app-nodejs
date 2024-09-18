const { prisma } = require("../DB/db.config")
const AppError = require("../utils/appError")
const catchAsync = require('../utils/catchAsync')
const util = require('util')
const fs = require('fs')
const unlinkFile = util.promisify(fs.unlink);


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

    if(req.files && req.files.length > 0){
      const filePaths = req.files.map(file=>(file.path))
      const files = await prisma.categoryImage.createMany({
        data: filePaths.map(path=>({
          url:path,
          categoryId: newData.id
        }))
      })

      return res.status(201).json({
        status: 'success',
        data: newData,
        files
      });
    }
    

    return res.status(201).json({
      status: 'success',
      message:'Category created with out any files or images.',
      data: newData,
    });
  });
  
  // Get All Categories
  exports.getAllCategory = catchAsync(async (req, res, next) => {
    const allData = await prisma.category.findMany({include:{images:true}});
  
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
      include:{images:true}
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




  
//upload category files (images, pdf)
exports.uploadFiles = catchAsync(async (req, res, next) => {
  // console.log('Uploaded files:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }


    const filePaths = req.files.map((file) => file.path);
    const categoryId = req.params.categoryId;

    const files = await prisma.categoryImage.createMany({
      data: filePaths.map((path) => ({
        url: path,
        categoryId: parseInt(categoryId),
      })),
    });

    return res.status(201).json({
      status: 'success',
      files,
      file_path:filePaths
    });
  })


  
// Delete file
exports.deleteFiles = catchAsync(async (req, res, next) => {
  const { fileId } = req.params;

  const file = await prisma.categoryImage.findUnique({
    where: { id: parseInt(fileId) },
  });

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Delete image from file system
  await unlinkFile(file.url);

  // Delete image from the database
  await prisma.categoryImage.delete({
    where: { id: parseInt(fileId) },
  });

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Retrieve files by category
exports.getIFilesByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const files = await prisma.categoryImage.findMany({
    where: { categoryId: parseInt(categoryId) },
  });

  if (!files || files.length === 0) {
    return next(new AppError('No files found for this category', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: files,
  });
});
