const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });

  res.end(
    JSON.stringify({
      status: "ok",
      agent: "epifane-publisher",
      message: "EPIFANE Publisher Agent is running"
    })
  );
});

server.listen(PORT, () => {
  console.log(`EPIFANE Publisher running on port ${PORT}`);
});
