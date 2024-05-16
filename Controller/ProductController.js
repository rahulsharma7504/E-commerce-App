const dotenv=require('dotenv').config();
const cloudinary=require('cloudinary').v2;
const slugify=require('slugify');
const ProductModel = require('../Model/ProductModel');


const CreateProduct=async(req,res)=>{
    const { name, price, description,categoryId, quantity ,shipping} = req.body;
    const image = req.file.path;
    const slug = slugify(String(name));
    
    cloudinary.config({
        cloud_name: 'de5v2dpqx',
        api_key: '248122715433517',
        api_secret: 'ZmtP6_fCj_5onSBJf4D1tm3GbB4',
        secure: true,
    });
    
    try {
        const findexistProduct = await ProductModel.findOne({ name: name });
        if (findexistProduct) {
            return res.status(400).json({ error: "Product Already Exist" });
        }
        
        const uploadedImage = await cloudinary.uploader.upload(image);
    
        const product = new ProductModel({
            name: slug,
            price: price, 
            description: description,
            category: categoryId,
            quantity: quantity,
            image: uploadedImage.secure_url, // Accessing the secure URL of the uploaded image
            shipping: true
        });
    
        await product.save();
        
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
}

const CreateProductget=(req,res)=>{ 
    res.sendFile(__dirname +'/index.html');

}
 

const AllProduct=async(req,res)=>{
    try {
        const allProduct = await ProductModel.find().limit(3)
        console.log(allProduct);
        res.status(200).json({ message: "All Product", Product: allProduct,totel:allProduct.length });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
}
}
const SingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await ProductModel.findOne({_id:id})

        // If no product is found, return a 404 Not Found response
        if (!singleProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Product found, send it in the response
        res.status(200).json({ message: "Success", product: singleProduct });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, quantity, shipping } = req.body;
        let image;

        // Check if req.file exists and set the image path accordingly
        if (req.file) {
            image = req.file.path;
            const uploadedImage = await cloudinary.uploader.upload(image);
            image = uploadedImage.secure_url;
        } else {
            // If no new image is uploaded, use the existing image URL
            image = req.body.image;
        }

        const slug = slugify(String(name)); 

        const updateProduct = await ProductModel.findOneAndUpdate(
            { _id: id }, // Filter criteria
            { $set: { name: slug, price: price, description: description, category: category, quantity: quantity, image: image, shipping: shipping } }, // Update document
            { new: true } // To return the updated document
        );

        // Product found, send it in the response
        res.status(200).json({ message: "Update Product Success", product: updateProduct });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await ProductModel.findByIdAndDelete({_id:id})
        // If no product is found, return a 404 Not Found response
       

        // Product found, send it in the response
        res.status(200).json({ message: "Delete Product Success", product: singleProduct });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


const filterProduct = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        const filterConditions = {};

        if (checked.length > 0) {
            filterConditions.category = { $in: checked };
        }

        if (radio.length > 0) {
            const [minPrice, maxPrice] = radio[0].split(',');
            filterConditions.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        }

        const filteredProducts = await ProductModel.find(filterConditions);
        res.json(filteredProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const Pagination = async (req, res) => {
    try {
        let page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = 3; // Number of products per page
        const skip = (page - 1) * pageSize;
    
        const products = await ProductModel.find()
          .skip(skip)
          .limit(pageSize);
    
        res.status(200).json({ data: products, message: "Data has been fetched successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in fetching the data." })
    }
}


const Search = async (req, res) => {
    try {
        const {search}=req.params;
        const searchProduct = await ProductModel.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        })
        res.status(200).json({ data: searchProduct, message: "Data has been fetched successfully" });
      
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in fetching the data." })
    }
}

const SimilarProduct = async (req, res) => {
    try {
      const { pid, cid } = req.params;
      const product = await ProductModel.findById(pid);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Find similar products based on the category ID
      const similarProducts = await ProductModel.find({
        _id: { $ne: pid }, // Exclude the current product
        category: cid, // Filter by category
      });
  
      res.status(200).json({ similarProducts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error in fetching the data." });
    }
  };

module.exports={
    CreateProduct,
    CreateProductget,
    AllProduct,
    SingleProduct,
    DeleteProduct,
    UpdateProduct,
    filterProduct,
    Pagination,
    Search,
    SimilarProduct
}