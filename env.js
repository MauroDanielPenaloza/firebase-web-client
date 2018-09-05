module.exports = {
    urlDev:"https://9926b2e2-b28b-4f89-a9a9-48e7bb3a43a0.mock.pstmn.io/notification/add/client",
    url:"/notification/add/client",
    devTest: true,
    pathToSwProd: "/path/to/service/worker/",
    config: {
        apiKey: "${apiKey}",
        authDomain: "${authDomain}",
        databaseURL: "${databaseURL}",
        projectId: "${projectId}",
        storageBucket: "${storageBucket}",
        messagingSenderId: "${messagingSenderId}"
    },
    vapidKey:'${vapidKey}'
}