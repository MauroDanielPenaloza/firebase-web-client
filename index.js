const firebase =  require( 'firebase/app');
require('firebase/messaging');
const resClient = require('./restclient');
const env = require("./env");
const isDevServer = window.location.hostname && window.location.hostname.indexOf("firebase") > -1;
const isHttps = window.location.protocol && (window.location.protocol.indexOf('https')>-1);

firebase.initializeApp(env.config);
const messaging = firebase.messaging();
messaging.usePublicVapidKey(env.vapidKey);

function ClientPdc() {
    const client = this;
    var registerSw = undefined;
    /**
     * Metodo privado que se ejecuta cuando se refresca el token
     */
    messaging.onTokenRefresh(function(){
        client.sendToken();
    });
    
    /**
     * Metodo publico que retorna una promise, la cual si se pudo eregistrar el token en el servidor responde por resolve en caso de error por reject
     */
    client.sendToken = function(){
      const promise =  new Promise(function (resolve, reject){
            messaging.getToken().then(function(token) {
                if(token) {
                    resClient.sendRquest(token, resolve, reject);    
                } else {
                    console.warn("Es necesario tener permisos para utilizar firebase");
                }
            })
            .catch(function(err) {
                console.error('Problemas con Firebase :´(');
                reject(err);
            })
        });
        return promise;
    }
   client.onMessage = function(){
        var pathToSW = '';
        if(isDevServer) {
            pathToSW = './'
        } else {
            pathToSW = env.pathToSwProd
        }
        navigator.serviceWorker.register(pathToSW + 'firebase-messaging-sw.js')
        .then(function(registration) {
            console.debug('Se registro con exito el Service Worker');
            registerSw = registration;
            messaging.useServiceWorker(registration)
            client.sendToken().then(function(res){
                console.debug(res);
            })
            .catch(function(err){
                console.error(err);
            });
        })
        messaging.onMessage(function(payload){
            registerSw.showNotification(payload.notification.title,
            {
                'body':payload.notification.body,
                'icon':payload.notification.icon
            })
        });
   }
    

    client.requestPermission = function(){
        _canRequestPermission().then((res) => {
            if(res){
                messaging.requestPermission().then( () => {
                    initializeClient();
                }).catch(function(err) {
                    console.debug('No se logro recuperar los persmisos', err);
                });
            } else {
                console.debug("Ya se inicializo el cliente");
            }
        }).catch((error)=> console.error(error));
        
    }
    
    function initializeClient(){
        if(isHttps){
            _canGetToken().then((resp)=>{
                if(resp){
                    client.onMessage();
                } else {
                    console.debug("Se detecta que aun no es momento de solicitar permisos para notificaciones");
                }
            }).catch((msg)=>console.error(msg));
            
        } else {
            console.warn('El cliente de firebase solo puede funcionar sobre un sitio con ptrocolo https');
            if(env.devTest){
                console.debug('Solo se probará el funcionamiento del cliente web')
                new Promise(function(resolve, reject){
                    resClient.sendRquest("Token Test", resolve, reject);
                })
                .then((res)=>{console.debug('Respuesta del servidor');console.debug(res)})
                .catch((error)=> console.error(error));
            }            
        }
        
    }
    function _canGetToken() {
        return new Promise(function(resolve, reject){
            if (!("Notification" in window)) {
                if(navigator.permissions) {
                    navigator.permissions
                    .query({name:'notifications'})
                    .then((result)=> {
                        if (result.state == 'granted') {
                            resolve(true);
                        } else if (result.state == 'prompt') {
                            resolve(false);
                        } else if (result.state == 'denied') {
                            reject(true)
                        }
                    });
                } else {
                    reject("Este navegador web no soporta notificaciones");
                }
              }else if (Notification.permission === "granted") {
                resolve(true);
              }else if (Notification.permission === "default") {
                resolve(false);
              } else if (Notification.permission !== 'denied') {
                resolve(true);
              }
        });
    }
    function _canRequestPermission() {
        return new Promise(function(resolve, reject){
            if (!("Notification" in window)) {
                if(navigator.permissions) {
                    navigator.permissions
                    .query({name:'notifications'})
                    .then((result)=> {
                        if (result.state == 'granted') {
                            resolve(false);
                        }else {
                            resolve(true);
                        }
                    });
                } else {
                    reject("Este navegador web no soporta notificaciones");
                }
              }else if (Notification.permission === "granted") {
                resolve(false);
              }else {
                  resolve(true);
              }
        });
    }
    initializeClient();
}
export var client = new ClientPdc();