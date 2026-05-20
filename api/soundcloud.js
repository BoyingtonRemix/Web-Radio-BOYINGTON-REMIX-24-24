(function () {

  const pad = (n) => String(n).padStart(2, '0');

  const defaultCover = 'background-boyington-radio.jpg';

  const coverImg = document.getElementById('current-track-cover');

  const iframe = document.getElementById('soundcloud-widget');

  const playlistUrn = 'soundcloud:playlists:2239796183';

  const buildPlayerUrl = (urn, startTrack = 0) => {

    const encoded = encodeURIComponent(urn);

    return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/${encoded}&color=%23ee0f25&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&start_track=${startTrack}`;

  };

  iframe.src = buildPlayerUrl(playlistUrn, 0);

  const el = {

    localTime: document.getElementById('local-time'),

    localDate: document.getElementById('local-date'),

    hour: document.getElementById('hour-hand'),

    minute: document.getElementById('minute-hand'),

    second: document.getElementById('second-hand'),

    paris: document.getElementById('time-paris'),

    london: document.getElementById('time-london'),

    newyork: document.getElementById('time-newyork'),

    tokyo: document.getElementById('time-tokyo')

  };

  function formatTime(date, timeZone) {

    return new Intl.DateTimeFormat('fr-FR', {

      hour: '2-digit',

      minute: '2-digit',

      second: '2-digit',

      hour12: false,

      timeZone

    }).format(date);

  }

  function updateClock() {

    const now = new Date();

    const h = now.getHours();

    const m = now.getMinutes();

    const s = now.getSeconds();

    const ms = now.getMilliseconds();

    const seconds = s + ms / 1000;

    const minutes = m + seconds / 60;

    const hours = (h % 12) + minutes / 60;

    el.hour.style.transform = `translateX(-50%) rotate(${hours * 30}deg)`;

    el.minute.style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;

    el.second.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;

    el.localTime.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;

    el.localDate.textContent = now.toLocaleDateString('fr-FR', {

      weekday: 'long',

      day: '2-digit',

      month: 'long',

      year: 'numeric'

    });

    el.paris.textContent = formatTime(now, 'Europe/Paris');

    el.london.textContent = formatTime(now, 'Europe/London');

    el.newyork.textContent = formatTime(now, 'America/New_York');

    el.tokyo.textContent = formatTime(now, 'Asia/Tokyo');

  }

  function normalizeArtworkUrl(url) {

    if (!url) return defaultCover;

    return url

      .replace('-large.jpg', '-t500x500.jpg')

      .replace('-large.png', '-t500x500.png')

      .replace('-t300x300', '-t500x500');

  }

  function updateCoverFromSound(sound) {

    if (!sound) {

      coverImg.src = defaultCover;

      return;

    }

    const artwork = sound.artwork_url || (sound.user && sound.user.avatar_url);

    coverImg.src = normalizeArtworkUrl(artwork || defaultCover);

  }

  function bindSoundCloud() {

    if (!window.SC || !SC.Widget) {

      coverImg.src = defaultCover;

      return;

    }

    const widget = SC.Widget(iframe);

    let readyPlayed = false;

    const refreshCover = () => {

      widget.getCurrentSound(function (sound) {

        updateCoverFromSound(sound);

      });

    };

    widget.bind(SC.Widget.Events.READY, function () {

      refreshCover();

      try {

        widget.play();

      } catch (e) {}

      if (!readyPlayed) {

        readyPlayed = true;

      }

    });

    widget.bind(SC.Widget.Events.PLAY, refreshCover);

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, refreshCover);

    widget.bind(SC.Widget.Events.FINISH, refreshCover);

  }

  updateClock();

  setInterval(updateClock, 1000);

  bindSoundCloud();

  const visitor = document.getElementById('visitor-counter');

  visitor.textContent = String(Number(visitor.textContent) || 2063);

})();

