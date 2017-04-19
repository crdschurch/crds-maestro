export default function() {
    document.addEventListener("phoenixEvent", function(e) {
        console.info("Event is: ", e);
        console.info("Custom data is: ", e.detail);
    });
}