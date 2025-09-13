  
  
    (function initParticles() {
      if (!window.particlesJS) return;

      const fallback = {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 900 } },
          color: { value: ["#4dd0ff", "#ff4d6d", "#8a7dff"] },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: "#7aa2ff", opacity: 0.25, width: 1 },
          move: { enable: true, speed: 1.6, out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
          modes: { grab: { distance: 180, line_linked: { opacity: 0.35 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      };

      fetch('particles.json', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(cfg => window.particlesJS('particles-js', cfg))
        .catch(() => window.particlesJS('particles-js', fallback));
    })();

    const statusText = document.getElementById("status");
    const synth = window.speechSynthesis;

    let preferredVoice = null;
    function pickVoice() {
      const voices = synth.getVoices();

      preferredVoice =
        voices.find(v => /english/i.test(v.lang) && /male|daniel|george|david|microsoft|google/i.test(v.name)) ||
        voices.find(v => /en-US|en-GB/i.test(v.lang)) ||
        voices[0] || null;
    }
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = pickVoice;
    }
    pickVoice();

    function speak(text) {
      if (!text) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = preferredVoice || null;
      utter.lang = "en-US";
      utter.pitch = 1.0;
      utter.rate = 0.95;
      synth.cancel(); 
      synth.speak(utter);
    }

 
    function factorial(n) {
      if (n < 0) return null;
      if (n <= 1) return 1;
      let f = 1;
      for (let i = 2; i <= n; i++) f *= i;
      return f;
    }
    const degToRad = deg => deg * Math.PI / 180;


    function computeCommand(command) {
      // Add
      let m;
      m = command.match(/\badd (\d+\.?\d*) (?:and|to) (\d+\.?\d*)\b/);
      if (m) return `The result of addition is ${parseFloat(m[1]) + parseFloat(m[2])}.`;

      // Subtract: "subtract 4 from 10"
      m = command.match(/\bsubtract (\d+\.?\d*) from (\d+\.?\d*)\b/);
      if (m) return `The result of subtraction is ${parseFloat(m[2]) - parseFloat(m[1])}.`;

      // Multiply
      m = command.match(/\bmultiply (\d+\.?\d*) (?:and|by) (\d+\.?\d*)\b/);
      if (m) return `The result of multiplication is ${parseFloat(m[1]) * parseFloat(m[2])}.`;

      // Divide
      m = command.match(/\bdivide (\d+\.?\d*) by (\d+\.?\d*)\b/);
      if (m) {
        const divisor = parseFloat(m[2]);
        if (divisor === 0) return "Error, division by zero.";
        return `The result of division is ${parseFloat(m[1]) / divisor}.`;
      }

      // Power: support "power 2 to 3", "2 raised to 3", "2 to the power of 3"
      m = command.match(/\bpower (\d+\.?\d*) (?:to|of) (\d+\.?\d*)\b/);
      if (!m) m = command.match(/\b(\d+\.?\d*) (?:raised to|to the power of) (\d+\.?\d*)\b/);
      if (m) {
        const base = parseFloat(m[1]), exp = parseFloat(m[2]);
        return `The result of ${base} raised to the power ${exp} is ${Math.pow(base, exp)}.`;
      }

      // Square root
      m = command.match(/\bsquare root of (\d+\.?\d*)\b/);
      if (m) {
        const n = parseFloat(m[1]);
        if (n < 0) return "Error, negative input for square root.";
        return `The square root of ${n} is ${Math.sqrt(n)}.`;
      }

      // Factorial
      m = command.match(/\bfactorial of (\d+)\b/);
      if (m) {
        const n = parseInt(m[1], 10);
        const f = factorial(n);
        if (f === null) return "Error, factorial of negative number not defined.";
        return `The factorial of ${n} is ${f}.`;
      }

      // Trig (degrees)
      m = command.match(/\b(?:sine|sin) of (\d+\.?\d*) degrees?\b/);
      if (m) {
        const deg = parseFloat(m[1]);
        return `The sine of ${deg} degrees is ${Math.sin(degToRad(deg)).toFixed(6)}.`;
      }
      m = command.match(/\b(?:cosine|cos) of (\d+\.?\d*) degrees?\b/);
      if (m) {
        const deg = parseFloat(m[1]);
        return `The cosine of ${deg} degrees is ${Math.cos(degToRad(deg)).toFixed(6)}.`;
      }
      m = command.match(/\b(?:tangent|tan) of (\d+\.?\d*) degrees?\b/);
      if (m) {
        const deg = parseFloat(m[1]);
        return `The tangent of ${deg} degrees is ${Math.tan(degToRad(deg)).toFixed(6)}.`;
      }

      return null;
    }


    const WAKE_WORDS = ["pulse"]; // add "jarvis", "friday" if you want
    const STRICT_PHRASES = false; // set to true to require exact phrases like "open google" (so "google" alone won't work)

    const allowedCommands = [
      // math keywords (loose: computeCommand has strict regex anyway)
      "add", "subtract", "multiply", "divide",
      "power", "raised to", "to the power of",
      "square root", "factorial",
      "sine", "cosine", "tangent", "sin", "cos", "tan",

      // utilities
      "notepad",
      "status report", "status",
      "shutdown",
      "instagram",
      "youtube",
      "open google",
      "what's the time", "what is the time",
      "change background",

      "tell me a joke",
      "tell me a fact",
      "motivate me",
      "self destruct"
    ];

    function isAllowedCommand(cmd) {
      if (STRICT_PHRASES) {
        
        return allowedCommands.some(kw => cmd.includes(kw));
      } else {
        
        if (computeCommand(cmd)) return true;
        return allowedCommands.some(kw => cmd.includes(kw.split(' ')[0])); 
      }
    }

    /* ---------------- Speech Recognition lifecycle ----------------- */
    function startListening() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        statusText.textContent = "SpeechRecognition not supported.";
        speak("Speech recognition is not supported in this browser.");
        return;
      }

    //   const recognition = new SR();
    //   recognition.lang = "en-US";
    //   recognition.interimResults = false;
    //   recognition.maxAlternatives = 1;

    //   recognition.onstart = () => {
    //     statusText.textContent = "Listening…";
    //   };

    //   recognition.onresult = (event) => {
    //     let transcript = (event.results?.[0]?.[0]?.transcript || "").toLowerCase().trim();
    //     statusText.textContent = `You said: "${transcript}"`;

    //     // Wake word gating
    //     const wakeHit = WAKE_WORDS.find(w => transcript.startsWith(w));
    //     if (!wakeHit) {
    //       speak(`Please start your command with '${WAKE_WORDS[0]}'.`);
    //       return;
    //     }

    //     // Remove wake word + any immediate comma/space
    //     let command = transcript.replace(new RegExp(`^${wakeHit}[, ]*`), "").trim();
    //     if (!command) {
    //       speak("Awaiting your command.");
    //       return;
    //     }

    //     // Restrict to allowed commands
    //     if (!isAllowedCommand(command)) {
    //       speak("Command not recognized or not allowed, ma'am.");
    //       return;
    //     }

    //     // Try math first (exact parsing)
    //     const mathResponse = computeCommand(command);
    //     if (mathResponse) {
    //       speak(mathResponse);
    //       return;
    //     }

    //     // ----- Non-math commands -----
    //     if (command.includes("notepad")) {
    //       speak("Opening Notepad.");
    //       window.open("https://anotepad.com/", "_blank");
    //       return;
    //     }

    //     if (command.includes("status report") || command === "status") {
    //       speak("All systems are functional, ma'am.");
    //       return;
    //     }

    //     if (command.includes("shutdown")) {
    //       speak("Powering down in 3, 2, 1...");
    //       return;
    //     }

    //     if (command.includes("instagram")) {
    //       speak("Opening your Instagram profile, ma'am.");
    //       window.open("https://instagram.com/soumyaa_24/", "_blank");
    //       return;
    //     }

    //     if (command.includes("youtube")) {
    //       speak("Opening YouTube.");
    //       window.open("https://youtube.com", "_blank");
    //       return;
    //     }

    //     if (command.includes("open google") || (!STRICT_PHRASES && command.includes("google"))) {
    //       speak("Opening Google.");
    //       window.open("https://google.com", "_blank");
    //       return;
    //     }

    //     if (command.includes("what's the time") || command.includes("what is the time")) {
    //       const time = new Date().toLocaleTimeString();
    //       speak("The time is " + time);
    //       return;
    //     }

    //     if (command.includes("change background")) {
    //       document.body.style.background = "radial-gradient(1200px 800px at 25% -200px, #2a1e2d 0%, #1b1320 45%, #101419 100%)";
    //       speak("Background changed.");
    //       return;
    //     }

    //     if (command.includes("tell me a joke")) {
    //       const jokes = [
    //         "You know what moon is more beautiful than you !! just joking haha",
    //         "I told my computer I needed a break, and it started installing updates.",
    //         "There are 10 kinds of people: those who understand binary and those who don't."
    //       ];
    //       const joke = jokes[Math.floor(Math.random() * jokes.length)];
    //       speak(joke);
    //       return;
    //     }

    //     if (command.includes("make me feel special")) {
    //       const pickupLines = [
    //         "The most intelligent women with a perfect smile  is in front of me!",
    //         "Even the Moon has some imperfection but you . You aree justt perfect ",
    //         "Octopuses have three hearts so what the most beautiful heart is still inside you!!"
    //       ];
    //       const pickupLine = pickupLines[Math.floor(Math.random() * pickupLines.length)];
    //       speak(pickupLine);
    //       return;
    //     }

    //     if (command.includes("motivate me")) {
    //       const quotes = [
    //         "Believe you can and you're halfway there.",
    //         "Your limitation is only your imagination.",
    //         "Small steps every day lead to big results."
    //       ];
    //       const quote = quotes[Math.floor(Math.random() * quotes.length)];
    //       speak(quote);
    //       return;
    //     }

    //     if (command.includes("self destruct")) {
    //       let count = 5;
    //       const timer = setInterval(() => {
    //         if (count >= 0) {
    //           speak(String(count));
    //           count--;
    //         } else {
    //           clearInterval(timer);
    //           speak("Boom. Just kidding, ma'am.");
    //         }
    //       }, 1000);
    //       return;
    //     }

   
    //     speak("Sorry, ma'am. Can you repeat that again?");
    //   };

    //   recognition.onerror = (e) => {
    //     console.error(e);
    //     statusText.textContent = "Recognition error.";
    //     speak("Sorry, I didn't catch that.");
    //   };

    //   recognition.onend = () => {
    //     statusText.textContent = "IDLE";
    //   };

    //   recognition.start();
    // }

    
    // document.getElementById("startButton").addEventListener("click", () => {
    //   speak("Hello. Welcome back, ma'am. Initializing PULSE.");
    //   setTimeout(startListening, 700);
    //   statusText.textContent = "ARMED";
    // });
