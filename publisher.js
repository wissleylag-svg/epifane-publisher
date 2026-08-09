const { shopifyGraphQL } = require("./shopify");
const { buildSeoFields } = require("./seo");

async function publishProduct(product) {
  const seo = buildSeoFields(product);

  const mutation = `
    mutation CreateProduct($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product {
          id
          title
          handle
          descriptionHtml
          status
          seo {
            title
            description
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    product: {
      title: product.title,
      descriptionHtml: product.description || "",
      handle: seo.handle,
      seo: {
        title: seo.seoTitle,
        description: seo.metaDescription
      },
      status: "DRAFT"
    }
  };

  const data = await shopifyGraphQL(mutation, variables);

  const errors = data.productCreate.userErrors;

  if (errors && errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  return data.productCreate.product;
}

module.exports = {
  publishProduct
};
