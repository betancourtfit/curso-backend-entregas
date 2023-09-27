import { Router } from "express";
import passport from 'passport';
import { serialize } from 'cookie';
import GithubStrategy from 'passport-github2';

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login',{failureRedirect: 'faillogin'}), async (req, res) => {
    try {
        if(!req.user){
            res.status(401).send({ resultado: 'Usuario invalido' });
        }

        req.session.passport.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        }

        // Crear la cookie 'userData'
        const userData = JSON.stringify(req.session.passport.user);
        console.log('userData:', userData)
        res.cookie('userData', userData, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 3600000
        });

        res.status(200).send({payload: req.session.passport})
    } catch (error) {
        console.error('Hubo un error al iniciar sesión:', error);
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
});

sessionRouter.get('/faillogin', (req, res) => {
    console.log('Error al iniciar sesión');
    res.send({error: 'Failed login'})
});

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { 
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});

// Este es el callback de GitHub una vez que el usuario acepta o rechaza la autorización
sessionRouter.get('/githubCallback', 
  passport.authenticate('github', { failureRedirect: '/faillogin' }),
  (req, res) => {
    try {
        req.session.passport.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        };

        const userData = JSON.stringify(req.session.passport.user);
        res.cookie('userData', userData, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 3600000
        });

        res.status(200).redirect('/home');
    } catch (error) {
        console.error('Hubo un error al iniciar sesión con GitHub:', error);
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
  }
);

sessionRouter.get('/logout', (req, res) => {
    console.log("Sesión antes del logout:", req.session);
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            res.status(500).send({ resultado: 'Error interno al desloguear' });
        } else {
            res.clearCookie('userData', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600000}) ; 
            res.status(200).send({ resultado: 'Usuario deslogueado' });
        }
    });
    console.log("Sesión antes del logout:", req.session);
    req.logout(() => {
        console.log('Logged out');
    });// Método de Passport para cerrar sesión
});

export default sessionRouter
