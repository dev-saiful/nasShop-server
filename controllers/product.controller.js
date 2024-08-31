import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import productModel from "../models/product.model.js";


// get all products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT; // TODO: In Production it will be changed
  const page = Number(req.query?.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await productModel.countDocuments({ ...keyword });
  const products = await productModel
    .find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (products === undefined || products.length == 0) {
    throw new ApiError(404, "No Products Found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products, page, pages: Math.ceil(count / pageSize) },
        "Products found"
      )
    );
});

// get product bY ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "No Product Found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product found"));
});

// get Top products
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(new ApiResponse(200, products, "Top Products"));
});

// creating product
const createProduct = asyncHandler(async (req, res) => {
  const product = new productModel({
    name: "sample product",
    price: 12,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Addidas Sample",
    category: "Sample category",
    countInStock: 3,
    numReviews: 0,
    description: "Sample descrition",
  });

  const createdProduct = await product.save();
  res
    .status(201)
    .json(new ApiResponse(201, createdProduct, "Product created successfully"));
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await productModel.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res
      .status(200)
      .json(new ApiResponse(200, updatedProduct, "Product updated"));
    // uploading image to cloudinary
    
  } else {
    throw new ApiError(404, "Resource not found");
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (product) {
    await productModel.deleteOne({ _id: product.id });
    res.status(200).json(new ApiResponse(200, null, "Product deleted"));
  } else {
    throw new ApiError(404, "Product not found");
  }
});

// creating product review
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await productModel.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res
        .status(400)
        .json(new ApiResponse(400, null, "Product already reviewed"));
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    // calculating review
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(200).json(new ApiResponse(200, null, "Review added"));
  } else {
    throw new ApiError(404, "Resource not found");
  }
});

export {
  getProducts,
  getProductById,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
