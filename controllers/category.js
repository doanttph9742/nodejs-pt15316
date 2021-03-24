import Category from '../models/category';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
//thêm sản phẩm
export const create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({
                error: "thêm danh mục không thành công"
            })
        }
        console.log(fields)
        const { name } = fields;
        if (!name) {
            return res.status(400).json({
                error: "bạn cần nhập đầy đủ thông tin"
            })
        }
        let category = new Category(fields);
        category.save((err, data) => {
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
    Category.find((err,data)=>{
        if(err){
            error:"không tìm thấy sản phẩm"
        }
        res.json({data})
    })
}
//chi tiết sản phẩm
export const categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            res.status(400).json({
                error: "không tìm thấy sản phẩm"
            })
        }
        req.category = category;
        next();
    })
}
export const read = (req, res) => {
    return res.json(req.category);
}
//xóa sản phẩm
export const remove = (req, res)=>{
    let category = req.category;//lấy thông tin sp
    category.remove((err,deleteCategory) => {
        if(err){
            return res.status(400).json({
                error: "không xóa đc sản phẩm"
            })
        }
        deleteCategory.photo = undefined;
        res.json({
            category : deleteCategory,
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
        const { name} = fields;
        if (!name) {
            return res.status(400).json({
                error: "bạn cần nhập đầy đủ thông tin"
            })
        }
        // let category = new category(fields);
        let category =req.category;
        category=_.assignIn(category,fields);
        console.log(files);
        category.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "không sửa được danh mục"
                })
            }
            res.json(data)
        })
    })
}
