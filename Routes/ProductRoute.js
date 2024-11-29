const express=require('express');
const bodyParser=require('body-parser');
const productRoute = express();
const multer = require('multer');
const path = require('path');



productRoute.use(express.urlencoded({extended:true}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  const upload = multer({ storage: storage });

const productController = require('../Controller/ProductController');

productRoute.get('/create',productController.CreateProductget);
productRoute.post('/create',upload.single('image'),productController.CreateProduct);

productRoute.get('/all',productController.AllProduct);
productRoute.get('/all-manage',productController.AllManage);

productRoute.get('/single/:id',productController.SingleProduct);
// get product by category Id

productRoute.get('/category/:id',productController.CategoryProducts);
productRoute.post('/create-order',productController.OrderDetails);
productRoute.post('/payment-verify',productController.PaymentVerify);

productRoute.put('/update/:id',upload.single('image'),productController.UpdateProduct);

productRoute.delete('/delete/:id',productController.DeleteProduct);
productRoute.post('/filter',productController.filterProduct);
productRoute.get('/pagination',productController.Pagination);
productRoute.get('/search/:search',productController.Search);
productRoute.get('/similar/:pid/:cid',productController.SimilarProduct);

 
module.exports=productRoute; 