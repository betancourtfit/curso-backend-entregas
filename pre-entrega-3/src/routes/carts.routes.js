import { Router } from "express"
import { cartController } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.get('/', cartController.getCarts);
cartRouter.get('/:id', cartController.getCart);
cartRouter.post('/', cartController.createCart);
cartRouter.post('/:cid/products/:pid', cartController.addOrUpdateProductInCart);
cartRouter.delete('/:id', cartController.cleanCart);
cartRouter.delete('/:cid/products/:pid', cartController.removeProductbyId);
cartRouter.put('/:cid', cartController.updateCartWithProducts);

export default cartRouter;