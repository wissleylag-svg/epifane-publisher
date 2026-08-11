const { shopifyGraphQL } = require("../shopify");
const { runAgent } = require("../agent");

module.exports = async function handler(req, res) {
  // =========================
  // GET: comprobar conexión
  // y leer productos Shopify
  // =========================
  if (req.method === "GET") {
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

      return res.status(200).json({
        success: true,
        agent: "epifane-publisher",
        products: data.products.nodes,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // =========================
  // POST: enviar producto
  // al agente y crear borrador
  // =========================
  if (req.method === "POST") {
    try {
      const productData = req.body;

      if (!productData || !productData.title) {
        return res.status(400).json({
          success: false,
          error: "El producto necesita un título.",
        });
      }

      const product = await runAgent(productData);

      return res.status(200).json({
        success: true,
        message: "Producto procesado por EPIFANE Publisher",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // =========================
  // Otros métodos
  // =========================
  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
};
