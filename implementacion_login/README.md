## DESAFIO - IMPLEMENTACION LOGIN

- [x]  Deberá contar con todas las vistas realizadas en el hands on lab, así también como las rutas de router para procesar el registro y el login.
- [x]  Una vez completado el login, realizar la redirección directamente a la vista de productos.
- [x]  Agregar a la vista de productos un mensaje de bienvenida con los datos del usuario
- [x]  Agregar un sistema de roles, de manera que si colocamos en el login como correo [adminCoder@coder.com](mailto:adminCoder@coder.com), y la contraseña adminCod3r123, el usuario de la sesión además tenga un campo
- [x]  Todos los usuarios que no sean admin deberán contar con un rol “usuario”.
- [x]  Implementar botón de “logout” para destruir la sesión y redirigir a la vista de login

### Comentarios
- El usuario principal que es admin está por default en el formulario de /login
- Solo /signup es una ruta accesible sin tener el /login hecho previamente
- Una vez hecho el login se genera un sesion en mongodb y una cookie de forma local, en cada renderización se evalua la existencia de ambos elementos y que corresponda al mismo usuario
- la ruta /realTimeProducst sólo está disponible para los usarios cuyo rol es 'admin', en caso de que no se pueda autenticar se envia a la home o al login segun el caso