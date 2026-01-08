import * as RUNNER_HTTP_MODULE from "http";

const BLAZED_RUNNER_PORT = process.env.BLAZED_RUNNER_PORT
  ? parseInt(process.env.BLAZED_RUNNER_PORT)
  : 42069;

const BLAZED_RUNNER_SERVER = RUNNER_HTTP_MODULE.createServer(
  function (REQUEST, RESPONSE) {
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
    REQUEST.on("readable", function () {
      // Skip null
      const DATA = REQUEST.read();
      if (DATA === null) {
        return;
      }
      BODY += DATA;
    });
    REQUEST.on("end", function () {
      const JSON_BODY = JSON.parse(BODY);
      const SCRIPT = JSON_BODY.code;
      RESPONSE.write('{"status": "success"}');
      RESPONSE.end();

      // Close the server
      BLAZED_RUNNER_SERVER.close();

      // Run with source-map url
      console.log("[BLAZED.sh] Executing your script...");
      // const encodedCode = URL.createObjectURL(
      //   new Blob([`${SCRIPT} //# sourceURL=script.js`], {
      //     type: "text/javascript",
      //   }),
      // );
      // import(encodedCode)
      //
      new Function(SCRIPT)()
    });
  },
);

BLAZED_RUNNER_SERVER.listen(BLAZED_RUNNER_PORT);
