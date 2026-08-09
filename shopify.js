const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

async function shopifyRequest(endpoint, options = {}) {
  const url = `https://${SHOPIFY_STORE}/admin/api/2026-07/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify error: ${response.status} - ${error}`);
  }

  return response.json();
}

module.exports = {
  shopifyRequest,
};
