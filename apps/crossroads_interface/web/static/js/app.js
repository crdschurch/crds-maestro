function run() {
    test1();
    phoenixEventListener();
    invokeAlertCms();
}

function invokeAlertCms() {
    if (typeof alertCms !== 'undefined') {
        alertCms();
    }
}

function test1() {
    var test1 = document.getElementById("test1");
    if (test1 !== undefined && test1 !== null) {
        test1.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Hello from Phoenix JavaScript!");
        });
    }
}

function phoenixEventListener() {
    document.addEventListener("phoenixEvent", function (e) {
        console.info("Event is: ", e);
        console.info("Custom data is: ", e.detail);
    });
}

function domReady(callback) {
    document.addEventListener("DOMContentLoaded", callback);
}

run();
//domReady(run);