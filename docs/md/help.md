# YaBRI Help

Welcome to the interactive YaBRI! This guide will help you navigate and utilize its features effectively.

---

## Basic Interaction

* **Typing Code:** Simply type JavaScript code into the input prompts and press **Ctrl + Enter** / **Cmd + Enter:** to execute single-line commands.
* **Multiline Input:** For longer code blocks, press **Enter** to add a new line without executing. The code will execute only when you press **Ctrl + Enter** (or **Cmd + Enter**) on the last line.
* **Output:** The result of your code execution will be displayed below the input prompt. Errors as well as explicit console outputs will be given different visual indicators.

---

## Keyboard Shortcuts

Execute code.
```
Ctrl + Enter / Cmd + Enter
``` 

Navigate backwards through your command history.
```
Ctrl + Up Arrow / Cmd + Up Arrow
```

Navigate forwards through your command history.
```
Ctrl + Down Arrow / Cmd + Down Arrow 
```

Paste text from your clipboard into the current input, handling multiline input automatically.
```
Ctrl + V / Cmd + V
``` 

Save the current REPL session (input and output) as a `repl_session_[timestamp].json` file.
```
Ctrl + D / Cmd + D
``` 

Return the internal state of the REPL as a JSON object. This is intended to be used programmatically to inform the hosting system about the state. The keys can be used for testing to output the state to the browser console. 
```
Ctrl + G / Cmd + G
``` 

Set the internal state of the REPL using a JSON object as input. This is intended to be used programmatically by the hosting system to initialize or reset the state of the REPL. The keys can be used for testing to input a sample state to the REPL.
```
Ctrl + S / Cmd + S
``` 

Display this help file.
```
Ctrl + I / Cmd + I
```

Open a file dialog to upload the contents of a local `.json` or `.txt` file into the REPL as input.
```
Ctrl + U / Cmd + U
``` 

---

## REPL Commands

* **`clear`:** Executing `clear` will clear the entire REPL session, removing all input and output history and resetting the interpreter.
* **`console.log`:** Executing `console.log` will log outputs to the browser console as well as the REPL. Objects and arrays will be pretty-printed in JSON format.
* **`console.warn`:** Executing `console.warn` will log outputs as **warnings** to the browser console as well as the REPL. Objects and arrays will be pretty-printed in JSON format.
* **`console.error`:** Executing `console.error` will log outputs as **errors** to the browser console as well as the REPL. Objects and arrays will be pretty-printed in JSON format.
* **`alert`:** Executing `alert` will display outputs in a message box.
* **`prompt`:** Executing `prompt` will prompt the user for input using a modal window. A dialog box will appear allowing you to enter text and click 'OK' or 'Cancel'.
* **`confirm`:** Executing `confirm` will ask the user for confirmation using a modal window with 'OK' and 'Cancel' options.

---

## Interacting with the Interpreter

The REPL uses Neil Fraser's JavaScript interpreter. You can execute any valid ES5 JavaScript code.

* **Sandbox:** Execution is completely isolated from the main JavaScript environment. This isolated environment ensures that infinite loops or potentially malicious code will not affect the main application or the user's system.
* **Global Scope:** Variables declared without `var` will be in the global scope.
* **API Injection:** The REPL supports injecting custom JavaScript APIs of any depth. If an API has been injected, its functions and objects will be accessible in the global scope (refer to specific API documentation for usage).

---

## Working with Input and Output

* **Selecting and Copying Input:** Click on the **small icon or symbol displayed at the beginning of an input line** to select the entire input block (all lines belonging to that command). Selected input prompts will be briefly highlighted.
* **Selecting and Copying Output/Exception/Logs/Warnings/Errors:** Click on the **small icon or symbol displayed at the beginning of an output line** to select the entire output block (all lines belonging to that result or error). Selected output blocks will be briefly highlighted.

---

## Code Linting

* The REPL automatically lints your code using JSHint before execution. If any potential issues are found, a brief notification will appear, typically in the middle of the REPL. This helps in identifying syntax errors and potential problems in your JavaScript code, but does not prevent execution.

---

Enjoy experimenting and building with the YaBRI! If you encounter any issues, please refer to the relevant documentation or contact support.