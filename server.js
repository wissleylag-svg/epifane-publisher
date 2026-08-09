const http = require("http");
const { shopifyGraphQL } = require("./shopify");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/api") {
    try {
      const data = await shopifyGraphQL(`
        query GetProducts {
          products(first: 5) {
            nodes {
              id
              title
              handle
            }
          }
        }
      `);

      res.writeHead(200);
      return res.end(
        JSON.stringify({
          success: true,
          products: data.products.nodes,
        })
      );
    } catch (error) {
      res.writeHead(500);
      return res.end(
        JSON.stringify({
          success: false,
          error: error.message,
        })
      );
    }
  }

  res.writeHead(200);
  res.end(
    JSON.stringify({
      status: "ok",
      agent: "epifane-publisher",
      message: "EPIFANE Publisher Agent is running",
    })
  );
});

server.listen(PORT, () => {
  console.log(`EPIFANE Publisher running on port ${PORT}`);
});
