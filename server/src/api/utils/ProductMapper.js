const {map} = require('lodash');

function MapToProductObject(products) {
    return map(products, (product) => {
            return {
                id: product['id']['$t'],
                title: product['title']['$t'],
                bodyHtml: product['body-html']['$t'],
                vendor: product['vendor']['$t'],
                productType: product['product-type']['$t'],
                createdAt: product['created-at']['$t'],
                handle: product['handle']['$t'],
                publishedScope: product['published-scope']['$t'],
                tags: product['tags']['$t'],
                image: {
                    id: product['image']['id']['$t'],
                    productId: product['image']['product-id']['$t'],
                    createdAt: product['image']['created-at']['$t'],
                    updatedAt: product['image']['updated-at']['$t'],
                    alt: product.image?.alt?.nil,
                    width: product['image']['width']['$t'],
                    height: product['image']['height']['$t'],
                    src: product['image']['src']['$t'],
                }
            };
        }
    );
}

exports.MapToProductObject = MapToProductObject;
