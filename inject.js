(() => {
  "use strict";
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
  const seed = (crypto.getRandomValues(new Uint32Array(1))[0] | 1);
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

  const def = (obj, prop, value) => {
    try {
      Object.defineProperty(obj, prop, { get: () => value, configurable: true, enumerable: true });
    } catch (_) {}
  };

  // ---- Navigator ----
  const N = Navigator.prototype;
  def(N, "userAgent", UA);
  def(N, "appVersion", UA.replace("Mozilla/", ""));
  def(N, "platform", "Win32");
  def(N, "vendor", "Google Inc.");
  def(N, "language", "en-US");
  def(N, "languages", Object.freeze(["en-US", "en"]));
  def(N, "hardwareConcurrency", 4);
  def(N, "deviceMemory", 8);
  def(N, "maxTouchPoints", 0);
  def(N, "doNotTrack", "1");
  def(N, "webdriver", false);
  def(N, "plugins", Object.freeze([]));
  def(N, "mimeTypes", Object.freeze([]));
  def(N, "connection", undefined);
  def(N, "getBattery", undefined);
  def(N, "userAgentData", {
    brands: [{ brand: "Chromium", version: "130" }, { brand: "Not?A_Brand", version: "99" }],
    mobile: false,
    platform: "Windows",
    getHighEntropyValues: () => Promise.resolve({
      brands: [{ brand: "Chromium", version: "130" }], mobile: false, platform: "Windows"
    }),
    toJSON() { return { brands: this.brands, mobile: false, platform: "Windows" }; }
  });

  // Appareils média: aucune liste
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([]);
  }

  // ---- Écran ----
  const scr = { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040,
    colorDepth: 24, pixelDepth: 24 };
  for (const k in scr) def(Screen.prototype, k, scr[k]);
  def(window, "innerWidth", 1920 - 0);
  def(window, "innerHeight", 1000);
  def(window, "outerWidth", 1920);
  def(window, "outerHeight", 1040);
  def(window, "devicePixelRatio", 1);
  def(window, "screenX", 0);
  def(window, "screenY", 0);

  // ---- Fuseau horaire: UTC ----
  Date.prototype.getTimezoneOffset = function () { return 0; };
  const origResolved = Intl.DateTimeFormat.prototype.resolvedOptions;
  Intl.DateTimeFormat.prototype.resolvedOptions = function () {
    const o = origResolved.call(this);
    o.timeZone = "UTC";
    o.locale = "en-US";
    return o;
  };
  const OrigDTF = Intl.DateTimeFormat;
  const wrapDTF = function (loc, opts) {
    return new OrigDTF("en-US", Object.assign({}, opts, { timeZone: (opts && opts.timeZone) || "UTC" }));
  };
  wrapDTF.prototype = OrigDTF.prototype;
  wrapDTF.supportedLocalesOf = OrigDTF.supportedLocalesOf;
  Intl.DateTimeFormat = wrapDTF;
  const origToString = Date.prototype.toString;
  Date.prototype.toString = function () {
    return origToString.call(this).replace(/GMT[+-]\d{4} \(.*\)$/, "GMT+0000 (Coordinated Universal Time)");
  };

  // ---- Canvas ----
  const noisy = (img) => {
    const d = img.data;
    for (let i = 0; i < 40; i++) {
      const p = Math.floor(rnd() * (d.length / 4)) * 4 + Math.floor(rnd() * 3);
      d[p] = d[p] ^ 1;
    }
    return img;
  };
  const gid = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function (...a) {
    return noisy(gid.apply(this, a));
  };
  const copyNoisy = (canvas) => {
    const w = canvas.width, h = canvas.height;
    if (!w || !h) return canvas;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    try {
      const src = canvas.getContext("2d");
      if (!src) return canvas;
      ctx.putImageData(noisy(gid.call(src, 0, 0, w, h)), 0, 0);
      return c;
    } catch (_) { return canvas; }
  };
  const tdu = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...a) { return tdu.apply(copyNoisy(this), a); };
  const tb = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (...a) { return tb.apply(copyNoisy(this), a); };

  // ---- WebGL ----
  for (const Ctx of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!Ctx) continue;
    const gp = Ctx.prototype.getParameter;
    Ctx.prototype.getParameter = function (p) {
      if (p === 37445) return "Google Inc. (Generic)";
      if (p === 37446) return "ANGLE (Generic, Generic Renderer, OpenGL)";
      return gp.call(this, p);
    };
    const ge = Ctx.prototype.getExtension;
    Ctx.prototype.getExtension = function (n) {
      return n === "WEBGL_debug_renderer_info" ? ge.call(this, n) : ge.call(this, n);
    };
  }

  // ---- Audio ----
  if (window.AudioBuffer) {
    const gcd = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function (...a) {
      const data = gcd.apply(this, a);
      for (let i = 0; i < data.length; i += 100) data[i] += (rnd() - 0.5) * 1e-7;
      return data;
    };
  }
  if (window.AnalyserNode) {
    const gf = AnalyserNode.prototype.getFloatFrequencyData;
    AnalyserNode.prototype.getFloatFrequencyData = function (arr) {
      gf.call(this, arr);
      for (let i = 0; i < arr.length; i++) arr[i] += (rnd() - 0.5) * 0.1;
    };
  }

  // ---- Stockage / divers ----
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate = () => Promise.resolve({ quota: 2147483648, usage: 0 });
  }
  if (window.speechSynthesis) {
    speechSynthesis.getVoices = () => [];
  }
})();
