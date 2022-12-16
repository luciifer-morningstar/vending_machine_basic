const Products = require('../models/products')
const validator = require('../helpers/validate');
const { ObjectId } = require('bson');
const users = require('../models/users');

const ProductController = {
    async index (req, res) {
        try{
            const data = await Products.find();
            return res.status(200).send({ 
                message:"Data retrieved successfully",
                data:data
            });
        }catch(err){
            return res.send('Error ' + err)
        }
    },

    async getOne(req, res) {
        try{
            const { id } = req.params;
            const data = await Products.findById(id);
            return res.status(200).send({ 
                message:"Data retrieved successfully",
                data:data['_doc']
            });
        }catch(err){
            return res.send('Error ' + err)
        }
    },

    async store (req, res) {
        const validationRule = {
            "title": "required|string",
            "description": "required|string",
            "price": "required|integer",
            "image": "required|string",
            "quantity": "required|integer|min_quantity",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });
        const { title, description, price, image, quantity } = req.body;
        let newObject = {};
        newObject = {
            title: title,
            description: description,
            price: price,
            quantity: quantity,
            image: image
        }
        const data = await new Products(newObject).save();
        try{
            return res.status(200).send({ 
                message:"Product stored successfully",
                data:data
            });
        }catch(err){
        	console.log("Error",err)
            return res.send('Error')
        }
    },

    async update(req, res){

        const validationRule = {
            "title": "required|string",
            "description": "required|string",
            "price": "required|integer",
            "image": "required|string",
            "quantity": "required|integer|min_quantity",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try{
            let { id } = req.params;
            const { title, description, price, image, quantity } = req.body;
            let newObject = {};
            newObject = {
                title: title,
                description: description,
                price: price,
                quantity: quantity,
                image: image
            }
            const data = await Products.updateOne({_id:ObjectId(id)},{$set:newObject});
            return res.status(200).send({ 
                message:"Product stored successfully",
                data:{_id:id, ...newObject}
            });
        }catch(err){
            return res.send('Error')
        }
    },

    async purchase(req, res){
        const validationRule = {
            "product_id": "required|string",
            "quantity":"required|integer|min_quantity"
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try{
            const { product_id, quantity } = req.body;
            let productInfo = await Products.findOne({_id:ObjectId(product_id), quantity:{$gte:quantity}});
            if(!productInfo){
                return res.status(401).send({
                    message: "Errors",
                    "data": {
                        "errors": {
                            "product": [
                                "Product not available."
                            ]
                        }
                    },
                });
            }
            let productDetail = productInfo && productInfo['_doc'] ? productInfo['_doc'] : {};
            let totalAmount = productDetail && productDetail['quantity'] && productDetail['price'] ? productDetail['price'] * quantity : 0;
            console.log("totalAmount", totalAmount);
            console.log("req.authInfo['amount']", req.authInfo['amount'])
            if(totalAmount && totalAmount <= req.authInfo['amount']){
                let restAmount = req.authInfo['amount'] - totalAmount;
                await Products.updateOne({_id:ObjectId(product_id)},{$inc:{quantity:-quantity}});
                await users.updateOne({_id:ObjectId(req.authInfo['_id'])},{$set:{amount:restAmount}});
                return res.status(200).send({ 
                    message:"Product purchased successfully",
                    data:{purchasedProduct:productDetail, restAmount:restAmount, totalPurchased:totalAmount}
                });
            }else{
                return res.status(401).send({
                    message: "Errors",
                    "data": {
                        "errors": {
                            "amount": [
                                "Insufficient amount."
                            ]
                        }
                    },
                });
            }
        }catch(err){
            return res.send('Error')
        }
    },

    async remove(req, res){
        try{
            await Products.deleteOne({_id:ObjectId(req.params.id)})
            return res.status(200).send({ 
                message:"Product removed successfully",
                data:req.params.id
            });
        }catch(err){
        	console.log("err",err)
            return res.send('Error')
        }
    }
};

module.exports = ProductController;
