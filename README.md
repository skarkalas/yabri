# YaBRI - Yet another Browser REPL Interface

YaBRI is an interactive JavaScript Read-Eval-Print Loop (REPL) component designed as a reusable and embeddable web component. It provides a powerful and isolated environment for executing JavaScript code directly within web applications.

## 🚀 Key Features

- **No Backend Dependencies:** Entirely frontend-based. Executes code, performs linting, and manages sessions in-browser.
- **Encapsulated REPL Environment:** Operates independently from the host application.
- **Multiline Input Handling:** Uses multiple `input` elements to simulate terminal-like multiline editing.
- **Command History Navigation:** Navigate command history with `Ctrl/Cmd + Up/Down Arrow`.
- **Clipboard Multiline Paste:** Multiline clipboard pastes auto-expand into individual lines.
- **Session Persistence:** Save/load REPL sessions (`Ctrl/Cmd + D` to save, `Ctrl/Cmd + S` to load).
- **Code Linting with JSHint:** Instant feedback on code issues before execution.
- **Deep API Injection:** Inject and recognize deeply nested JavaScript API objects.
- **Detailed Event Emission:** Emits fine-grained custom events for all major user/system actions.
- **Clear I/O Distinction:** Visually distinguishes inputs, outputs, logs, warnings, and errors.
- **Selectable/Copyable Content:** Easily select and copy code blocks by clicking their markers.
- **File Uploads:** Supports `.json` and `.js` file uploads (`Ctrl/Cmd + U`).
- **Sandboxed & Safe Execution:** Runs code in a secure sandbox. Internally handles infinite loops and malicious input.

## 📡 Event Emission Architecture

YaBRI emits custom events to allow host applications to monitor interactions and state.

### 📝 Editor Events

- `pasteText` — Pasted text (includes pasted string in `detail`).
- `fileUpload` — File upload triggered (includes file info in `detail`).
- `getCode` / `setCode` — Programmatic code fetch/set operations.
- `saveCode` — Save just the code, emits `state` with JS string.
- `clearSession` — Session was cleared.
- `getSession` / `setSession` / `saveSession` — Retrieve/set/save session state (JSON object in `state`).

### 🧹 Linter Events

- `codeQualityCheck` — Emitted after JSHint analysis with results in `detail`.

### ⚙️ Interpreter Events

- `codeExecution` — Emitted after code is run. `detail` includes execution outcome.

### 🖥️ Host Events

- `injectApi` / `removeApi` / `removeAllApis` — Reflects API state changes in the interpreter.

### 📋 Copy Events

- `inputCopy`, `outputCopy`, `exceptionCopy`, `logCopy`, `warningCopy`, `errorCopy` — Triggered when a line is copied.

### 📦 Event Object Structure

Each event is a `CustomEvent` with the following keys:

- `event` — Event name.
- `type` — Module source (`editor`, `linter`, etc.).
- `source` — `user` or `system` trigger.
- `origin` — Always `repl`.
- `timestamp` — Unix timestamp.
- `state` — Optional, state-related data for session or code.

## 💡 Potential Uses

- **Education:** Ideal for learning JavaScript interactively with live feedback.
- **Development Prototyping:** Test small JavaScript functions without a full dev setup.
- **Interactive Documentation:** Embed examples directly in docs.
- **Debugging Aid:** Test hypotheses and inspect code behavior in isolation.
- **Code Sharing & Collaboration:** Export and share complete REPL sessions easily.

## 🔗 Integration

YaBRI is designed for seamless integration into any modern web application and supports:

- Custom event listeners for host interactivity.
- Programmatic API injection/removal.
- Session import/export via JSON.
- Safe, isolated, persistent REPL state.

---

YaBRI empowers learners and developers with a browser-native JavaScript REPL, facilitating experimentation, analytics, and embedded interactive documentation with ease.
