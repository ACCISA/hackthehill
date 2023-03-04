document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app()
    console.log(app)
    testLog()
})

const testLog = () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            console.log("logge din as " + user.displayName)
        } else {
            console.log("user is not logged in")
            // No user is signed in.
        }
      });
}

const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
        .then(result =>{
            const user = result.user
            document.write('Hello ' + user.displayName)
            console.log(user)

            if (user) {
                if (isUserNew(user.email)){
                    window.location.href = "working.html"
                } else {
                    window.location.href = "settings.html"
                }

            } else {
                console.log("user is not logged in")
           }

        })
        .catch(console.log)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}

const isUserNew = email => {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json')
    headers.append('GET','POST')
    headers.append("Access-Control-Allow-Origin","*")

    fetch ("http://127.0.0.1:5000/login",{
        mode:'cors',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            email: email
        })
    })
        .then((response) => {
            console.log(response)
            if (response.ok){
                console.log("suc")
                console.log()
                return response.json()
            } else{
                console.log("non suc")
            }

        })
        .then((data) => {
            console.log(data)
            console.log(data.greeting)
        })  }
