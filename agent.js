const { buildSeoFields } = require("./seo");
const { publishProduct } = require("./publisher");

async function runAgent(productData) {
  if (!productData || !productData.title) {
    throw new Error("El producto necesita un título.");
  }

  const seo = buildSeoFields({
    title: productData.title,
    description: productData.description || "",
  });

  const product = {
    ...productData,
    seoTitle: seo.seoTitle,
    metaDescription: seo.metaDescription,
    handle: seo.handle,
  };

  return publishProduct(product);
}

module.exports = {
  runAgent,
};
