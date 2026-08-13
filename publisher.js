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
function formatDescriptionHtml(text) {
  if (!text) return "";

  const headings = new Set([
    "Detalles del producto",
    "Tamaños disponibles",
    "Materiales",
    "Nota importante",
    "Uso recomendado"
  ]);

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    if (headings.has(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }

      html += `<h3>${line}</h3>`;
      continue;
    }

    if (/^\*\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }

      html += `<li>${line.replace(/^\*\s+/, "")}</li>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    html += `<p>${line}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
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
    descriptionHtml: formatDescriptionHtml(product.description),
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
async function updateProduct(product) {
  const findQuery = `
    query FindProductByHandle($identifier: ProductIdentifierInput!) {
      productByIdentifier(identifier: $identifier) {
        id
        title
        handle
      }
    }
  `;

  const findData = await shopifyGraphQL(
    findQuery,
    {
      identifier: {
        handle: product.existingHandle
      }
    }
  );

  const existingProduct = findData.productByIdentifier;

  if (!existingProduct) {
    throw new Error(
      `No se encontró ningún producto con el handle: ${product.existingHandle}`
    );
  }

  return existingProduct;
}
module.exports = {
  publishProduct,
  updateProduct
};
