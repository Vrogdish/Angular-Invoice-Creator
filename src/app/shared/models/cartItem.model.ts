import { Product } from "../../features/products/models/product.model";

export interface CartItem {
    product : Product;
    quantity : number;
}