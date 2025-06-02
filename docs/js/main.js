/**
 * @file main.js
 * @author [Sokratis Karkalas] <s.karkalas@derby.ac.uk>
 * @created [May, 2025]
 * @description This is the main script that initializes the web-based REPL
 * application once the DOM is fully loaded. It interacts with the
 * <yabri-terminal> custom element to inject APIs, configure linting options,
 * and set up global event listeners to log REPL-related events.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await customElements.whenDefined("yabri-terminal");
  /*
   ************************************************************************
   **  --- API Injection Demo REPL Configuration ---
   ************************************************************************
   **/
  const apiDemoRepl = document.getElementById("api-demo-repl");

  const licenseLink = document.getElementById("license-link");

  if (licenseLink) {
    // Add a click event handler to intercept the link click
    licenseLink.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent the default link behavior (opening the file in a new tab)
      try {
        // 1. Fetch the Markdown content
        const response = await fetch(licenseLink.href);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} fetching ${licenseLink.href}`
          );
        }
        const markdownContent = await response.text();

        // 2. Convert Markdown to HTML using marked.js
        // This creates an HTML string (e.g., "<h1>Title</h1><p>Content</p>")
        const htmlRenderedContent = marked.parse(markdownContent);

        // 3. Create a temporary element to strip HTML and get pure text
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlRenderedContent;
        const pureTextContent = tempDiv.textContent || tempDiv.innerText; // Get pure text, supporting older browsers

        // 4. Pass the pure text content to apiDemoRepl.displayMessage()
        apiDemoRepl.displayMessage(pureTextContent);
      } catch (error) {
        console.error(
          "Error loading or displaying license as pure text:",
          error
        );
        apiDemoRepl.displayMessage(
          `Error displaying license: ${error.message}`
        );
      }
    });
  } else {
    console.warn("License link with ID 'license-link' not found in the DOM.");
  }
  const apiCodeEditor = document.getElementById("api-code-editor");
  const injectApiBtn = document.getElementById("inject-api-btn");
  const removeApiBtn = document.getElementById("remove-api-btn");
  const apiEditorMessage = document.getElementById("api-editor-message");
  //add event listeners for inject and remove API
  apiDemoRepl.addEventListener("injectApi", (event) => {
    const data = event.detail;
    console.log(data);
  });
  apiDemoRepl.addEventListener("removeApi", (event) => {
    const data = event.detail;
    console.log(data);
  });
  //select all command buttons
  const commandButtons = document.querySelectorAll(".command-btn");
  //select info button
  const infoBtn = document.getElementById("repl-info-btn");
  //define the API object as a string for pre-population
  const initialApiCode = `
{
  utils: {
    formatDate: (year, month, day) => {
      const pad = (num) => num < 10 ? '0' + num : num;
      return year + '-' + pad(month) + '-' + pad(day);
    },
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  },
  data: {
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ],
    getUsers: function() { return this.users; },
    findUserById: function(id) { return this.users.find(u => u.id === id); }
  },
  config: {
    version: '1.0.0',
    debugMode: true
  }
}`;
  if (
    apiDemoRepl &&
    apiCodeEditor &&
    injectApiBtn &&
    removeApiBtn &&
    apiEditorMessage &&
    commandButtons &&
    commandButtons.length > 0 &&
    infoBtn
  ) {
    //add event listener for the info button
    if (infoBtn) {
      infoBtn.addEventListener("click", () => {
        apiDemoRepl.displayInfo();
      });
    }
    //pre-populate the textarea
    apiCodeEditor.value = initialApiCode.trim();
    //update linting configuration to recognize the 'app' global
    apiDemoRepl.setLintConfig({
      options: {
        esversion: 5,
        undef: false,
        unused: false,
        expr: true,
        trailingcomma: false,
        strict: false,
        singleGroups: false,
        nonew: false,
        nocomma: false,
        curly: false,
        asi: true,
        boss: false,
        debug: true,
        elision: true,
        eqnull: true,
        evil: false,
        loopfunc: false,
      },
      predef: {
        app: false,
      },
    });
    // console.log(
    //   "linting config set for #api-demo-repl, including 'app' as a predef global."
    // );
    //define e function for injection
    const injectCurrentApi = () => {
      const result = apiDemoRepl.injectApi("app", apiCodeEditor.value);
      apiEditorMessage.textContent = result.message;
      apiEditorMessage.style.color = result.success
        ? "var(--log-color)"
        : "var(--error-color)";
    };
    //inject the API on initial load
    injectCurrentApi();
    //add event listener to the inject API button
    injectApiBtn.addEventListener("click", injectCurrentApi);
    //add event listener to the remove API button
    removeApiBtn.addEventListener("click", () => {
      const result = apiDemoRepl.removeApi("app");
      apiEditorMessage.textContent = result.message;
      apiEditorMessage.style.color = result.success
        ? "var(--log-color)"
        : "var(--error-color)";
    });
    commandButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const command = button.dataset.command;
        if (apiDemoRepl && command) {
          const result = apiDemoRepl.insertAndExecuteCode(command);
          apiEditorMessage.textContent = result.message;
          apiEditorMessage.style.color = result.success
            ? "var(--log-color)"
            : "var(--error-color)";
        }
      });
    });
  } else {
    console.error(
      "one or more API injection demo elements not found (api-demo-repl, api-code-editor, inject-api-btn, api-editor-message)."
    );
  }

  /*
   ************************************************************************
   **  --- Event Listener Showcase REPL Configuration ---
   ************************************************************************
   **/
  const eventDemoRepl = document.getElementById("event-demo-repl");
  const eventLogContainer = document.getElementById("event-log-container");
  if (eventDemoRepl && eventLogContainer) {
    //initial placeholder text for the textarea
    eventLogContainer.value =
      "Events will appear here as you interact with the REPL above.\n";
    //define a maximum number of lines for the log to prevent it from growing indefinitely
    const MAX_LOG_LINES = 500;
    //function to format and append a new event entry to the textarea
    const appendEventToLog = (eventDetail) => {
      const data = eventDetail; //use the event.detail directly for cleaner access
      const eventDate = new Date(data.timestamp);
      //format time with milliseconds for precise logging
      const timeString =
        eventDate.toLocaleTimeString() +
        "." +
        String(eventDate.getMilliseconds()).padStart(3, "0");
      let stateString = "";
      try {
        //safely stringify the 'state' or 'detail' object from the event
        stateString = JSON.stringify(data.state || data, null, 2);
      } catch (e) {
        //fallback for circular references or other stringify errors
        stateString = `[unstringifiable data: ${e.message}]`;
      }
      //construct the single log entry string
      const logEntry = `
[${timeString}] Event: ${data.event || eventDetail.type || "Unknown"} (Type: ${
        data.type || "N/A"
      }) (Source: ${data.source || "N/A"})
Origin: ${data.origin || "N/A"} | ID: ${data.id || "N/A"}
Data/State:
${stateString}
----------------------------------------
`; //add a separator for clarity between entries
      //prepend the new entry to the textarea's value
      eventLogContainer.value = logEntry + eventLogContainer.value;
      //manage log size: Remove older entries if max lines are exceeded
      let lines = eventLogContainer.value.split("\n");
      if (lines.length > MAX_LOG_LINES * 5) {
        //multiply by 5 for a safer buffer, assuming multi-line entries
        //keep only the most recent lines (at the top, due to prepending)
        eventLogContainer.value = lines.slice(0, MAX_LOG_LINES * 3).join("\n"); //keep a generous number of lines
      }
      //scroll to the top to show the newest event (since we prepend)
      eventLogContainer.scrollTop = 0;
    };
    //get WebREPL's internal metadata about its elements and events
    eventDemoRepl.getMetadata().elements.forEach((elementMetadata) => {
      elementMetadata.events.forEach((eventName) => {
        // console.log(
        //   `registering event ${eventName} to event-demo-repl component`
        // );
        //attach a single event listener for each event to the document
        //this captures WebREPL's custom events which often bubble to the document
        eventDemoRepl.addEventListener(eventName, (event) => {
          //filter events: only log if the event originated from 'repl' and specifically from our demo REPL
          //using event.detail.origin is common for custom events from yabri-terminal
          if (
            event.detail &&
            event.detail.origin === "repl" &&
            event.target === eventDemoRepl
          ) {
            appendEventToLog(event.detail); //pass the detail object to our logging function
          }
        });
      });
    });
    // console.log(
    //   "event listeners attached for #event-demo-repl, logging to textarea."
    // );
  } else {
    console.error(
      "WebREPL element with ID 'event-demo-repl' or 'event-log-container' not found. Please check IDs and HTML structure."
    );
  }

  /*
   ************************************************************************
   **  --- Session Persistence Demo REPL Configuration ---
   ************************************************************************
   **/
  const initialState = `[
  {
    "type": "input",
    "content": "var numbers = [2,4,6];"
  },
  {
    "type": "input",
    "content": "numbers = numbers.map(function(number) { return number * 2; });"
  },
  {
    "type": "input",
    "content": "numbers.forEach(function(number) { print(number); });"
  }
]`;
  const persistenceDemoRepl = document.getElementById("session-demo-repl");
  const sessionCodeEditor = document.getElementById("session-code-editor");
  const saveSessionBtn = document.getElementById("save-session-btn");
  const saveCodeBtn = document.getElementById("save-code-btn");
  const loadSessionBtn = document.getElementById("load-session-btn");
  const getSessionBtn = document.getElementById("get-session-btn");
  const setSessionBtn = document.getElementById("set-session-btn");
  const getCodeBtn = document.getElementById("get-code-btn");
  const setCodeBtn = document.getElementById("set-code-btn");
  const clearSessionBtn = document.getElementById("clear-session-btn");
  const resetSessionBtn = document.getElementById("reset-session-btn");
  const sessionEditorMessage = document.getElementById(
    "session-editor-message"
  );
  function updateSessionEditorMessage(result) {
    sessionEditorMessage.textContent = result.message;
    sessionEditorMessage.style.color = result.success
      ? "var(--log-color)"
      : "var(--error-color)";
  }
  //ensure all elements are found before proceeding
  if (
    persistenceDemoRepl &&
    sessionCodeEditor &&
    saveSessionBtn &&
    saveCodeBtn &&
    loadSessionBtn &&
    getSessionBtn &&
    setSessionBtn &&
    getCodeBtn &&
    setCodeBtn &&
    clearSessionBtn &&
    resetSessionBtn &&
    sessionEditorMessage
  ) {
    //register event listeners for this REPL
    persistenceDemoRepl.addEventListener("fileUpload", (event) => {
      if (
        event.detail &&
        event.detail.origin === "repl" &&
        event.target === persistenceDemoRepl
      ) {
        console.log(event?.detail);
      }
    });
    persistenceDemoRepl.addEventListener("setSession", (event) => {
      if (
        event.detail &&
        event.detail.origin === "repl" &&
        event.target === persistenceDemoRepl
      ) {
        console.log(event?.detail);
      }
    });
    persistenceDemoRepl.addEventListener("setCode", (event) => {
      if (
        event.detail &&
        event.detail.origin === "repl" &&
        event.target === persistenceDemoRepl
      ) {
        console.log(event?.detail);
      }
    });
    //populate the session editor & the REPL
    sessionCodeEditor.value = initialState;
    const result = persistenceDemoRepl.setState(sessionCodeEditor.value);
    updateSessionEditorMessage(result);
    /*
     ** button click events
     *****************************************************
     **/
    //event listener for saving the session
    saveSessionBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.saveSession();
      updateSessionEditorMessage(result);
    });
    //event listener for saving the code
    saveCodeBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.saveCode();
      updateSessionEditorMessage(result);
    });
    //event listener for Loading session / code
    loadSessionBtn.addEventListener("click", async () => {
      const result = await persistenceDemoRepl.uploadFile();
      updateSessionEditorMessage(result);
    });
    //event listener for getting the session
    getSessionBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.getSession();
      updateSessionEditorMessage(result);
      if (result?.success) {
        sessionCodeEditor.value = JSON.stringify(result?.data, null, 2);
      }
    });
    //event listener for setting the session
    setSessionBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.setState(sessionCodeEditor.value);
      updateSessionEditorMessage(result);
    });
    //event listener for getting the code
    getCodeBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.getCode();
      updateSessionEditorMessage(result);
      if (result.success) sessionCodeEditor.value = result.code;
    });
    //event listener for setting the code
    setCodeBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.setSession(
        sessionCodeEditor.value,
        "js"
      );
      updateSessionEditorMessage(result);
    });
    //event listener for clear session
    clearSessionBtn.addEventListener("click", () => {
      const result = persistenceDemoRepl.clearSession();
      updateSessionEditorMessage(result);
    });
    //event listener for resetting to default session
    resetSessionBtn.addEventListener("click", () => {
      sessionCodeEditor.value = initialState;
      const result = persistenceDemoRepl.setSession(sessionCodeEditor.value);
      updateSessionEditorMessage(result);
    });
  } else {
    console.error(
      "one or more Session Persistence Demo elements not found. Please check IDs and HTML structure."
    );
  }
  window.scrollTo(0, 0);
});
