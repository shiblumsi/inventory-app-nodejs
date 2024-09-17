const { prisma } = require("../DB/db.config");
const catchAsync = require("../utils/catchAsync");

exports.uploadFiles = catchAsync(async (req, res, next)=>{
    if (!req.files || req.files.length === 0) {
        return next(new AppError('Please upload at least one image', 400));
      }

    const files = req.files.map((file)=> file.path)
    const categoryId = req.params.categoryId

    const db_files = await prisma.categoryImage.createMany({
        data: files.map(path=>({
            url:path,
            categoryId:categoryId * 1
        }))
    })

    res.status(201).json({
        status:'success',
        count:db_files,
        file_path:files
    })
})