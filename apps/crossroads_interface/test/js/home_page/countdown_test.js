import Countdown from '../../../web/static/js/home_page/countdown';

/* global CRDS */

describe('Countdown', () => {
  const broadcasts = [
    {
      eventId: 1039015,
      scheduleId: null,
      startTime: 'Sunday 10/08/17 07:50:00 PM',
      start: '2017-10-08 19:50:00',
      end: '2017-10-08 21:10:00',
      title: 'Sunday 8:00pm',
      type: 'V',
      skip: 0,
      'private': 0,
      exclude: 0,
      facebookLiveAccountTitle: null,
      vimeo: 0,
      countdown_text: 'October 8th @ 7:50pm EDT',
      timezone: 'America/New_York'
    },
    {
      eventId: 1039016,
      scheduleId: null,
      startTime: 'Sunday 10/08/17 09:50:00 PM',
      start: '2017-10-08 21:50:00',
      end: '2017-10-08 23:10:00',
      title: 'Sunday 10:00pm',
      type: 'V',
      skip: 0,
      'private': 0,
      exclude: 0,
      facebookLiveAccountTitle: null,
      vimeo: 0
    },
    {
      eventId: 1056214,
      scheduleId: 2391,
      startTime: 'Saturday 10/14/17 04:20:00 PM',
      start: '2017-10-14 16:20:00',
      end: '2017-10-14 17:40:00',
      title: 'Saturday 4:30pm',
      type: 'R',
      skip: 0,
      'private': 0,
      exclude: 0,
      facebookLiveAccountTitle: null,
      vimeo: 0
    },
    {
      eventId: 1056215,
      scheduleId: 2392,
      startTime: 'Saturday 10/14/17 06:05:00 PM',
      start: '2017-10-14 18:05:00',
      end: '2017-10-14 19:23:00',
      title: 'Saturday 6:15pm',
      type: 'R',
      skip: 0,
      'private': 0,
      exclude: 0,
      facebookLiveAccountTitle: null,
      vimeo: 0
    }
  ];

  // response from call to upcomingPlusCurrent when broadcasting, 
  // next event soon 
  const upcomingResponseLive =
  {
    success: true,
    data: {
      broadcasts,
      current: broadcasts[0],
      next: broadcasts[1]
    }
  };

  const upcomingResponseLive2 =
  {
    success: true,
    data: {
      broadcasts,
      current: broadcasts[1],
      next: broadcasts[2]
    }
  };

  // response from call to upcomingPlusCurrent when not broadcasting, 
  // next event soon
  const upcomingResponseUpcoming =
  {
    success: true,
    data: {
      broadcasts,
      current: null,
      next: broadcasts[1]
    }
  };

  // response from call to upcomingPlusCurrent when not broadcasting, 
  // next event far out
  const upcomingResponseOff =
  {
    success: true,
    data: {
      broadcasts,
      current: null,
      next: broadcasts[2]
    }
  };

  const testDom = `<div data-stream-status-loading="show">spinner</div>
  <div data-stream-status-loading="hide">
  <div data-stream-upcoming='show'>Upcoming</div>
  <div data-stream-upcoming='hide'>Not upcoming</div>
  <div data-stream-off='show'>Off</div>
  <div data-stream-off='hide'>Not off</div>
  <section class="container crds-countdown" id="crossroads_countdown">
  <div class="time countdown" data-stream-live="hide"><span class="countdown-header">Join the live stream in...</span>
  <ul class="countdown-timer list-inline">
  <li class="countdown-days days"></li>
  <li class="countdown-hours hours"></li>
  <li class="countdown-minutes minutes"></li>
  <li class="countdown-seconds seconds"></li>
  </ul>
  </div>
  <div class="live countdown hide in-progress" data-stream-live="show"><span class="countdown-header push-right" id="countdown-live">Live stream in progress...</span><a class="btn countdown-btn" href="/live/stream">Watch Now</a></div>
  </section></div>`;
  window.env = window.env || {};
  window.env.streamspotId = 'ssid';
  window.env.streamspotKey = 'sskey';

  beforeEach(() => {
    jasmine.clock().install();
    document.body.innerHTML = testDom;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should set status when loading complete', () => {
    // load during broadcast[0]
    const startDate = CRDS.Countdown.convertDate(broadcasts[0].start);
    const baseTime = new Date(startDate.getTime() + (10 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn($, 'ajax').and.returnValue($.Deferred().resolve(upcomingResponseLive).promise());
    const countdown = new CRDS.Countdown();
    expect($("[data-stream-status-loading='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-status-loading='hide']").hasClass('hide')).toBe(false);
    clearTimeout(countdown.timeoutId);
  });

  it('should show live stream elements if broadcasting', () => {
    // load during broadcast[0]
    const startDate = CRDS.Countdown.convertDate(broadcasts[0].start);
    const baseTime = new Date(startDate.getTime() + (10 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn($, 'ajax').and.returnValue($.Deferred().resolve(upcomingResponseLive).promise());
    const countdown = new CRDS.Countdown();
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(true);
    clearTimeout(countdown.timeoutId);
  });

  it('should show upcoming stream elements if within X hours of next countdown', () => {
    // load just before broadcast[1]
    const startDate = CRDS.Countdown.convertDate(broadcasts[1].start);
    const baseTime = new Date(startDate.getTime() - (10 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn($, 'ajax').and.returnValue($.Deferred().resolve(upcomingResponseUpcoming).promise());
    const countdown = new CRDS.Countdown();
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='hide']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='hide']").hasClass('hide')).toBe(false);
    clearInterval(countdown.intervalId);
  });

  it('should not show upcoming stream elements if more than X hours of next countdown', () => {
    // load after broadcast[1]
    const startDate = CRDS.Countdown.convertDate(broadcasts[1].end);
    const baseTime = new Date(startDate.getTime() + (10 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn($, 'ajax').and.returnValue($.Deferred().resolve(upcomingResponseOff).promise());
    const countdown = new CRDS.Countdown();
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-upcoming='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-off='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-off='hide']").hasClass('hide')).toBe(true);
    clearInterval(countdown.intervalId);
  });

  it('should transition from upcoming to live', () => {
    // load one minute before broadcast[1]
    const startDate = CRDS.Countdown.convertDate(broadcasts[1].start);
    const baseTime = new Date(startDate.getTime() - (1 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn(CRDS.Countdown.prototype, 'getEvents').and.returnValues($.Deferred().resolve(upcomingResponseUpcoming).promise(), $.Deferred().resolve(upcomingResponseLive2).promise());
    const countdown = new CRDS.Countdown();
    // fast forward 2 minutes 
    jasmine.clock().tick(1000 * 60 * 2);
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(true);
    expect($("[data-stream-upcoming='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-upcoming='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-off='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='hide']").hasClass('hide')).toBe(false);
    clearInterval(countdown.timeoutId);
  });

  it('should transition from off to upcoming', () => {
    // load X hours and 1 minute before broadcast[2]
    const startDate = CRDS.Countdown.convertDate(broadcasts[2].start);
    const baseTime = new Date(startDate.getTime() - (15 * 60 * 60 * 1000) - (1 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn($, 'ajax').and.returnValue($.Deferred().resolve(upcomingResponseOff).promise());
    const countdown = new CRDS.Countdown();
    // fast forward 2 minutes
    jasmine.clock().tick(1000 * 60 * 2);
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='hide']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='hide']").hasClass('hide')).toBe(false);
    clearTimeout(countdown.timeoutId);
    clearInterval(countdown.intervalId);
  });

  it('should transition from live to off', () => {
    // load 1 minute before broadcast[1] ends
    const startDate = CRDS.Countdown.convertDate(broadcasts[1].end);
    const baseTime = new Date(startDate.getTime() - (1 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn(CRDS.Countdown.prototype, 'getEvents').and.returnValues($.Deferred().resolve(upcomingResponseLive2).promise(), $.Deferred().resolve(upcomingResponseOff).promise());
    const countdown = new CRDS.Countdown();
    // fast forward 2 minutes
    jasmine.clock().tick(1000 * 60 * 2);
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-upcoming='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-off='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-off='hide']").hasClass('hide')).toBe(true);
    clearTimeout(countdown.timeoutId);
    clearInterval(countdown.intervalId);
  });

  it('should transition from live to upcoming', () => {
    // load 1 minute before broadcast[0] ends
    const startDate = CRDS.Countdown.convertDate(broadcasts[0].end);
    const baseTime = new Date(startDate.getTime() - (1 * 60 * 1000));
    jasmine.clock().mockDate(baseTime);
    spyOn(CRDS.Countdown.prototype, 'getEvents').and.returnValues($.Deferred().resolve(upcomingResponseLive).promise(), $.Deferred().resolve(upcomingResponseUpcoming).promise());
    const countdown = new CRDS.Countdown();
    // fast forward 2 minutes
    jasmine.clock().tick(1000 * 60 * 2);
    expect($("[data-stream-live='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-live='hide']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='show']").hasClass('hide')).toBe(false);
    expect($("[data-stream-upcoming='hide']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='show']").hasClass('hide')).toBe(true);
    expect($("[data-stream-off='hide']").hasClass('hide')).toBe(false);
    clearTimeout(countdown.timeoutId);
    clearInterval(countdown.intervalId);
  });
});
