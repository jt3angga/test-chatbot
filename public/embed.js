(function () {
  const origin = window.location.origin;
  const scriptTag = document.currentScript;

  const token = scriptTag?.dataset.token || "";
  const lang = scriptTag?.dataset.lang || "id";
  const greeting =
    scriptTag?.dataset.greeting || "Halo! Ada yang bisa saya bantu?";
  const theme =
    scriptTag?.dataset.theme === "auto"
      ? new Date().getHours() >= 18 || new Date().getHours() < 6
        ? "dark"
        : "light"
      : scriptTag?.dataset.theme || "light";
  const idleDelay = parseInt(scriptTag?.dataset.idleDelay || "10000", 10);

  const style = document.createElement("style");
  style.textContent = `
    #chatbot-widget-root {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    #chatbot-toggle-button {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    #chatbot-iframe {
      display: none;
      margin-bottom: 12px;
      border: none;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    #chatbot-iframe.show {
      display: block;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "chatbot-widget-root";
  document.body.appendChild(container);

  const iframe = document.createElement("iframe");
  iframe.id = "chatbot-iframe";
  iframe.src = `${origin}/embed-chat?lang=${lang}&theme=${theme}&greeting=${encodeURIComponent(
    greeting
  )}&token=${token}`;
  iframe.width = "360";
  iframe.height = "500";
  container.appendChild(iframe);

  const button = document.createElement("button");
  button.id = "chatbot-toggle-button";
  button.innerHTML = "💬";
  container.appendChild(button);

  button.addEventListener("click", function () {
    iframe.classList.toggle("show");

    if (iframe.classList.contains("show")) {
      try {
        iframe.contentWindow?.localStorage?.removeItem("chat-history");
      } catch {}

      if (window.gtag) window.gtag("event", "chat_opened");
      if (window.mixpanel) window.mixpanel.track("Chat Opened");
      console.log("[ChatPlugin] Chat opened");
    }
  });

  // 🕓 Auto-open after idle
  let idleTimeout;
  function startIdleTimer() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      if (!iframe.classList.contains("show")) iframe.classList.add("show");
    }, idleDelay);
  }
  ["mousemove", "keydown", "touchstart"].forEach((e) =>
    document.addEventListener(e, startIdleTimer)
  );
  startIdleTimer();

  console.log("[ChatPlugin] loaded with token:", token);
})();
