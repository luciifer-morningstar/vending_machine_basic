const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/products.controller')
const AuthController = require('../controllers/auth.controller')

const validation = require('../middleware/validation-middleware');

router.post('/user/register',validation.register, AuthController.register)
router.post('/user/login',validation.loginUser,AuthController.loginAsUser)
router.patch('/user/update',validation.updateProfile, validation.checkAuth,AuthController.updateProfile)
router.get('/user',validation.checkAuth,AuthController.auth_user)

router.get('/product',validation.checkAuth,ProductController.index)
router.get('/product/:id',validation.checkAuth,ProductController.getOne)
router.post('/product',validation.checkAuthForVendor,ProductController.store)
router.patch('/product/:id',validation.checkAuthForVendor,ProductController.update)
router.delete('/product/:id',validation.checkAuthForVendor,ProductController.remove)

router.post('/user/add_money',validation.checkAuthForUser, AuthController.addMoney);
router.post('/user/purchase',validation.checkAuthForUser, ProductController.purchase);

module.exports = router
