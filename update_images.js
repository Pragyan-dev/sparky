const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, 'data/products.json');
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchImageForProduct(product) {
    const query = `${product.brand} ${product.name}`;
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=1`;

    try {
        console.log(`Searching for: ${query}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'SparkyApp/1.0 (sparky@example.com)' // Polite User-Agent
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch for ${product.name}: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        if (data.products && data.products.length > 0) {
            const foundProduct = data.products[0];
            // Prefer image_url (usually 400px or full), fallback to others
            const imageUrl = foundProduct.image_url || foundProduct.image_front_url || foundProduct.image_small_url;

            if (imageUrl) {
                console.log(`Found image for ${product.name}: ${imageUrl}`);
                return imageUrl;
            }
        }
        console.log(`No image found for ${product.name}`);
        return null;
    } catch (error) {
        console.error(`Error searching for ${product.name}:`, error.message);
        return null;
    }
}

async function updateImages() {
    let updatedCount = 0;
    const products = productsData.products;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        // Optional: Skip if we already have a valid-looking URL (but we know current ones are broken 404s)
        // So we will just update all of them or check if it's an OpenFoodFacts URL that is broken.
        // For now, let's just try to update everything that looks like an OpenFoodFacts URL or placeholder.

        const newImageUrl = await fetchImageForProduct(product);

        if (newImageUrl) {
            product.image = newImageUrl;
            updatedCount++;
        }

        // Be polite to the API
        await delay(500);
    }

    fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 4));
    console.log(`Updated ${updatedCount} products.`);
}

updateImages();
