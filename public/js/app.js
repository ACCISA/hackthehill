document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app()
    console.log(app)
    testLog()
})

const testLog = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("logged in as " + user.displayName)
        } else {
            console.log("user is not logged in")
            // No user is signed in.
        }
    });
}

const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user
            console.log(user)

            if (user) {
                isUserNew(user.email)

            } else {
                window.location.href = "login.html"
            }

        })
        .catch(console.log)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}

const isUserNew = email => {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json')
    headers.append('GET', 'POST')
    headers.append("Access-Control-Allow-Origin", "*")

    fetch("http://127.0.0.1:5000/login", {
        mode: 'cors', method: 'POST', headers: headers, body: JSON.stringify({
            email: email
        })
    })
        .then((response) => {
            console.log(response)
            if (response.ok) {
                console.log("suc")
                return response.json()
            } else {
                console.log("non suc")
            }

        })
        .then((data) => {
            console.log(data)
            console.log(data.status)
            if (data.status == "true"){
                window.location.href = "working.html"
                return 
            }
            window.location.href = "settings.html"
        })
}


