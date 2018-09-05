# Configuración de ambiente 
## Pasos iniciales de instalacion
1. Instalar Node.js
1. npm install -g webpack-cli (Instalar webpack-cli globalmente)
1. npm install -g firebase-tools
### Inicializar firebase
* firebase login 

*Luego ingresar a la carpeta donde se encuentra el proyecto **/path/to/firebase-web-client/** y ejecutar el siguiente comando:*
* firebase init

*Luego seleccionar entre las opciones, la opcion de firebase hosting*

*De esta manera ya se inicia el proyecto de hosting de firebase.*
### Subir aplicacion de desarrollo
*Para subir nuestro proyecto ejecutar el siguiente comando*

* npm run deploy

*Y visitar la ruta https://${projectId}.firebaseapp.com/ para ver el resultado.*

### Armar paquete de distribucion
* npm run build
