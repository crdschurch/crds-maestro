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

    // Streamspot url
    this.streamspotUrl = 'https://api.streamspot.com';
    this.streamspotId = window.env.streamspotId;
    this.streamspotKey = window.env.streamspotKey;

    if ($('#crossroads_countdown').length) {
      this.loadCountdown();
    }
  }

  loadCountdown() {
    this.loadEvents()
      .done((events) => {
        this.isBroadcasting()
          .done((broadcasting) => {
            if (broadcasting.data.isBroadcasting) {
              this.goLive();
            } else {
              this.showCountdown(events);
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

  loadEvents() {
    const streamspotKey = this.streamspotKey;
    const eventUrl = `${this.streamspotUrl}/broadcaster/${this.streamspotId}/broadcasts/upcoming`;
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

  static goLive() {
    $("[data-on-load='show']").removeClass('hide');
    $("[data-on-live='show']").removeClass('hide');
    $("[data-on-live='hide']").addClass('hide');
  }

  showCountdown(data) {
    $('#crossroads_countdown').show();
    $("[data-on-load='show']").removeClass('hide');
    $("[data-on-live='show']").addClass('hide');
    $("[data-on-live='hide']").removeClass('hide');

    const dateString = data.data.next.start;

    const secondsUntilNextEvent = (Countdown.convertDate(dateString) - (new Date())) / 1000;
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
    if (this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 0) {
      this.goLive();
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
