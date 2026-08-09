function buildSeoFields(product) {
  const title = product.title || "";
  const description = product.description || "";

  const seoTitle = title.slice(0, 60);

  const metaDescription = description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const handle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    seoTitle,
    metaDescription,
    handle
  };
}

module.exports = {
  buildSeoFields
};
