
const sendImage = image => {
    let headers = new Headers();
    headers.append("Content-Type", 'application/json')
    headers.append('GET','POST')
    headers.append("Access-Control-Allow-Origin","*")
    var formdata = new FormData();
    formdata.append("snap", image);

    fetch ("http://127.0.0.1:5000/vision",{
        mode:'cors',
        method: 'POST',
        headers: headers,
        body: formdata
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
            console.log(data.status)
        }) 
}

const webCam = document.getElementById("webCam")
const canvas = document.getElementById("canvas")
var context = canvas.getContext('2d');

const screenshot_canvas = document.getElementById("screenshot_canvas")
const webcam = new Webcam(webCam, "user", canvas)


document.getElementById("send_canvas").addEventListener("click", function() {
    // copy frame from video to canvas as context 2d
    // context.drawImage(webCam, 0, 0,  320 ,  240 ); // better use size because camera may gives data in different size then <video> is displaying
    
    // convert to BASE64 url and assign to <img> to display it
    screenshot_canvas.src = canvas.toDataURL(); 
    console.log("he " + (typeof screenshot_canvas.src)) 
});

webcam.start()


screenshot_canvas.src = canvas.toDataURL();  

const takeSnap = () => {
    let picture = webcam.snap()
    console.log(picture)
    console.log(typeof picture)
    sendImage(picture)

    document.querySelector('a').href = picture
    console.log(typeof document.querySelector('a').href)
}