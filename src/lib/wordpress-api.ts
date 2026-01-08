// src/lib/wordpress-api.ts

const WP_API_URL = 'https://eshop.brxa.sk/wp-json/wc/v3';

export async function getProducts(params: any = {}) {
    try {
        const searchParams = new URLSearchParams({
            per_page: '100',
            page: '1',
            ...params,
        });

        const url = `${WP_API_URL}/products?${searchParams}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products from WordPress:', error);
        return [];
    }
}

export async function getProduct(id: number) {
    try {
        const response = await fetch(`${WP_API_URL}/products/${id}`);

        if (!response.ok) {
            throw new Error(`Product not found: ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getProductsByCategory(categorySlug: string) {
    try {
        const categoryResponse = await fetch(
            `${WP_API_URL}/products/categories?slug=${categorySlug}`
        );

        if (!categoryResponse.ok) {
            throw new Error(`Category not found: ${categorySlug}`);
        }

        const categories = await categoryResponse.json();
        if (categories.length === 0) {
            return [];
        }

        const categoryId = categories[0].id;

        const response = await fetch(
            `${WP_API_URL}/products?category=${categoryId}&per_page=100`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch products for category: ${categorySlug}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

export async function getCategories() {
    try {
        const response = await fetch(
            `${WP_API_URL}/products/categories?per_page=100`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export function formatProduct(product: any) {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: parseFloat(product.price),
        regular_price: parseFloat(product.regular_price),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        image: product.images[0]?.src || '',
        images: product.images.map((img: any) => img.src),
        category: product.categories[0]?.name || '',
        categoryId: product.categories[0]?.id || '',
        attributes: product.attributes || [],
        sku: product.sku,
        stock: product.stock_quantity,
        inStock: product.in_stock,
    };
}

export async function getFormattedProducts(params: any = {}) {
    const products = await getProducts(params);
    return products.map(formatProduct);
}

export async function searchProducts(query: string) {
    try {
        const response = await fetch(
            `${WP_API_URL}/products?search=${encodeURIComponent(query)}&per_page=50`
        );

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const products = await response.json();
        return products.map(formatProduct);
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}