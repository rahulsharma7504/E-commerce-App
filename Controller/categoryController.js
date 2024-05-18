const Category = require('../Model/Category');
const slugify = require('slugify');


const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const findexistCategory = await Category.findOne({ name: name });
        if (findexistCategory) {
            return res.status(400).json({ error: "Category Already Exist" });
        }

        const category = await new Category({
            name: name, // Assuming you're using a predefined category name for now
            slug: slugify(String(name)) // Use slugify to generate the slug from the category name
        }).save();
        console.log(category);
        return res.status(200).json({ message: "Category Created", Category: category });
    } catch (error) {
        if (error) throw error;
        return res.status(500).json({ error: "Internal Server Error" });

    }
}
const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        console.log(id)
        const updateCat = await Category.findByIdAndUpdate({ _id: id }, { $set: { name: name, slug: slugify(name) } }, { new: true });
        console.log(updateCat);
        return res.status(200).json({ message: "Category Updated", Category: updateCat });

    } catch (error) {
        if (error) throw error;
        return res.status(500).json({ error: "Internal Server Error" });

    }
}

const AllCategory = async (req, res) => {
    try {  
        const allCategory = await Category.find();
        console.log(allCategory);
        res.status(200).json({ message: "All Category", Category: allCategory });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
}; 

const OneCategory=async(req,res)=>{
    try {
          const {id}=req.params;
          const oneCategory=await Category.findById({_id:id});
          res.status(200).json({ message: "One Category", Category: oneCategory });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
}
 
const DeleteCategory=async(req,res)=>{
    try {
        
        const {id}=req.params;
        const deleteCategory=await Category.findByIdAndDelete({_id:id});
        console.log(deleteCategory);
        res.status(200).json({ message: "Category Deleted", Category: deleteCategory });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
}
 

module.exports = {
    createCategory,
    updateCategory,
    AllCategory,
    DeleteCategory,
    OneCategory
}