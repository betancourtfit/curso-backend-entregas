import {Router } from "express"
import passport from 'passport';
// Importar todas las funciones de userCotroller 
import { userController } from "../controllers/user.controller.js";

// import { getUsers, getUser, deleteUser, createUser, updateUser } from "../controllers/user.controller.js";  // importamos los controladores de usuarios

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUser);
userRouter.post('/', userController.createUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
userRouter.post('/signup', passport.authenticate('signup',{failureRedirect:'/failregister'}), userController.userSignup);
userRouter.get('/failregister', userController.failRegister);
userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), userController.github);
userRouter.get('/githubCallback', passport.authenticate('github', {scope: ['user:email']}), userController.githubCallback);

export default userRouter
