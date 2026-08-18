/* ============================================================
   storage.js — persistence for the HOSTED version of the course.

   Drop-in replacement for scorm.js. Same API surface, so the course
   code needs no changes. Progress is saved in the browser's
   localStorage instead of an LMS.

   What this means in practice:
   - Progress is per-browser, per-device. A learner who switches
     machines starts fresh.
   - Nothing is reported to Canvas. Completion is not tracked.
   - Updating the course = replace these files on the host. Learner
     progress is untouched, because it lives in their browser.
   ============================================================ */
var SCORM = (function () {
  var KEY = "ps-pd-onboarding-v1";
  var started = Date.now();

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function write(obj) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(obj));
      return true;
    } catch (e) {
      /* storage full, private mode, or blocked in an iframe */
      return false;
    }
  }

  /* Detect whether storage is usable at all, so we can warn once. */
  var usable = (function () {
    try {
      var t = "__ps_test__";
      window.localStorage.setItem(t, "1");
      window.localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  })();

  return {
    storageAvailable: usable,

    init: function () {
      if (!usable && typeof console !== "undefined") {
        console.warn("Progress cannot be saved: browser storage is unavailable.");
      }
      return usable;
    },

    /* --- suspend data: the whole course state object --- */
    getSuspend: function () {
      var d = read();
      return d.state || null;
    },
    setSuspend: function (state) {
      var d = read();
      d.state = state;
      d.updated = new Date().toISOString();
      return write(d);
    },

    /* --- bookmark: resume where the learner left off --- */
    /* Bookmarks are stored per unit, because the four unit pages share this
       storage and a bookmark from one unit is meaningless in another. */
    setBookmark: function (id, unit) {
      var d = read();
      d.bookmarks = d.bookmarks || {};
      d.bookmarks[unit || "all"] = String(id).slice(0, 255);
      d.bookmark = String(id).slice(0, 255); /* kept for older builds */
      return write(d);
    },
    getBookmark: function (unit) {
      var d = read();
      if (d.bookmarks && d.bookmarks[unit || "all"]) return d.bookmarks[unit || "all"];
      return "";
    },

    /* --- completion + score: recorded locally only --- */
    markComplete: function () {
      var d = read();
      d.completed = true;
      d.completedAt = d.completedAt || new Date().toISOString();
      return write(d);
    },
    complete: function () {
      return this.markComplete();
    },
    setScore: function (pct) {
      var d = read();
      d.progressPct = Math.max(0, Math.min(100, Math.round(pct || 0)));
      return write(d);
    },

    /* --- interactions: kept locally so a learner can review their own history --- */
    logInteraction: function (id, response, correct, correctResponse) {
      try {
        var d = read();
        d.interactions = d.interactions || [];
        d.interactions.push({
          id: id,
          response: String(response == null ? "" : response).slice(0, 255),
          correct: !!correct,
          expected: String(correctResponse == null ? "" : correctResponse).slice(0, 255),
          at: new Date().toISOString()
        });
        if (d.interactions.length > 500) d.interactions = d.interactions.slice(-500);
        return write(d);
      } catch (e) {
        return false;
      }
    },

    /* --- session time: stored, not transmitted --- */
    reportSessionTime: function () {
      try {
        var d = read();
        var secs = Math.max(0, Math.floor((Date.now() - started) / 1000));
        d.totalSeconds = (d.totalSeconds || 0) + secs;
        started = Date.now();
        return write(d);
      } catch (e) {
        return false;
      }
    },

    commit: function () {
      return true; /* every write is immediate */
    },
    finish: function () {
      this.reportSessionTime();
      return true;
    },

    /* --- utility for the learner: wipe local progress --- */
    reset: function () {
      try {
        window.localStorage.removeItem(KEY);
        return true;
      } catch (e) {
        return false;
      }
    }
  };
})();
