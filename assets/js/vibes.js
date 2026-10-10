(function () {
  // Fallback for browsers without the async Clipboard API (older iOS Safari / Android WebView).
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    ta.style.fontSize = "16px"; // prevents zoom on iOS
    document.body.appendChild(ta);

    if (/ipad|iphone|ipod/i.test(navigator.userAgent)) {
      ta.contentEditable = "true";
      ta.readOnly = false;
      var range = document.createRange();
      range.selectNodeContents(ta);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      ta.setSelectionRange(0, text.length);
    } else {
      ta.select();
    }

    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacyCopy(text); }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  // Last resort: select the code so the user can copy it by hand.
  function selectNode(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // On Android a custom scheme opens more reliably in Chrome as an intent:// URL. No package
  // in it: the link must reach whichever installed build handles the scheme (a debug build
  // has its own package, and a pinned package that lacks /vibe swallows the link); Google
  // Play opens only when no app handles it.
  var PLAY_URL = "https://play.google.com/store/apps/details?id=com.alki.paslen";
  function appLink(deeplink) {
    if (!/android/i.test(navigator.userAgent)) return deeplink;
    var m = deeplink.match(/^([a-z][a-z0-9+.-]*):\/\/(.*)$/i);
    if (!m) return deeplink;
    return "intent://" + m[2] + "#Intent;scheme=" + m[1] +
      ";S.browser_fallback_url=" + encodeURIComponent(PLAY_URL) + ";end";
  }

  function bindCopy(button, code) {
    var timer;
    var label = button.textContent;
    button.addEventListener("click", function () {
      copy(code.textContent.trim()).then(function (ok) {
        clearTimeout(timer);
        button.classList.remove("is-done", "is-failed");
        if (ok) {
          button.textContent = "Copied";
          button.classList.add("is-done");
        } else {
          if (code.offsetParent !== null) selectNode(code);
          button.textContent = "Copy failed";
          button.classList.add("is-failed");
        }
        timer = setTimeout(function () {
          button.textContent = label;
          button.classList.remove("is-done", "is-failed");
        }, 2000);
      });
    });
  }

  // Vibe page: Copy button + deeplink built from the vibe JSON.
  var panel = document.querySelector(".json-panel");
  if (panel) {
    var code = panel.querySelector("pre code") || panel.querySelector("pre");
    var copyBtn = panel.querySelector("[data-copy-json]");
    var openBtn = document.querySelector("[data-deeplink]");

    if (code && copyBtn) bindCopy(copyBtn, code);

    // "Copy & open in Paslen": the vibe JSON (with its playlist) goes to the clipboard and the
    // deeplink opens the app's paste screen. No data in the link: a schema doesn't fit a URL.
    if (openBtn) {
      try {
        var vibe = JSON.parse(code.textContent);
        var playlist = openBtn.getAttribute("data-playlist");
        if (playlist && !vibe.playlist) vibe.playlist = playlist;
        var pretty = JSON.stringify(vibe, null, 2);
        var base = appLink(openBtn.getAttribute("data-deeplink"));
        openBtn.href = base;
        openBtn.addEventListener("click", function (event) {
          event.preventDefault();
          // The copy must start inside the tap (iOS); open the app once it is done.
          copy(pretty).then(function () { window.location.href = base; });
        });
      } catch (e) {
        openBtn.classList.add("is-disabled");
        openBtn.removeAttribute("href");
        console.error("Vibe JSON is invalid:", e);
      }
    }
  }

  // "Open Paslen" page (/vibes/open/): the link chatbots give after a vibe. Try to open the
  // app right away; the button stays for browsers that only follow a tap.
  var openApp = document.querySelector("[data-open-app]");
  if (openApp) {
    var target = appLink(openApp.getAttribute("data-open-app"));
    openApp.href = target;
    window.location.href = target;
  }

  // Schema page: copy the whole spec (Markdown) for an AI agent.
  // The text is embedded in the page so the copy stays inside the tap gesture (required on iOS).
  var agentBtn = document.querySelector("[data-copy-agent]");
  var agentSpec = document.getElementById("agent-spec");
  if (agentBtn && agentSpec) bindCopy(agentBtn, agentSpec);

  // Docs pages: a Copy button on every code block.
  var blocks = document.querySelectorAll(".doc div.highlighter-rouge");
  for (var i = 0; i < blocks.length; i++) {
    var blockCode = blocks[i].querySelector("pre code") || blocks[i].querySelector("pre");
    if (!blockCode) continue;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    blocks[i].appendChild(btn);
    bindCopy(btn, blockCode);
  }
})();
