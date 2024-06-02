//import http from 'http';
const http = require("http");

const BLAZED_RUNNER_PORT = process.env.BLAZED_RUNNER_PORT
  ? parseInt(process.env.BLAZED_RUNNER_PORT)
  : 42069;

// console.log wrapper with timestamp
const oldConsoleLog = console.log;
console.log = function(...args) {
  oldConsoleLog(`[${new Date().toLocaleString()}]`, ...args);
};

const PRINT_BLAZED_BANNER = function() {
  oldConsoleLog(`
  _     _                   _       _     
 | |   | |                 | |     | |    
 | |__ | | __ _ _______  __| |  ___| |__  
 | '_ \\| |/ _\` |_  / _ \\/ _\` | / __| '_ \\
 | |_) | | (_| |/ /  __/ (_| |_\\__ \\ | | |
 |_.__/|_|\\__,_/___\\___|\\__,_(_)___/_| |_|
      `);
};

const BLAZED_RUNNER_SERVER = http.createServer(function(REQUEST, RESPONSE) {
  if (REQUEST.method !== "POST") {
    RESPONSE.write("405");
    RESPONSE.end();
    return;
  }

  if (REQUEST.url !== "/") {
    RESPONSE.write("404");
    RESPONSE.end();
    return;
  }

  let BODY = "";
  REQUEST.on("readable", function() {
    // Skip null
    const DATA = REQUEST.read();
    if (DATA === null) {
      return;
    }
    BODY += DATA;
  });
  REQUEST.on("end", function() {
    RESPONSE.write('{"status": "success"}');
    RESPONSE.end();

    // Close the server
    BLAZED_RUNNER_SERVER.close();

    PRINT_BLAZED_BANNER();

    // Run the code
    eval(BODY);
  });
});

BLAZED_RUNNER_SERVER.listen(BLAZED_RUNNER_PORT)
