//import http from 'http';
const http = require('http');

const BLAZED_RUNNER_PORT = process.env.BLAZED_RUNNER_PORT ? parseInt(process.env.BLAZED_RUNNER_PORT) : 42069;

// console.log wrapper with timestamp
const oldConsoleLog = console.log;
console.log = function(...args) {
  oldConsoleLog(`[${new Date().toLocaleString()}]`, ...args);
}

const PRINT_BLAZED_BANNER = function() {
  console.log(`
░▒▓███████▓▒░░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓████████▓▒░▒▓████████▓▒░▒▓███████▓▒░        ░▒▓███████▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░    ░▒▓██▓▒░░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓███████▓▒░░▒▓█▓▒░      ░▒▓████████▓▒░  ░▒▓██▓▒░  ░▒▓██████▓▒░ ░▒▓█▓▒░░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓████████▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓██▓▒░    ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓██▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓███████▓▒░░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓████████▓▒░▒▓███████▓▒░░▒▓██▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░ 
      `);
}

console.log('BLAZED JS Runner is running on port ' + BLAZED_RUNNER_PORT);
const BLAZED_RUNNER_SERVER = http.createServer(function(REQUEST, RESPONSE) {
  if (REQUEST.method !== 'POST') {
    RESPONSE.write('405');
    RESPONSE.end();
    return;
  }

  if (REQUEST.url !== '/') {
    RESPONSE.write('404');
    RESPONSE.end();
    return;
  }

  let BODY = '';
  REQUEST.on('readable', function() {
    // Skip null
    const DATA = REQUEST.read();
    if (DATA === null) {
      return;
    }
    BODY += DATA;
  });
  REQUEST.on('end', function() {
    RESPONSE.write('{"status": "success"}');
    RESPONSE.end();

    // Close the server
    BLAZED_RUNNER_SERVER.close();

    // Run the code
    const CODE = JSON.parse(BODY).code;
    eval(CODE);

  });
}).listen(BLAZED_RUNNER_PORT);

BLAZED_RUNNER_SERVER.on('close', function() {
  console.log("BLAZED JS Runner Listener is exiting...");

  PRINT_BLAZED_BANNER();
});
