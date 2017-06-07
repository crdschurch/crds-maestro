$(function () {
  var days, goLive, hours, intervalId, minutes, seconds;

  // Streamspot url
  var streamspotUrl = "https://api.streamspot.com";
  var streamspotId = "crossr4915";
  var streamspotKey = "82437b4d-4e38-42e2-83b6-148fcfaf36fb";

  goLive = function () {
    $("#crossroads_countdown .time").hide();
    $("#crossroads_countdown .live").show();
  };

  loadCountdown = function (data) {
    var seconds_till;
    $("#crossroads_countdown").show();

    dateString = data.data.events.filter(isFutureEvent).sort(compareEvents)[0].start;

    seconds_till = ((new Date(dateString+ " EDT")) - (new Date())) / 1000;
    days = Math.floor(seconds_till / 86400);
    hours = Math.floor((seconds_till % 86400) / 3600);
    minutes = Math.floor((seconds_till % 3600) / 60);
    seconds = Math.floor(seconds_till % 60);
    return intervalId = setInterval(function () {
      if (--seconds < 0) {
        seconds = 59;
        if (--minutes < 0) {
          minutes = 59;
          if (--hours < 0) {
            hours = 23;
            if (--days < 0) {
              days = 0;
            }
          }
        }
      }
      $("#crossroads_countdown .days").html(days);
      $("#crossroads_countdown .hours").html(hours);
      $("#crossroads_countdown .minutes").html(minutes);
      $("#crossroads_countdown .seconds").html(seconds);
      if (seconds === 0 && minutes === 0 && hours === 0 && days === 0) {
        goLive();
        return clearInterval(intervalId);
      }
    }, 1000);
  }

  isLive = function() {
    statusUrl = streamspotUrl + "/broadcaster/" + streamspotId + "/broadcasting";
    $.ajax({
      url: statusUrl,
      dataType: "json",
      crossDomain: true,
      beforeSend: function(request) {
        request.setRequestHeader("X-API-Key", streamspotKey);
      },
      success: function (data) {
        if(data.isBroadcasting) {
          goLive();
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        return console.log(thrownError);
      }
    });
  }

  loadEvents = function() {
    eventUrl = streamspotUrl + "/broadcaster/" + streamspotId + "/events";
    $.ajax({
      url: eventUrl,
      dataType: "json",
      crossDomain: true,
      beforeSend: function(request) {
        request.setRequestHeader("X-API-Key", streamspotKey);
      },
      success: function (data) {
        loadCountdown(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        return console.log(thrownError);
      }
    });
  }

  compareEvents = function (event1, event2) {
    event1Date = new Date(event1.start);
    event2Date = new Date(event2.start);
    if (event1Date < event2Date) {
      return -1;
    }
    if (event1Date > event2Date) {
      return 1;
    }
    return 0;
  }

  isFutureEvent = function(event) {
    // Hack alert! Streamspot date is in EDT but it doesn't say so in the event
    eventDate = new Date(event.start + " EDT");
    now = new Date();
    return eventDate > now;
  }
 
  days = void 0;
  hours = void 0;
  minutes = void 0;
  seconds = void 0;
  intervalId = void 0;

  if(isLive()) {
    goLive();
  } else {
    loadEvents();
  }

});