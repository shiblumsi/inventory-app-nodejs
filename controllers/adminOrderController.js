const { prisma } = require("../DB/db.config");
const catchAsync = require("../utils/catchAsync");

exports.getAllOrders = catchAsync( async (req, res, next)=>{
    const {status, startDate, endDate, page=1, limit=10} = req.query
    console.log(req.query);
    

    const filter = {
        ...(status && {status}),
        ...(startDate && endDate && {
            createdAt:{
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        })
    }
    const orders = await prisma.order.findMany({
        where:filter,
        skip:(page - 1) * limit,
        take:parseInt(limit),
        include:{
            user:true,
            orderItems:true,
            payment:true
        }
    })
    res.status(200).json({
        status:'success',
        record_found:orders.length,
        data:orders
    })
})


exports.updateOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status
      },
    });
  
    res.status(200).json({ 
        status: 'success', 
        data: updatedOrder 
    });
  });
  

exports.getSalesReports = catchAsync(async (req, res, next)=>{
    const { startDate, endDate } = req.query
    const salesData = await prisma.order.aggregate({
        _sum:{totalAmount:true},
        _count:{id:true},
        where:{
            createdAt:{
                gte:new Date(startDate),
                lte:new Date(endDate)
            },
            status:'delevered'
        }
        
    })
    res.status(200).json({
        status:'success',
        totalRevenue:salesData._sum.totalAmount,
        totalOrders:salesData._count.id
    })
})


exports.getCustomerOrders = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
  
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) }
    });
  
    res.status(200).json({ success: true, data: orders });
  });
  