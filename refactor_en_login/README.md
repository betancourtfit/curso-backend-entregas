## DESAFIO - REFACTOR EN EL LOGIN

- [x]  Se deberá contar con un hasheo de
contraseña utilizando bcrypt
- [x]  Se deberá contar con una implementación
de passport, tanto para register como para
login.
- [x]  Implementar el método de autenticación
de GitHub a la vista de login.

### Comentarios
- Se puede iniciar sesion desde /login con localStrategy con los datos por default o con github si el usuario no existe lo crea y luego inicia la sesion automaticamente, si ya existe solo inicia la sesion
- Toda la logica posee vistas, por lo cual el debug se puede hacer enteramente desde el front