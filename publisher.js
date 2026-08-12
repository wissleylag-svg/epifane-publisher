const { shopifyGraphQL } = require("./shopify");

async function findCollectionIds(collectionNames = []) {
  if (!Array.isArray(collectionNames) || collectionNames.length === 0) {
    return [];
  }

  const data = await shopifyGraphQL(`
    query GetCollections {
      collections(first: 100) {
        nodes {
          id
          title
        }
      }
    }
  `);

  const wanted = collectionNames.map(name =>
    String(name).trim().toLowerCase()
  );

  return data.collections.nodes
    .filter(collection =>
      wanted.includes(collection.title.trim().toLowerCase())
    )
    .map(collection => collection.id);
}

async function publishProduct(product) {
  const collectionIds = await findCollectionIds(
    product.collections || []
  );

  const mutation = `
    mutation CreateProduct($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product {
          id
          title
          handle
          descriptionHtml
          status
          vendor
          productType
          tags
          seo {
            title
            description
          }
          collections(first: 20) {
            nodes {
              id
              title
            }
          }
        }

        userErrors {
          field
          message
        }
      }
    }
  `;

  const productInput = {
    title: product.title,
    descriptionHtml: product.description || "",
    status: "DRAFT"
  };

  if (product.vendor) {
    productInput.vendor = product.vendor;
  }

  if (product.productType) {
    productInput.productType = product.productType;
  }

  if (Array.isArray(product.tags) && product.tags.length > 0) {
    productInput.tags = product.tags;
  }

  if (product.handle) {
    productInput.handle = product.handle;
  }

  if (product.seoTitle || product.metaDescription) {
    productInput.seo = {
      title: product.seoTitle || "",
      description: product.metaDescription || ""
    };
  }

  if (collectionIds.length > 0) {
    productInput.collectionsToJoin = collectionIds;
  }

  const variables = {
    product: productInput
  };

  const data = await shopifyGraphQL(
    mutation,
    variables
  );

  const errors = data.productCreate.userErrors;

  if (errors && errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  return data.productCreate.product;
}

module.exports = {
  publishProduct
};
