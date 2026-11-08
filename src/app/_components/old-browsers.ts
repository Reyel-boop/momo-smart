/**
 * A small script that runs first on every page, before any other script, so
 * old iPhones and iPads stuck on iOS 12 (Safari 12) have the built-ins the
 * framework expects, such as Object.hasOwn and Array.prototype.at. Without
 * them the app's scripts stop at the first call and no button works. Newer
 * browsers already have everything, so each part only fills a gap.
 *
 * It also reports script errors to /api/client-error so problems on devices
 * we can't test show up in the server logs. Written in plain ES5 on purpose.
 */
export const OLD_BROWSER_SCRIPT = `(function () {
  function def(target, name, value) {
    if (target && !(name in target)) {
      try {
        Object.defineProperty(target, name, { value: value, writable: true, configurable: true });
      } catch (e) {}
    }
  }
  function at(n) {
    var i = Math.trunc ? Math.trunc(n) || 0 : parseInt(n, 10) || 0;
    if (i < 0) i += this.length;
    return i < 0 || i >= this.length ? undefined : this[i];
  }
  def(Array.prototype, "at", at);
  def(String.prototype, "at", at);
  if (typeof Int8Array !== "undefined") {
    ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"].forEach(function (k) {
      if (window[k]) def(window[k].prototype, "at", at);
    });
  }
  def(Object, "hasOwn", function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); });
  def(Object, "fromEntries", function (it) {
    var o = {};
    Array.from(it).forEach(function (e) { o[e[0]] = e[1]; });
    return o;
  });
  def(Array.prototype, "findLast", function (f, t) {
    for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return this[i];
  });
  def(Array.prototype, "findLastIndex", function (f, t) {
    for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return i;
    return -1;
  });
  def(String.prototype, "replaceAll", function (s, r) {
    var p = s instanceof RegExp ? s : new RegExp(String(s).replace(/[.*+?^$\\{}()|[\\]\\\\]/g, "\\\\$&"), "g");
    return this.replace(p, r);
  });
  def(Promise, "allSettled", function (ps) {
    return Promise.all(Array.from(ps).map(function (p) {
      return Promise.resolve(p).then(
        function (v) { return { status: "fulfilled", value: v }; },
        function (r) { return { status: "rejected", reason: r }; });
    }));
  });
  def(Promise, "any", function (ps) {
    var list = Array.from(ps);
    return new Promise(function (resolve, reject) {
      var left = list.length, errors = [];
      if (!left) reject(new Error("All promises were rejected"));
      list.forEach(function (p, i) {
        Promise.resolve(p).then(resolve, function (e) {
          errors[i] = e;
          if (--left === 0) reject(new Error("All promises were rejected"));
        });
      });
    });
  });
  def(window, "queueMicrotask", function (f) { Promise.resolve().then(f); });
  // React checks form data against these when a form is sent (sign-in, for
  // one); without them iOS 12 throws "Can't find variable: BigInt64Array".
  // Stand-ins let the "is it one of these?" check simply answer no.
  ["BigInt64Array", "BigUint64Array"].forEach(function (name) {
    def(window, name, function () { throw new TypeError(name + " is not supported"); });
  });
  def(window, "structuredClone", function (v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); });
  if (window.crypto && window.crypto.getRandomValues) {
    def(window.crypto, "randomUUID", function () {
      var b = window.crypto.getRandomValues(new Uint8Array(16)), h = [];
      b[6] = (b[6] & 15) | 64;
      b[8] = (b[8] & 63) | 128;
      for (var i = 0; i < 16; i++) h.push((b[i] + 256).toString(16).slice(1));
      return h.slice(0, 4).join("") + "-" + h.slice(4, 6).join("") + "-" + h.slice(6, 8).join("") + "-" + h.slice(8, 10).join("") + "-" + h.slice(10).join("");
    });
  }

  var sent = 0;
  function report(message, stack) {
    if (sent++ > 5) return;
    try {
      var body = JSON.stringify({
        message: String(message).slice(0, 500),
        stack: String(stack || "").slice(0, 1500),
        page: location.pathname,
        agent: navigator.userAgent
      });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/client-error", body);
      else {
        var x = new XMLHttpRequest();
        x.open("POST", "/api/client-error");
        x.send(body);
      }
    } catch (e) {}
  }
  window.addEventListener("error", function (e) {
    report(e.message + " @ " + (e.filename || "") + ":" + (e.lineno || 0) + ":" + (e.colno || 0), e.error && e.error.stack);
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason || {};
    report("Unhandled promise: " + (r.message || r), r.stack);
  });
  // React reports errors it catches (the "Application error" screen) through
  // reportError where it exists, and console.error where it doesn't (iOS 12).
  def(window, "reportError", function (err) {
    report("reportError: " + ((err && err.message) || err), err && err.stack);
    if (window.console) console.error(err);
  });
  if (window.console && console.error) {
    var original = console.error;
    console.error = function () {
      for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (a && (a instanceof Error || a.stack)) {
          report("console.error: " + a.message, a.stack);
          break;
        }
      }
      return original.apply(console, arguments);
    };
  }
})();`;
