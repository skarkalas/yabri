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
  const yabriElement = document.querySelector("yabri-terminal");
  if (yabriElement) {
    //register listeners for exposed events
    yabriElement.getMetadata().elements.forEach((element) => {
      element.events.forEach((eventName) => {
        // console.log(`attaching listener for event: ${eventName}`);
        yabriElement.addEventListener(eventName, (event) => {
          const data = event.detail;
          console.log(data);
        });
      });
    });
    //define external api
    const myAppAPI = `{
      utils: {
        formatDate: (year, month, day) => {
          const pad = (num) => (num < 10 ? "0" + num : num);
          return year + "-" + pad(month) + "-" + pad(day);
        },
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
      },
      data: {
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
        getUsers: function () {
          return this.users;
        },
        findUserById: function (id) {
          return this.users.find((u) => u.id === id);
        },
      },
      config: {
        version: "1.0.0",
        debugMode: true,
      },
    }`;
    //inject external api
    yabriElement.injectApi("app", myAppAPI);
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
  }
});
