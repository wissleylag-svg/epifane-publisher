const { shopifyGraphQL } = require("../shopify");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

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
      products: data.products.nodes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
