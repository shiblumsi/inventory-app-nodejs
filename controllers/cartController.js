const express = require("express")
const {prisma} = require("../DB/db.config")
const catchAsync = require('../utils/catchAsync')
const AppError = require("../utils/appError")




//Add to Cart
exports.addToCart = catchAsync(async (req, res, next)=>{
    const {productId, quantity} = req.body
    const userId = req.user.id

    //check product exixt
    const product = await prisma.product.findUnique({where:{id:productId}})
    if(!product){
        return next(new AppError('Product not found', 404))
    }

    // Check if the cart exists or create it
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
    }

    // check product is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId
        }
      });

    if(existingCartItem){
        const updateCartItem = await prisma.cartItem.update({
            where:{id: existingCartItem.id},
            data:{quantity:existingCartItem.quantity + 1}
        })
        return res.status(200).json({
            status:'success',
            data:updateCartItem
        })
    }else{
        const newCartItem = await prisma.cartItem.create({
            data:{
                cartId:cart.id,
                productId,
                quantity
            }
        })
        return res.status(201).json({
            status:'success',
            data:newCartItem
        })
    }
})

exports.getCart = catchAsync( async (req, res, next)=>{
    const userId = req.user.id
    const cart = await prisma.cart.findUnique({
        where:{userId},
        include:{cartItems:{include:{product:true}}}
    })
    if(!cart || cart.cartItems.length === 0){
        return next(new AppError("Your cart is empty", 404))
    }
    return res.status(200).json({
        status:'success',
        data:cart.cartItems
    })
})

// update cartitem
exports.updateCartItem = catchAsync(async (req, res, next) => {
    const { cartItemId, quantity } = req.body;
  
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  
    if (!updatedCartItem) {
      return next(new AppError("Cart item not found", 404));
    }
  
    return res.status(200).json({
      status: "success",
      data: updatedCartItem,
    });
  });


exports.increaseQuantity = catchAsync(async (req, res, next) => {
    const { cartItemId } = req.body;
  
    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    
    if (!cartItem) {
      return next(new AppError("Cart item not found", 404));
    }
  
    // Update the quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: cartItem.quantity + 1 },  // Increment the quantity
    });
  
    return res.status(200).json({
      status: "success",
      data: updatedCartItem,
    });
  });


exports.decreaseQuantity = catchAsync(async (req, res, next) => {
    const { cartItemId } = req.body;

    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    
    if (!cartItem) {
      return next(new AppError("Cart item not found", 404));
    }
  
    // Ensure the quantity does not go below 1
    if (cartItem.quantity <= 1) {
      return next(new AppError("Quantity cannot be less than 1", 400));
    }
  
    // Update the quantity by decrementing it
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: cartItem.quantity - 1 },  // Decrement the quantity
    });
  
    return res.status(200).json({
      status: "success",
      data: updatedCartItem,
    });
  });


  // Remove from Cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
    const { cartItemId } = req.body;
  
    const deletedCartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  
    if (!deletedCartItem) {
      return next(new AppError("Cart item not found", 404));
    }
  
    return res.status(204).json({
      status: "success",
      data: null,
    });
  });


  // Clear Cart
exports.clearCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
  
    const cart = await prisma.cart.findUnique({ where: { userId } });
  
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }
  
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  
    return res.status(204).json({
      status: "success",
      data: null,
    });
  });
  
  