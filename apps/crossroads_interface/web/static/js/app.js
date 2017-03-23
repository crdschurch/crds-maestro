//import "phoenix_html"

// include all svg files in icons directory in the body of the document
//var files = require.context('../icons', false, /.svg$/);
//files.keys().forEach(files);

// import socket from "./socket"
function run() {
    test1();
    alertCMS();
    phoenixEventListener();
}

function test1() {
    var test1 = document.getElementById("test1");
    test1.addEventListener("click", function(event) {
        event.preventDefault();
        alert("Hello from Phoenix JavaScript!");
    });
}

function phoenixEventListener() {
    document.addEventListener("phoenixEvent", function(e) {
        console.info("Event is: ", e);
        console.info("Custom data is: ", e.detail);
    });
}

function domReady(callback) {
    document.addEventListener("DOMContentLoaded", callback);
}

run();
//domReady(run);