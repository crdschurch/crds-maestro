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

    this.nextEvent = undefined;
    this.currentEvent = undefined;
    this.streamStatus = undefined;
    this.streamOffset = 10;

    this.UPCOMING_DURATION = 15; // hours

    // Streamspot url
    this.streamspotUrl = 'https://api.streamspot.com';
    this.streamspotId = window.env.streamspotId;
    this.streamspotKey = window.env.streamspotKey;

    if ($('.crds-countdown').length) {
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

  setStreamStatus(status) {
    if (status === 'live') {
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
      if (status === 'upcoming') {
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

        this.appendNextStreamDate();
      }
    }
  }

  appendNextStreamDate() {
    const startDayTime = this.nextEvent.start.split(' ');
    const startDay = Countdown.getDayOfWeek(startDayTime[0]);
    const startTime = Countdown.get12HourTime(startDayTime[1]);
    const timeString = `${startDay} at ${startTime} EST`;
    $("[data-automation-id='offState']").append(
      $('<h3>').text('Next Live Stream')
    ).append(
      $('<h4>').text(timeString)
    );
  }

  static getDayOfWeek(date) {
    // date comes in as YYYY-mm-dd format
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'];
    const startDate = new Date(date);
    const dayOfWeek = daysOfWeek[startDate.getDay()];
    return dayOfWeek;
  }

  static get12HourTime(time) {
    // time comes in as HH:mm:ss format
    const timeArray = time.split(':');
    let hours = timeArray[0];
    let minutes = timeArray[1];
    let ampm = 'am';

    if (hours > 12) {
      hours -= 12;
      ampm = 'pm';
    }

    // presently we have a 10 minutes offset on our streamspot schedule
    // this adjusts for that
    if (minutes !== '00' && minutes !== '15' && minutes !== '30' && minutes !== '45') {
      minutes = (parseInt(minutes, 10) + this.streamOffset).toString();
    }

    return `${hours}:${minutes}${ampm}`;
  }

  getStreamspotStatus() {
    Countdown.setLoadingStatus(true);
    this.getEvents()
      .done((events) => {
        this.nextEvent = events.data.next;
        this.currentEvent = events.data.current;
        Countdown.setLoadingStatus(false);
        if (events.data.current != null) {
          this.goLive();
        } else {
          this.showCountdown();
        }
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

  goLive() {
    this.setStreamStatus('live');

    const currentEndDate = this.currentEvent.end;
    const secondsUntilStreamEnd = (Countdown.convertDate(currentEndDate) - (new Date())) / 1000;

    this.timeoutId = setTimeout(() => {
      if (this.nextEvent == null) {
        this.getStreamspotStatus();
      } else {
        this.showCountdown();
      }
    }, 1000 * secondsUntilStreamEnd);
  }

  showCountdown() {
    $('.crds-countdown').show();

    const secondsUntilNextEvent = (Countdown.convertDate(this.nextEvent.start) - (new Date())) / 1000;
    if (secondsUntilNextEvent < this.UPCOMING_DURATION * 60 * 60) {
      this.setStreamStatus('upcoming');
    } else {
      this.setStreamStatus('off');
    }

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
    $('.crds-countdown .days').html(Countdown.padZero(this.days));
    $('.crds-countdown .hours').html(Countdown.padZero(this.hours));
    $('.crds-countdown .minutes').html(Countdown.padZero(this.minutes));
    $('.crds-countdown .seconds').html(Countdown.padZero(this.seconds));
    const remainingSeconds = (this.seconds) + (this.minutes * 60) + (this.hours * 3600) + (this.days * 86400);
    if (remainingSeconds < this.UPCOMING_DURATION * 3600 && this.streamStatus !== 'upcoming') {
      this.setStreamStatus('upcoming');
    }
    if (this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 0) {
      this.currentEvent = this.nextEvent;
      this.nextEvent = null;
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
