const env = require("./env");
const isDevServer = window.location.hostname && window.location.hostname.indexOf("firebase") > -1;

function RestClient() {
    const client = this;
    var xhr = new XMLHttpRequest();

    /**
     * Metodo que se encarga de realizar el envio de token
     */
    client.sendStuff = function(token, resolve){
        var cookies = document.cookie.split("; ");
        var res = cookies.find((el) => el.indexOf('accounts')>-1);
        if((res && res.split("=")[0]=="accounts") || isDevServer){
            xhr.send(token);
        }else if(resolve){
            resolve({message:"No es posible invocar el servicio sin la cookie accounts"});
        }        
    }

    client.sendRquest =  function(token, resolve, reject){
        //xhr.withCredentials = false;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(xhr.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.responseText)
                }
            }
        });
        if(isDevServer) {
            console.info("Entorno de desarrollo")
            console.info("Token:")
            console.info(token);
            xhr.open("POST", env.urlDev);
        } else {
            xhr.open("POST", env.url);
        }
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        client.sendStuff(token, resolve);
    }
}

module.exports = new RestClient();