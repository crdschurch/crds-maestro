import { SharedHeader } from 'crds-shared-header/dist/bundle';
import phoenixEventListener from './phoenixEventListener';

export var App = {
    run: function() {
        console.log("Hello!");
        test1();
        phoenixEventListener();
        invokeAlertCms();
    }
}

function invokeAlertCms() {
    if (typeof alertCms !== 'undefined') {
        alertCms();
    }
}

function test1() {
    var test1 = document.getElementById("test1");
    if (test1 !== undefined && test1 !== null) {
        test1.addEventListener("click", function(event) {
            event.preventDefault();
            alert("Hello from Phoenix JavaScript!");
        });
    }
}

function domReady(callback) {
    document.addEventListener("DOMContentLoaded", callback);
}