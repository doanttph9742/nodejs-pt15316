import Product from '../models/product';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
//thêm sản phẩm
export const create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "thêm sản phẩm không thành công"
            })
        }
        console.log(fields)
        const { name, description, price } = fields;
        if (!name || !description || !price) {
            return res.status(400).json({
                error: "bạn cần nhập đầy đủ thông tin"
            })
        }
        let product = new Product(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                console.log(files.photo.size)
                return res.status(400).json({
                    error: "bạn cần up ảnh nhỏ hơn 1mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.path;
        }
        console.log(files);
        product.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "không thêm được sản phẩm"
                })
            }
            res.json(data)
        })
    })
}
//list sản phẩm
export const list = (req, res) => {
    Product.find((err,data)=>{
        if(err){
            error:"không tìm thấy sản phẩm"
        }
        res.json({data})
    })
}
//chi tiết sản phẩm
export const productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            res.status(400).json({
                error: "không tìm thấy sản phẩm"
            })
        }
        req.product = product;
        next();
    })
}
export const read = (req, res) => {
    return res.json(req.product);
}
//xóa sản phẩm
export const remove = (req, res)=>{
    let product = req.product;//lấy thông tin sp
    product.remove((err,deleteProduct) => {
        if(err){
            return res.status(400).json({
                error: "không xóa đc sản phẩm"
            })
        }
        deleteProduct.photo = undefined;
        res.json({
            product : deleteProduct,
            message:"sản phẩm được chọn đã xóa"
        })
    })
}
export const update = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "sửa sản phẩm không thành công"
            })
        }
        console.log(fields)
        const { name, description, price } = fields;
        if (!name || !description || !price) {
            return res.status(400).json({
                error: "bạn cần nhập đầy đủ thông tin"
            })
        }
        // let product = new Product(fields);
        let product =req.product;
        product=_.assignIn(product,fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                console.log(files.photo.size)
                return res.status(400).json({
                    error: "bạn cần up ảnh nhỏ hơn 1mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.path;
        }
        console.log(files);
        product.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "không sửa được sản phẩm"
                })
            }
            res.json(data)
        })
    })
}
