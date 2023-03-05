
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app()
    console.log(app)
    testLog()
})
var email = ""
const testLog = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
           email= user.email
        } else {
            window.location.href = "index.html"
            // No user is signed in.
        }
    });
}

const saveUserSettings = () => {
    const halal = document.getElementById("halal").checked
    const vegan = document.getElementById("vegan").checked
    const vegetarian = document.getElementById("vegetarian").checked
    const pescatarian = document.getElementById("pescatarian").checked
    const lactose = document.getElementById("lactose-free").checked
    const gluten = document.getElementById("gluten-free").checked
    const other = document.getElementById("other").checked
    const restrictions = ["halal","vegan","vegetarian","pescatarian","lactose","gluten",]
    
    if (!(halal)) {
        delete restrictions[0]
    }

    if (!(vegan)) {
        delete restrictions[1]
    }

    if (!(vegetarian)) {
        delete restrictions[2]
    }

    if (!(pescatarian)) {
        delete restrictions[3]
    }

    if (!(lactose)) {
        delete restrictions[4]
    }

    if (!(gluten)) {
        delete restrictions[5]
    }

    if (other) {
        const other_value = document.getElementById("other-text").value        
        restrictions.push(other_value)
    }
    let restrictions_string = ""
    for (let i = 0; i < restrictions.length; i++){
        if (i  == 0) {
            restrictions_string = restrictions_string + restrictions[i]
            continue
        }
        restrictions_string = restrictions_string + ","+ restrictions[i]
    }
    sendToServer(email, restrictions_string)
}

const sendToServer = (email, settings) => {
    console.log('send to server')
    let headers = new Headers();
    headers.append("Content-Type", 'application/json')
    headers.append('GET', 'POST')
    headers.append("Access-Control-Allow-Origin", "*")

    fetch("http://127.0.0.1:5000/settings", {
        mode: 'cors', method: 'POST', headers: headers, body: JSON.stringify({
            email: email,
            restrictions: settings
        })
    })
        .then((response) => {
            console.log(response)
            if (response.ok) {
                console.log("suc")
                console.log()
                return response.json()
            } else {
                console.log("non suc")
            }

        })
        .then((data) => {
            console.log(data)
            console.log(data.status)
            alert("Your settings have been updated!")
            window.location.href = "working.html"
        })
    
}