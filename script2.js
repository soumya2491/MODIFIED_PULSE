 particlesJS.load('particles-js', 'particles.json');

    const statusText = document.getElementById("status");
    const synth = window.speechSynthesis;

    // Speak text, then run callback AFTER speech ends
    function speakAndThen(text, callback) {
      const utter = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      utter.voice = voices.find(v => v.name.includes("male") || v.name.includes("Google") || v.name.includes("Microsoft")) || voices[0];
      utter.lang = "en-US";
      utter.pitch = 1.0;  // natural pitch
      utter.rate = 1.0;   // natural rate

      utter.onend = () => {
        setTimeout(callback, 300); // small delay before callback
      };

      synth.speak(utter);
    }

    function factorial(n) {
      if (n < 0) return null;
      if (n === 0 || n === 1) return 1;
      let fact = 1;
      for (let i = 2; i <= n; i++) fact *= i;
      return fact;
    }

    function degToRad(deg) {
      return deg * Math.PI / 180;
    }

    function computeCommand(command) {
      command = command.toLowerCase();

      let addMatch = command.match(/add (\d+\.?\d*) (and|to) (\d+\.?\d*)/);
      if (addMatch) {
        let res = parseFloat(addMatch[1]) + parseFloat(addMatch[3]);
        return `The result of addition is ${res}`;
      }

      let subMatch = command.match(/subtract (\d+\.?\d*) from (\d+\.?\d*)/);
      if (subMatch) {
        let res = parseFloat(subMatch[2]) - parseFloat(subMatch[1]);
        return `The result of subtraction is ${res}`;
      }

      let mulMatch = command.match(/multiply (\d+\.?\d*) (and|by) (\d+\.?\d*)/);
      if (mulMatch) {
        let res = parseFloat(mulMatch[1]) * parseFloat(mulMatch[3]);
        return `The result of multiplication is ${res}`;
      }

      let divMatch = command.match(/divide (\d+\.?\d*) by (\d+\.?\d*)/);
      if (divMatch) {
        let divisor = parseFloat(divMatch[2]);
        if (divisor === 0) return "Error, division by zero.";
        let res = parseFloat(divMatch[1]) / divisor;
        return `The result of division is ${res}`;
      }

      let powMatch = command.match(/(power|raised to) (\d+\.?\d*) (to|of) (\d+\.?\d*)/);
      if (powMatch) {
        let base = parseFloat(powMatch[2]);
        let exp = parseFloat(powMatch[4]);
        let res = Math.pow(base, exp);
        return `The result of ${base} raised to the power ${exp} is ${res}`;
      }

      let sqrtMatch = command.match(/square root of (\d+\.?\d*)/);
      if (sqrtMatch) {
        let num = parseFloat(sqrtMatch[1]);
        if (num < 0) return "Error, negative input for square root.";
        return `The square root of ${num} is ${Math.sqrt(num)}`;
      }

      // let factMatch = command.match(/factorial of (\d+)/);
      // if (factMatch) {
      //   let n = parseInt(factMatch[1]);
      //   let f = factorial(n);
      //   if (f === null) return "Error, factorial of negative number not defined.";
      //   return `The factorial of ${n} is ${f}`;
      // }

      // let sinMatch = command.match(/sine of (\d+\.?\d*) degrees?/);
      // if (sinMatch) {
      //   let deg = parseFloat(sinMatch[1]);
      //   return `The sine of ${deg} degrees is ${Math.sin(degToRad(deg)).toFixed(6)}`;
      // }

      // let cosMatch = command.match(/cosine of (\d+\.?\d*) degrees?/);
      // if (cosMatch) {
      //   let deg = parseFloat(cosMatch[1]);
      //   return `The cosine of ${deg} degrees is ${Math.cos(degToRad(deg)).toFixed(6)}`;
      // }

      // let tanMatch = command.match(/tangent of (\d+\.?\d*) degrees?/);
      // if (tanMatch) {
      //   let deg = parseFloat(tanMatch[1]);
      //   return `The tangent of ${deg} degrees is ${Math.tan(degToRad(deg)).toFixed(6)}`;
      // }

      return null;
    }

    function executeCommand(command) {
      const mathResponse = computeCommand(command);
      if (mathResponse) {
        speakAndThen(mathResponse, () => {});
        return;
      }

      if (command.includes("notepad")) {
        speakAndThen("Opening Notepad", () => {
          window.open("https://anotepad.com/", "_blank");
        });
      } else if (command.includes("status report") || command.includes("status")) {
        speakAndThen("All systems are functional, ma'am.", () => {});
      } else if (command.includes("shutdown")) {
        speakAndThen("Powering down in 3, 2, 1...", () => {});
      } else if (command.includes("instagram")) {
        speakAndThen("Opening your Instagram profile, ma'am.", () => {
          window.open("https://instagram.com/soumyaa_24/", "_blank");
        });
      } else if (command.includes("youtube")) {
        speakAndThen("Opening YouTube", () => {
          window.open("https://youtube.com", "_blank");
        });
      } else if (command.includes("open google")) {
        speakAndThen("Opening Google", () => {
          window.open("https://google.com", "_blank");
        });
      } else if (command.includes("what's the time") || command.includes("what is the time")) {
        const now = new Date();
        const time = now.toLocaleTimeString();
        speakAndThen("The time is " + time, () => {});
      } else if (command.includes("change background")) {
        document.body.style.background = "radial-gradient(circle, #001133, #000000)";
        speakAndThen("Background changed", () => {});
      } else {
        speakAndThen("Sorry, I didn't understand that command.", () => {});
      }
    }

    function startListening() {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        statusText.textContent = "Listening...";
      };

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        statusText.textContent = `You said: "${command}"`;

        executeCommand(command);

        recognition.stop();
      };

      recognition.onerror = (event) => {
        statusText.textContent = "Recognition error: " + event.error;
        speakAndThen("Sorry, ma'am. Can you please repeat that?", () => {});
        recognition.stop();
      };

      recognition.start();
    }

    document.getElementById("startButton").addEventListener("click", () => {
      // Speak greeting first, then start listening after speech ends
      speakAndThen("HELLO Welcome back, ma'am. Initializing PULSE.", startListening);
    });

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {};
    }