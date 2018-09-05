/**
 * Ejemplo de como usar el metodo que solicita permisos a traves de la libreria
 */
document.getElementById("reqBtn")
    .addEventListener("click", ()=>{
        const client = FClient.client;
        client.requestPermission();
    })
/**
 * Ejemplo de como usar el metodo publico para enviar un token a backend y asociarlo con un cliente
 */
document.getElementById("sendBtn")
    .addEventListener("click", ()=>{
        const client = FClient.client;
        client.sendToken()
            .then((res)=>{
                console.log(res);
                window.alert("Respuesta del servidor mock: "+ res.message);
                window.alert("Recuerde que para probar las notificaciones debe ingresar"+
                " el token que se muestra por consola (Abra la consola con f12), luego registrar el token a traves del servicio de la api de notificaciones, para poder invocar al servicio que envia un mensaje y recibir la notificacion en este cliente.")
            })
            .catch((error)=>{
                console.error(error);
            });
    })