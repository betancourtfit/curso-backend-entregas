import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { createCart, createCartLogic } from "../../controllers/cart.controller.js";


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.plugin(mongoosePaginate)

// Crear un carrito vacio cada vez que se crea un usuario
// usando pre.save y cart controller
userSchema.pre('save', async function(next) {
    try{
        console.log('pre save')
        const newCart = await createCartLogic();
        console.log('newCart', newCart)
        this.cart = newCart._id;
    } catch(error) {
        return next(error);
    }
})

//Parametro 1:Nombre coleccion - Parametro 2: Schema 
export const userModel = model('users', userSchema)