const { buildSeoFields } = require("./seo");
const { publishProduct, updateProduct } = require("./publisher");

async function runAgent(productData) {
  if (!productData || !productData.title) {
    throw new Error("El producto necesita un título.");
  }

  // Generamos SEO automático como respaldo
  const generatedSeo = buildSeoFields({
    title: productData.title,
    description: productData.description || "",
  });

  // Si tú escribiste SEO/handle en EPIFANE Publisher,
  // se respeta. Si lo dejaste vacío, se genera automáticamente.
  const product = {
    ...productData,

    seoTitle:
      productData.seoTitle?.trim() ||
      generatedSeo.seoTitle,

    metaDescription:
      productData.metaDescription?.trim() ||
      generatedSeo.metaDescription,

    handle:
      productData.handle?.trim() ||
      generatedSeo.handle,
  };

  if (product.existingHandle?.trim()) {
  return updateProduct(product);
}

return publishProduct(product);
}

module.exports = {
  runAgent,
};
