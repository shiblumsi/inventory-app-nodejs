const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {prisma} = require('../DB/db.config')
const util = require('util')
const fs = require('fs')
const unlinkFile = util.promisify(fs.unlink);



// Create Product
exports.createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, stock, categoryId} = req.body;
  
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price:price * 1,
        stock: stock * 1,
        categoryId: categoryId * 1
      }
    });
  
    if (!newProduct) {
      return next(new AppError('Product creation failed', 500));
    }

    if(req.files && req.files.length > 0){
      const filePaths = req.files.map(file=>(file.path))
      const files = await prisma.productImage.createMany({
        data: filePaths.map(path=>({
          url:path,
          productId: newProduct.id
        }))
      })

      return res.status(201).json({
        status: 'success',
        data: newProduct,
        files
      });
    }
    

    return res.status(201).json({
      status: 'success',
      message:'Product created with out any files or images.',
      data: newProduct,
    });
  });
  
  // Get All Products
exports.getAllProduct = catchAsync(async (req, res, next) => {
    const allData = await prisma.product.findMany({include:{images:true}})
  
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
      include:{images:true}
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
  


//upload product files (images, pdf)
exports.uploadFiles = catchAsync(async (req, res, next) => {
  // console.log('Uploaded files:', req.files);
    
    if (!req.files || req.files.length === 0) {
      return next(new AppError('Please upload at least one image', 400));
    }


    const filePaths = req.files.map((file) => file.path);
    const productId = req.params.productId;

    const files = await prisma.productImage.createMany({
      data: filePaths.map((path) => ({
        url: path,
        productId: parseInt(productId),
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

  const file = await prisma.productImage.findUnique({
    where: { id: parseInt(fileId) },
  });

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Delete image from file system
  await unlinkFile(file.url);

  // Delete image from the database
  await prisma.productImage.delete({
    where: { id: parseInt(fileId) },
  });

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Retrieve files by product
exports.getIFilesByProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const files = await prisma.productImage.findMany({
    where: { productId: parseInt(productId) },
  });

  if (!files || files.length === 0) {
    return next(new AppError('No files found for this product', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: files,
  });
});
