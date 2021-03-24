import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import mongoose from 'mongoose';
//
dotenv.config();
const app = express();
//middleware
app.use(bodyParser.json());
//connection
mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:false,
        useCreateIndex:true
}).then(() =>{
        console.log('database connected')
});
mongoose.connection.on('Error',err =>{
        console.log(`Data connect failed ,${err.message}`)
})
//routes
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
        console.log('server is running on port', port)
});