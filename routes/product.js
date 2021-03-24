import express from 'express';
import { list, create, productById, read, remove ,update} from '../controllers/product'
const router = express.Router();

router.get('/product', list);

router.post('/product', create);

router.put('/product/:productId',update)

router.get('/product/:productId', read);

router.delete('/product/:productId', remove);

router.param('productId', productById);
module.exports = router;