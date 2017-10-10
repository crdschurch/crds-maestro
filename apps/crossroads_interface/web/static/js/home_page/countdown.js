/* eslist no-plusplus: 0 */
/* global CRDS */

window.CRDS = window.CRDS || {};

CRDS.Countdown = class Countdown {
  constructor() {
    this.days = undefined;
    this.hours = undefined;
    this.minutes = undefined;
    this.seconds = undefined;
    this.intervalId = undefined;
    this.timeoutId = undefined;

    this.broadcasting = undefined;
    this.nextEvent = undefined;
    this.currentEvent = undefined;
    this.streamStatus = undefined;
    this.secondsUntilNextEvent = undefined;

    this.UPCOMING_DURATION = 15; // hours

    // Streamspot url
    this.streamspotUrl = 'https://api.streamspot.com';
    this.streamspotId = window.env.streamspotId;
    this.streamspotKey = window.env.streamspotKey;

    if ($('#crossroads_countdown').length) {
      Countdown.setLoadingStatus(true);
      this.getStreamspotStatus();
    }
  }

  static setLoadingStatus(loading) {
    if (loading) {
      $("[data-stream-status-loading='hide']").addClass('hide');
      $("[data-stream-status-loading='show']").removeClass('hide');
    } else {
      $("[data-stream-status-loading='show']").addClass('hide');
      $("[data-stream-status-loading='hide']").removeClass('hide');
    }
  }

  setStreamStatus() {
    if (this.broadcasting) {
      this.streamStatus = 'live';
      $("[data-stream-live='show']").removeClass('hide');
      $("[data-stream-live='hide']").addClass('hide');
      $("[data-stream-upcoming='show']").addClass('hide');
      $("[data-stream-upcoming='hide']").removeClass('hide');
      $("[data-stream-off='show']").addClass('hide');
      $("[data-stream-off='hide']").removeClass('hide');
    } else {
      $("[data-stream-live='show']").addClass('hide');
      $("[data-stream-live='hide']").removeClass('hide');
      const secondsUntilNextEvent = (Countdown.convertDate(this.nextEvent.start) - (new Date())) / 1000;
      if (secondsUntilNextEvent < this.UPCOMING_DURATION * 60 * 60) {
        this.streamStatus = 'upcoming';
        $("[data-stream-upcoming='show']").removeClass('hide');
        $("[data-stream-upcoming='hide']").addClass('hide');
        $("[data-stream-off='show']").addClass('hide');
        $("[data-stream-off='hide']").removeClass('hide');
      } else {
        this.streamStatus = 'off';
        $("[data-stream-off='show']").removeClass('hide');
        $("[data-stream-off='hide']").addClass('hide');
        $("[data-stream-upcoming='show']").addClass('hide');
        $("[data-stream-upcoming='hide']").removeClass('hide');
      }
    }
  }

  getStreamspotStatus() {
    this.getEvents()
      .done((events) => {
        this.nextEvent = events.data.next;
        this.secondsUntilNextEvent = (Countdown.convertDate(this.nextEvent.start) - (new Date())) / 1000;
        this.currentEvent = events.data.current;
        this.isBroadcasting()
          .done((broadcasting) => {
            this.broadcasting = broadcasting.data.isBroadcasting;
            if (broadcasting.data.isBroadcasting) {
              this.goLive();
            } else {
              this.showCountdown();
            }
          })
          .fail((xhr, ajaxOptions, thrownError) => {
            console.log(thrownError);
          });
      })
      .fail((xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
      });
  }

  getEvents() {
    const streamspotKey = this.streamspotKey;
    const eventUrl = `${this.streamspotUrl}/broadcaster/${this.streamspotId}/broadcasts/upcomingPlusCurrent`;
    return $.ajax({
      url: eventUrl,
      dataType: 'json',
      crossDomain: true,
      beforeSend(request) {
        request.setRequestHeader('X-API-Key', streamspotKey);
      }
    });
  }

  isBroadcasting() {
    const streamspotKey = this.streamspotKey;
    const statusUrl = `${this.streamspotUrl}/broadcaster/${this.streamspotId}/broadcasting`;
    return $.ajax({
      url: statusUrl,
      dataType: 'json',
      crossDomain: true,
      beforeSend(request) {
        request.setRequestHeader('X-API-Key', streamspotKey);
      }
    });
  }

  goLive() {
    Countdown.setLoadingStatus(false);
    this.setStreamStatus();

    const currentEndDate = this.currentEvent.end;
    const secondsUntilStreamEnd = (Countdown.convertDate(currentEndDate) - (new Date())) / 1000;

    this.timeoutId = setTimeout(() => {
      this.getStreamspotStatus();
    }, 1000 * secondsUntilStreamEnd);
  }

  showCountdown() {
    $('#crossroads_countdown').show();
    Countdown.setLoadingStatus(false);
    this.setStreamStatus();

    const nextStartDate = this.nextEvent.start;

    const secondsUntilNextEvent = (Countdown.convertDate(nextStartDate) - (new Date())) / 1000;
    this.days = Math.floor(secondsUntilNextEvent / 86400);
    this.hours = Math.floor((secondsUntilNextEvent % 86400) / 3600);
    this.minutes = Math.floor((secondsUntilNextEvent % 3600) / 60);
    this.seconds = Math.floor(secondsUntilNextEvent % 60);

    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    if (--this.seconds < 0) {
      this.seconds = 59;
      if (--this.minutes < 0) {
        this.minutes = 59;
        if (--this.hours < 0) {
          this.hours = 23;
          if (--this.days < 0) {
            this.days = 0;
          }
        }
      }
    }
    $('#crossroads_countdown .days').html(Countdown.padZero(this.days));
    $('#crossroads_countdown .hours').html(Countdown.padZero(this.hours));
    $('#crossroads_countdown .minutes').html(Countdown.padZero(this.minutes));
    $('#crossroads_countdown .seconds').html(Countdown.padZero(this.seconds));
    if (this.hours < this.UPCOMING_DURATION && this.streamStatus !== 'upcoming') {
      this.setStreamStatus();
    }
    if (this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 0) {
      this.getStreamspotStatus();
      clearInterval(this.intervalId);
    }
  }

  static convertDate(dateString) {
    const date = dateString.match(/^(\d{4})-0?(\d+)-0?(\d+)[T ]0?(\d+):0?(\d+):0?(\d+)$/);
    const formattedDateString = `${date[2]}/${date[3]}/${date[1]} ${date[4]}:${date[5]}:${date[6]} -0400`;
    return new Date(formattedDateString);
  }

  // Convert Single Digit to Double Digit
  // check if value is < 10 
  // if yes, then add a 0 onto the front
  // if no, then nothing
  static padZero(number) {
    if (number <= 10) {
      return (`0${number}`).slice(-2);
    }
    return number;
  }
};