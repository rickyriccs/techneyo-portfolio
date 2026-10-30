<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- Critical for mobile rendering & scaling -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Direct Web-to-Mobile Call</title>
  <style>
    /* Fixed universal selector */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f7f9fa;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      min-height: 100dvh;
      padding: 16px;
    }

    /* Card container */
    .call-wrapper {
      width: 100%;
      max-width: 580px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    /* Responsive Call Button */
    #callBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      max-width: 320px;
      padding: 16px 24px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      background-color: #0b7285;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(11, 114, 133, 0.3);
      transition: background-color 0.2s ease, transform 0.1s ease;
      -webkit-tap-highlight-color: transparent;
    }

    #callBtn:active {
      transform: scale(0.98);
      background-color: #085260;
    }

    #status {
      margin-top: 14px;
      font-size: 0.95rem;
      color: #555;
      min-height: 22px;
      padding: 0 10px;
    }

    /* Embedded Call Frame Container */
    .frame-container {
      display: none;
      width: 100%;
      position: relative;
      margin-top: 16px;
      border-radius: 16px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    #wherebyFrame {
      width: 100%;
      height: 540px;
      border: none;
      display: block;
    }

    /* Optional exit button for mobile users */
    #endBtn {
      display: none;
      margin-top: 12px;
      background: transparent;
      color: #e03131;
      border: 1px solid #e03131;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 0.9rem;
      cursor: pointer;
      font-weight: 500;
    }

    /* Mobile Screen Adaptations (≤ 600px) */
    @media (max-width: 600px) {
      body {
        padding: 12px;
      }

      .call-wrapper {
        width: 100%;
      }

      #callBtn {
        max-width: 100%;
        padding: 16px 20px;
        font-size: 1rem;
      }

      #wherebyFrame {
        height: 75dvh;
        min-height: 420px;
      }

      .frame-container {
        border-radius: 12px;
      }
    }
  </style>
</head>
<body>

  <div class="call-wrapper">
    <button id="callBtn" onclick="initiateCall()">
      <span>📞</span>
      <span>Call Now (Voice Only)</span>
    </button>

    <div id="status"></div>

    <div class="frame-container" id="frameBox">
      <iframe
        id="wherebyFrame"
        allow="camera; microphone; fullscreen; speaker; display-capture">
      </iframe>
    </div>

    <button id="endBtn" onclick="endCall()">Close Call Window</button>
  </div>

  <script>
    // Only your worker URL is needed in the frontend
    const WORKER_URL = "https://call.techneyosolutions.workers.dev";

    function initiateCall() {
      const status = document.getElementById("status");
      status.innerText = "Connecting call and alerting mobile...";

      // Hide call button while connecting
      document.getElementById("callBtn").style.display = "none";

      // Request the call room and trigger Telegram alert via Cloudflare Worker
      fetch(WORKER_URL, { method: "POST" })
              .then(res => res.json())
              .then(data => {
                if (data.success && data.roomUrl) {
                  status.innerText = "Connected! Ringing host...";

                  // Set the dynamic room URL received from Cloudflare
                  document.getElementById("wherebyFrame").src = data.roomUrl;

                  // Display the call frame & close button
                  document.getElementById("frameBox").style.display = "block";
                  document.getElementById("endBtn").style.display = "inline-block";
                } else {
                  status.innerText = "Failed to connect. Please try again.";
                  document.getElementById("callBtn").style.display = "inline-flex";
                }
              })
              .catch(() => {
                status.innerText = "Network error. Please try again.";
                document.getElementById("callBtn").style.display = "inline-flex";
              });
    }

    function endCall() {
      const frame = document.getElementById("wherebyFrame");
      frame.src = ""; // Stops audio and releases microphone
      document.getElementById("frameBox").style.display = "none";
      document.getElementById("endBtn").style.display = "none";
      document.getElementById("status").innerText = "";
      document.getElementById("callBtn").style.display = "inline-flex";
    }
  </script>

</body>
</html>