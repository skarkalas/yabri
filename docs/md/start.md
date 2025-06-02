# Getting Started with YaBRI

YaBRI is provided as a versatile **Web Component**, allowing for easy integration into any web application with minimal effort. This guide walks you through setting it up, interacting with its API, and customizing its behaviour.

### 1. Installation

To start using YaBRI, include its core script and required dependencies in your HTML file. All necessary files can be downloaded from the [YaBRI GitHub repository](YOUR_GITHUB_REPO_LINK_HERE).

**Step 1: Download Files**
Download the following files and folders from the project repository:

- `dist/yabri.js` (The core YaBRI Web Component bundle)
- `js/main.js` (Your application’s main script for interacting with YaBRI)
- `js/uuid.js` (Dependency for UUID generation)
- `js/marked.min.js` (Dependency for Markdown rendering)
- `js/acorn.js` (Dependency for JavaScript parsing)
- `js/interpreter.js` (Dependency for the JavaScript interpreter)
- `js/serialize.js` (Dependency for session serialization)
- `js/jshint.js` (Dependency for linting)
- `css/fontawesome.css`
- `css/solid.css`
- `css/brands.css`
- `css/main.css`

Ensure that the `md` and `webfonts` folders are also present in the root directory.

**Step 2: Include Dependencies in HTML**
Include these dependencies in your HTML file—typically within the `<head>` for stylesheets and before the closing `</body>` tag for scripts (or in the `<head>` with `defer`):

<details>
<summary>Example HTML</summary>

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap">
  <link rel="stylesheet" href="css/fontawesome.css">
  <link rel="stylesheet" href="css/solid.css">
  <link rel="stylesheet" href="css/brands.css">
  <link rel="stylesheet" href="css/main.css">
  <script src="js/uuid.js"></script>
  <script src="js/marked.min.js"></script>
  <script src="js/acorn.js"></script>
  <script src="js/interpreter.js"></script>
  <script src="js/serialize.js"></script>
  <script src="js/jshint.js"></script>
  <script src="dist/yabri.js" defer></script>
  <script src="js/main.js" defer></script>
  <title>YaBRI</title>
</head>
<body>
  <yabri-terminal history-size="20" max-memory="1048576" max-steps="10000"></yabri-terminal>
</body>
</html>
```
</details>


## 2. Embedding YaBRI

To embed YaBRI, use the custom element where you want the REPL to appear:

```
<yabri-terminal history-size="20" max-memory="1048576" max-steps="10000"></yabri-terminal>
```

**Attributes:**

- `history-size` — sets how many commands to remember.
- `max-memory` — limits memory usage.
- `max-steps` — prevents infinite loops by capping execution steps.



## 3. Configuration

Use `main.js` to configure YaBRI after it has loaded. This includes injecting APIs, setting up event listeners, and customizing behavior.

### 3.1 Wait for YaBRI to Load

Ensure the component is defined before accessing it:

```
document.addEventListener("DOMContentLoaded", async () => {
  await customElements.whenDefined("yabri-terminal");
  const yabriElement = document.querySelector("yabri-terminal");

  if (yabriElement) {
    // Your configuration code goes here
  }
});
```



### 3.2 Listening for Events

You can dynamically attach listeners to any events emitted by YaBRI:

```
yabriElement.getMetadata().elements.forEach((element) => {
  element.events.forEach((eventName) => {
    yabriElement.addEventListener(eventName, (event) => {
      const data = event.detail;
      console.log(`Event: ${eventName}`, data);
    });
  });
});
```



### 3.3 Injecting Custom APIs

To make your own JavaScript functions or objects available inside the REPL, use `injectApi()`:

```
const myAppAPI = `{
  utils: {
    formatDate: (year, month, day) => {
      const pad = (num) => (num < 10 ? "0" + num : num);
      return year + "-" + pad(month) + "-" + pad(day);
    }
  }
}`;

yabriElement.injectApi('app', myAppAPI);
```

This makes `app.utils.formatDate()` available within the YaBRI REPL.



#### 3.4 Configuring Linting

YaBRI comes with built-in linting capabilities that work out-of-the-box to provide immediate feedback on the JavaScript code entered by users. **You do not need to explicitly configure linting for it to function.**

The `setLintConfig()` method, as shown below, allows you to _customize_ the default linting rules and define global variables that the linter should recognize, accommodating the specific requirements of your implementation.

Your `main.js` can set up basic linting options and predefined globals:

```
//update linting configuration to recognize the 'app' global
yabriElement.setLintConfig({
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
```

The `setLintConfig()` method accepts an object with two properties:

- **`options` (Object):** Contains key-value pairs representing ESHint configuration options. This allows you to enable or disable specific linting rules (e.g., `esversion` for JavaScript version, `undef` to check for undefined variables).
- **`predef` (Object):** An object where keys are global variable names and values are booleans indicating if they are writable. This is crucial for telling the linter about variables that exist in the REPL's environment but aren't explicitly declared (like your injected `app` API, which you might add here as `app: false` to prevent warnings).

### 4. Public API (JavaScript Methods)

You can programmatically control the YaBRI component and integrate it deeply with your application logic using its JavaScript methods. First, get a reference to the `<yabri-terminal>` element, typically after the DOM is loaded:

```
// In your main.js or other script, after DOMContentLoaded
const repl = document.querySelector('yabri-terminal');
```

Once you have the `repl` instance, you can use the following methods:
<br>

- `injectApi(name: string, apiMap: string | object)`: Injects an `apiMap` (either a stringified JavaScript object or a native object) into the interpreter's environment, making it accessible under the specified `name`. This allows you to expose your application's backend methods or utility functions directly to the REPL user.

You can pass either a string:
```
repl.injectApi('myUtils', `{
  calculate: (a, b) => a * b
}`);
```

Or a native object:
```
repl.injectApi('myUtils', {
  calculate: (a, b) => a * b
});
```

In REPL:
```
> myUtils.calculate(5, 10)
```

<br>

- `removeApi(name: string): object:`: Removes a previously injected API from the REPL interpreter by its registered `name`. 

```
const result = repl.removeApi('app');
console.log(result);
```

<br>

- `removeAllApis():`: Removes all APIs from the interpreter (cleanup). 

```
repl.removeAllApis();
```

<br>


- `getLintConfig(): object:`: Returns the current JSHint linting configuration, including both `options` and `predef` (predefined globals). The returned objects are copies to prevent direct modification.

```
const currentLintConfig = repl.getLintConfig();
console.log(currentLintConfig.options);
```

<br>

- `setLintConfig(config: object):`: Sets the JSHint linting configuration. This method takes an object with optional `options` and `predef` properties. If the provided configuration is valid, it replaces the existing settings. (See Section 3.3 for detailed usage and configuration options).

```
repl.setLintConfig({
  options: { esversion: 2020, undef: true },
  predef: { myGlobalVar: false }
});
```

<br>

- `getMetadata(): object:`: Returns an object containing metadata about the REPL's internal structure, particularly its event system. This includes information about elements within the REPL that trigger actions and the names of those actions (events). (Used internally for dynamic event listening as shown in Section 3.1).

```
const metadata = repl.getMetadata();
console.log(metadata.elements);
```

<br>

- `insertAndExecuteCode(code: string) : object:`: Inserts a string of code into the current input prompt and executes it.

```
const result = repl.insertAndExecuteCode(code);
console.log(result);
```

<br>

- `nextStep() : object:`: Advances the REPL to the next step and incrementally executes the code in the interpreter.

```
const result = repl.nextStep();
console.log(result);
```

<br>

- `async uploadFile() : object:`: Initiates a file upload process, allowing the user to select a .json or .js file.

```
const result = await repl.uploadFile();
console.log(result);
```

<br>

- `getCode(valid: boolean) : object:`: Retrieves the code from the REPL session. If valid is true, it returns only code from input lines that were executed without an "exception" output immediately following them.

```
const result = repl.getCode(true);
console.log(result);
```

<br>

- `saveCode(valid: boolean) : object:`: Downloads the accumulated input code from the REPL session as a JavaScript file. If valid is true, it returns only code from input lines that were executed without an "exception" output immediately following them.

```
const result = repl.saveCode(true);
console.log(result);
```

<br>

- `getState(): Object:`: Retrieves the current state of the REPL, which typically includes the history of commands and outputs.

```
const result = repl.getState();
console.log(result.data);
```

<br>

- `setState(data: string, type?: 'json' | 'js'): Object:`: Sets the state of the REPL using the provided `data`. This method can be used to restore a previous session with its full execution history (`json`) or simply pre-populate the REPL with code (`js`) and execute in a single operation.

```
const result = repl.setState('console.log("Restored session!");','js');
console.log(result);
```

<br>

- `getSession(): Object:`: The same as getState.

<br>

- `setSession(data: string, type?: 'json' | 'js'): Object:`: The same as setState.

<br>

- `saveSession():`: Downloads the current REPL session, including all inputs and outputs, as a JSON file.

```
const result = repl.saveSession();
console.log(result);
```

<br>

- `clearSession():`: Clears the entire REPL session, including all displayed output and history.

```
const result = repl.clearSession();
console.log(result);
```

<br>

- `displayMessage(text: string):`: Displays a given `text` message directly in the REPL's output area. This is useful for providing custom informational messages to the user.

```
repl.displayMessage('Application initialized successfully!');
```

<br>

- `displayInfo():`: Displays a modal window with various information content (e.g., start guide, help, about, contact).

```
repl.displayInfo();
```


### 5. Events and Event Data Format & Semantics

YaBRI emits various custom events that allow your host application to react to internal REPL activities, user interactions, and status changes. By listening to these events, you can integrate YaBRI's behaviour with other parts of your application, log activity, or trigger custom workflows.

As demonstrated in Section 3.1, you can dynamically attach listeners to these events using standard DOM `addEventListener` calls, typically on the `<yabri-terminal>` element itself or the `document` object since the events are configured to bubble.

#### 5.1. Event Data Format (`event.detail`)

The data format of YaBRI events follows a specific structure designed for representing user actions and system activities within constructionist tools and open learning environments. From a conceptual viewpoint, an interactive tool with a visual component is accessible through a scene comprising elements (actors) that respond to stimuli, generating events. These elements can also include environmental entities like the system itself.

Essentially, you have a collection of elements with their respective events. The structure aims to capture user interactions and any other available activity using a data model appropriate for this conceptualization.

The format of the `event.detail` object for all YaBRI events is as follows:

- **`id`**: (Integer) An integer variable determining the ID of the entity that generated the event. This is particularly useful when there are multiple elements of the same type in the "scene" and you need to distinguish between them. In the context of YaBRI, this is typically a dynamically generated UUID value, ensuring uniqueness.
- **`type`**: (String) The type of element or entity the action was performed on—the one that generated the event. For YaBRI, this often refers to specific parts of the REPL (e.g., 'inputSelector', 'outputSelector', 'editor').
- **`event`**: (String) The specific name of the event generated (e.g., `'codeExecution'`, `'saveSession'`). This will match the event name you listen for.
- **`state`**: (Any) Any additional information or data directly related to this specific event. This payload will vary significantly depending on the `event` type and provides the contextual details (e.g., the command executed, the result, an error message).
- **`timestamp`**: (Number) The time the event was triggered, represented as a Unix timestamp (milliseconds since epoch).
- **`origin`**: (String) This represents the software component from which this event originates. This is especially useful if YaBRI is used in combination with other tools within a larger system monitoring user interaction at a higher level. For YaBRI, this is a fixed value: `'repl'`.
- **`source`**: (String) This identifies the entity that caused the event to happen. Common values include `'user'`, `'system'`, or other specific identifiers depending on the context.

Example of listening for an event with the full `detail` structure:

```
document.addEventListener('codeExecution', (event) => {
  const { id, type, event: eventName, state, timestamp, origin, source } = event.detail;
  console.log(`Event: ${eventName} from ${origin} (ID: ${id})`);
  console.log(`Source: ${source}, Type: ${type}, Time: new Date(${timestamp})`);
  console.log('Event-specific state:', state);
});
```

#### 5.2. List of Emitted Events

Here is a list of the primary events emitted by YaBRI. The **`event.detail.state`** property will contain the specific, event-relevant data as described below. All other standard properties (`id`, `event`, `timestamp`, `origin`, `source`) will always be present as per the data format defined in Section 5.1.

- **`inputCopy`**:

  - **Triggered when:** A user copies the input text from the REPL.
  - **`type`**: `'inputSelector'`
  - **`source`**: `'user'`
  - **`state`**: `{ text: string }` - The exact text that was copied from the input line.

- **`outputCopy`**:

  - **Triggered when:** A user copies output text from the REPL's output area.
  - **`type`**: `'outputSelector'`
  - **`source`**: `'user'`
  - **`state`**: `{ text: string }` - The exact text that was copied from the output.

- **`exceptionCopy`**:

  - **Triggered when:** A user copies an exception message displayed in the REPL.
  - **`type`**: `'exceptionSelector'`
  - **`source`**: `'user'`
  - **`state`**: `{ text: string }` - The exception text that was copied.

- **`logCopy`**:

  - **Triggered when:** A user copies a "log" type message from the REPL's output.
  - **`type`**: `'logSelector'`
  - **`source`**: `'user'`
  - **`state`**: `{ text: string }` - The log message text that was copied.

- **`warningCopy`**:

  - **Triggered when:** A user copies a "warning" type message from the REPL's output.
  - **`type`**: `'warningSelector'`
  - **`source`**: `'user'`
  - **`state`**: `{ text: string }` - The warning message text that was copied.

- **`errorCopy`**:

  - **Triggered when:** A user copies an "error" type message from the REPL's output.
  - **`type`**: `'errorSelector'`
  - **`source`**: `'user'`
  - **`state`**: `{ text: string }` - The error message text that was copied.

- **`codeQualityCheck`**:

  - **Triggered when:** The REPL performs a code quality (linting) check on the current input.
  - **`type`**: `'linter'`
  - **`source`**: `'system'`
  - **`state`**: `{ code: string, options: Object, error: { reason: string }, evidence: string }` - The `code` string that was evaluated, the linting `options` that were used, the `reason` this was flagged as a potential issue and the `evidence` used to justify this outcome.

- **`codeExecution`**:

  - **Triggered when:** A command is executed in the REPL.
  - **`type`**: `'interpreter'`
  - **`source`**: `'user'`
  - **`state`**: `{ code: string, output: any, error: string }` - The `code` string that was executed, its `output` (if successful), any `error` that occurred.

- **`getSession`**:

  - **Triggered when:** The REPL's internal state is requested (e.g., via `repl.getSession()` method).
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `Array<Object>` - The current array representing the REPL's state (inputs, outputs, etc.).

- **`setSession`**:

  - **Triggered when:** The REPL's state is programmatically set (e.g., via `repl.setSession()`).
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `Array<string>` - The new state that was applied to the REPL as an array of string representing lines of code inserted into the REPL editor.

- **`saveSession`**:

  - **Triggered when:** The REPL's `saveSession()` method is called, or an internal save action occurs.
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{ session: string }` - The data representing the current session that was saved.

- **`clearSession`**:

  - **Triggered when:** The REPL's `clearSession()` method is called, or an internal clear action occurs.
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{}`

- **`getCode`**:

  - **Triggered when:** The REPL's code is requested (e.g., via `repl.getCode()` method).
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{ code: string, onlyValid: boolean }` - The code in the current session with option to filter out invalid code from input prompts - given as a parameter.

- **`setCode`**:

  - **Triggered when:** The REPL's code is programmatically set (e.g., via `repl.setSession(code, 'js')`).
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{ data: Array<string>, error: string }` - The lines of code - as strings - inserted into the REPL editor.

- **`saveCode`**:

  - **Triggered when:** The REPL's `saveCode()` method is called, or an internal save action occurs.
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{ session: string }` - `{ code: string, onlyValid: boolean }` - The code saved in a file. The onlyValid is an option to filter out invalid code from input prompts - given as a parameter.

- **`fileUpload`**:

  - **Triggered when:** A file is uploaded or processed by the REPL (if such a feature is enabled internally).
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{ file: string, content: string, error: string }` - The name of the `file` uploaded and its `content`.

- **`pasteText`**:

  - **Triggered when:** Text is pasted into the REPL's input field.
  - **`type`**: `'editor'`
  - **`source`**: `'user'`
  - **`state`**: `{ code: string }` - The text content that was pasted.

- **`injectApi`**:

  - **Triggered when:** A custom API is injected into the REPL's environment via `repl.injectApi()`.
  - **`type`**: `'host'`
  - **`source`**: `'system'` (since `main.js` does this programmatically)
  - **`state`**: `{ name: string, api: string }` - The `name` under which the API was injected and a stringified representation of the `api` (e.g., its keys/structure).

- **`removeApi`**:

  - **Triggered when:** A given custom API is removed from the REPL's environment via `repl.removeApi(api)`.
  - **`type`**: `'host'`
  - **`source`**: `'system'` (since `main.js` does this programmatically)
  - **`state`**: `{ name: string, success: boolean, message: string}` - The name of the API that is removed along with a boolean to confirm success and a descriptive message.  

- **`removeAllApis`**:

  - **Triggered when:** All custom APIs are removed from the REPL's environment via `repl.removeAllApis()`.
  - **`type`**: `'host'`
  - **`source`**: `'system'` (since `main.js` does this programmatically)
  - **`state`**: `{}` 

- **`replError`**:
  - **Triggered when:** A critical error occurs within the YaBRI component itself, such as a failure to instantiate.
  - **`type`**: `'repl'`
  - **`source`**: `'system'`
  - **`state`**: `{ message: string }` - An error `message`.
