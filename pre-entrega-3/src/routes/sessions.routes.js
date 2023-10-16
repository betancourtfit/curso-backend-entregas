import { Router } from "express";
import passport from 'passport';
import { passportError, authorization } from "../utils/messagesError.js";
import { generateToken, authToken } from "../utils/jwt.js";
// importar sessionsController
import sessionController from '../controllers/session.controller.js'


const sessionRouter = Router()

// async function handleSuccessfulLogin(req, res, user) {
//     req.session.passport.user = {
//         _id: user._id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         age: user.age,
//         rol: user.rol,
//         welcome: true
//     };

//     const token = await generateToken(req.session.passport.user);

//     res.cookie('jwtCookie', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== 'development',
//         maxAge: 3600000
//     });

//     const userData = JSON.stringify(req.session.passport.user);
//     res.cookie('userData', userData, {
//         path: '/',
//         httpOnly: false,
//         secure: process.env.NODE_ENV !== 'development',
//         maxAge: 3600000
//     });

// }


sessionRouter.post('/login', passport.authenticate('login',{failureRedirect: 'faillogin'}), sessionController.login)
sessionRouter.get('/faillogin', sessionController.faillogin)
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.github);
// Este es el callback de GitHub una vez que el usuario acepta o rechaza la autorización
sessionRouter.get('/githubCallback', passport.authenticate('github', { failureRedirect: '/faillogin' }),
    sessionController.githubCallback)
sessionRouter.get('/logout', sessionController.logout)
//Verifica que el token enviado sea valido (misma contraseña de encriptacion)
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user)})
sessionRouter.get('/current', passportError('jwt'), authorization(['admin','user']), (req, res) => {
    res.send(req.user)})
sessionRouter.post('/update-welcome', sessionController.updateWelcome)


export default sessionRouter
