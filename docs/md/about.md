# About YaBRI

YaBRI is an interactive JavaScript Read-Eval-Print Loop (REPL) component designed as a reusable and embeddable web component. It provides a powerful and isolated environment for executing JavaScript code directly within web applications. Leveraging modern web component standards, YaBRI offers a self-contained and easily integrated solution for developers and educators alike.

---

## Key Features

* **No Backend Dependencies:** A significant architectural advantage of YaBRI is its **complete lack of backend dependencies**. The entire REPL functionality, including code execution and linting, operates entirely within the user's browser. This makes it highly portable and ensures it will function seamlessly even in environments with strict network restrictions that might block remote operations.
* **Encapsulated REPL Environment:** YaBRI neatly encapsulates the entire REPL functionality, including input handling, output display, command history, and integration with a JavaScript interpreter (Neil Fraser's). This encapsulation ensures that the REPL operates independently without interfering with the host application's JavaScript environment.
* **Multiline Input Handling:** Unlike traditional REPLs that often rely on `textarea` elements, YaBRI employs a clever and unique design using **multiple individual `input` elements** to manage multiline input. This approach not only provides a more consistent and visually appealing REPL experience but also aligns more closely with the look and feel of typical command-line interfaces, enhancing user familiarity.
* **Command History:** YaBRI maintains a history of executed commands, allowing users to navigate back and forth using keyboard shortcuts (`Ctrl + Up/Down Arrow` or `Cmd + Up/Down Arrow`).
* **Clipboard Integration for Multiline Paste:** The paste functionality (`Ctrl + V` or `Cmd + V`) automatically handles multiline text from the clipboard, inserting each line into the REPL as a separate input, streamlining the process of testing larger code segments.
* **Session Persistence:** Users can save the entire REPL session (input and output history) to a JSON file (`Ctrl + D` or `Cmd + D`), enabling them to preserve their work and revisit it later. Similarly, the REPL can be programmatically initialized or reset to a specific state using a JSON object (`Ctrl + S` or `Cmd + S`).
* **Code Linting with JSHint:** Integrated code linting using JSHint provides immediate feedback on potential syntax errors and code quality issues before execution. This feature aids in learning and helps developers identify problems early in the coding process.
* **Asynchronous API Injection with Deep Object Recognition:** YaBRI supports the dynamic injection of custom JavaScript APIs into the interpreter's global scope. Its design automatically recognizes APIs provided as complex JavaScript objects with **any level of nesting**, making it exceptionally versatile for extending the REPL's capabilities with sophisticated, domain-specific functionalities.
* **Comprehensive Event Emission for Enhanced Integration:** A significant aspect of YaBRI is its comprehensive event-driven architecture. The component **emits detailed custom events for virtually every user interaction and system action**, including information about the triggering elements, the type of action performed, and the current state of the REPL. This rich event stream allows the hosting application to:
    * **Develop Advanced Analytics:** Track user behavior and REPL usage patterns.
    * **Implement Automated Support:** Trigger contextual help or guidance based on user actions.
    * **Inform Generative AI:** Provide nuanced context to AI assistants for more effective user support and code generation.
* **Clear Input/Output Distinction:** The REPL visually distinguishes between user input, standard output, errors, logs, and warnings, making it easy to follow the flow of execution and identify different types of results.
* **Selectable and Copyable Content:** Users can easily select and copy both input and output blocks (including errors, logs, and warnings) with a simple click on the line's indicator, facilitating the sharing and reuse of code and results.
* **File Upload Capability:** The ability to upload `.json` or `.js` files (`Ctrl + U` or `Cmd + U`) allows users to quickly load and execute code directly from local files, further enhancing its utility for development and testing.
* **Sandboxed Execution with Robust Error Handling:** Utilizing a separate JavaScript interpreter ensures that the executed code runs in a **secure and isolated sandboxed environment**, preventing any potential interference with the host application or the user's system. Furthermore, YaBRI is designed to **internally handle dangerous and potentially malicious code, such as infinite loops**, ensuring a safe space for experimentation, particularly beneficial for learners and less experienced developers who might be exploring the boundaries of the language.

---

## Event Emission

YaBRI provides a rich set of custom events that allow the embedding application to monitor and react to various actions and state changes within the REPL. These events offer detailed context about user interactions and system activities, enabling advanced integration possibilities.

Here's a breakdown of the events emitted by YaBRI:

### Editor Events

These events relate to user interactions within the code input area and session management.

* `pasteText`: Emitted when text is pasted into the input field. The event `detail` might contain the pasted text.
* `fileUpload`: Emitted when a file is uploaded (typically `.json` or `.txt`). The event `detail` will include information about the uploaded file.
* `getCode`: Emitted when code is extracted from the REPL editor. The event `detail` will include information about the operation.
* `setCode`: Emitted when a is inserted into the REPL editor and executed. The event `detail` will include information about the operation.
* `saveCode`: Emitted when the user initiates saving the code of the REPL session. The event `state` property will contain the `JS` string of the saved code.
* `clearSession`: Emitted when the user or the application clears the entire REPL session.
* `getSession`: Emitted when the REPL's current state (input and output history) is requested. The event `state` property will contain the serialized state.
* `setSession`: Emitted after the REPL's state is set programmatically. The event `state` property will contain the lines of text used to set the state.
* `saveSession`: Emitted when the user initiates saving the REPL session. The event `state` property will contain the JSON string of the saved session data.

### Linter Events

These events are related to the code quality checking (linting) process.

* `codeQualityCheck`: Emitted after the JSHint linter has analyzed the code in the input. The event `detail` might contain the linting results (errors and warnings).

### Interpreter Events

These events occur in relation to the execution of JavaScript code.

* `codeExecution`: Emitted after the REPL attempts to execute the code entered by the user. The event `detail` could contain information about the execution result (e.g., success or failure).

### Host Events

These events involve interactions initiated by the embedding application.

* `injectApi`: Emitted after a JavaScript API object has been successfully injected into the interpreter's global context.
* `removeApi`: Emitted after a previously injected API is removed from the REPL interpreter global context.
* `removeAllApis`: Emitted after all previously injected APIs are removed from the REPL interpreter global context.

### Copy Events

These events are triggered when a user copies content from different sections of the REPL output.

* `inputCopy`: Emitted when the user copies the content of an input block.
* `outputCopy`: Emitted when the user copies the content of a standard output block.
* `exceptionCopy`: Emitted when the user copies the content of an exception block.
* `logCopy`: Emitted when the user copies the content of a log message block.
* `warningCopy`: Emitted when the user copies the content of a warning message block.
* `errorCopy`: Emitted when the user copies the content of an error message block.

### Event Object Structure

Each emitted event is a standard CustomEvent object. The `getEvent()` function provides a base structure, and event-specific data is added as needed when the event is triggered. Key properties you can expect to find in these events include:

* `event`: A string representing the name of the event (as listed above).
* `type`: A string indicating the functional area or module within the YaBRI that generated the event (e.g., `'editor'`, `'linter'`, `'interpreter'`, `'host'`).
* `source`: A string indicating who or what triggered the event (e.g., `'user'` for user actions, `'system'` for internal REPL processes).
* `origin`: A string indicating the source component of the event, consistently `'repl'` for this YaBRI component, helping to differentiate it from other components' events in a larger system.
* `timestamp`: A numerical value representing the time the event occurred (typically a Unix timestamp in milliseconds).
* `state`: An object used to hold event-specific state information. This is often populated by the function triggering the event (e.g., in `getState`, `setState`, and `saveSession` events).

By attaching event listeners to the YaBRI component in your embedding application, you can effectively monitor user interactions, track the REPL's state, and build custom functionalities that enhance the user experience, leveraging the specific data provided within the event object for each event.

---

## Potential Uses

YaBRI's features and design make it a valuable tool for various educational and development purposes:

* **Educational Tool:** Students learning JavaScript can use YaBRI to interactively experiment with code snippets, understand language concepts, and receive immediate feedback on their syntax and logic. The code linting feature can further aid in learning best practices.
* **Development Prototyping and Testing:** Developers can quickly prototype and test JavaScript functions and modules in an isolated environment without the need for a full project setup. The automatic API recognition simplifies the integration of complex testing utilities. The detailed event emission can be leveraged for automated testing and analysis.
* **Interactive Documentation:** YaBRI can be embedded in documentation to provide live, interactive examples of code, allowing users to experiment directly with the documented features. 
* **Debugging Aid:** While not a full-fledged debugger, YaBRI can be used to quickly test hypotheses and inspect the behavior of JavaScript code snippets in isolation, aiding in the debugging process. The detailed event information can provide valuable insights into the execution flow.
* **Code Sharing and Collaboration:** The ability to save and copy sessions makes it easy to share code snippets and their output with others for collaboration or demonstration purposes.

---

YaBRI is designed to be a user-friendly, powerful, and versatile interactive JavaScript environment that enhances both learning and development workflows. It emphasizes usability, seamless integration, and reusability across diverse web applications, with the aim to support advanced analytics and AI-powered assistance.