document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleFormSubmit);

    async function handleFormSubmit(event) {
        event.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (file && file.type === "application/json") {
            try {
                const data = await file.text();
                console.log("File data:", data);
                const products = JSON.parse(data);
                console.log("Parsed products:", products);
                products.forEach(async product => {
                    await addProduct(product);
                });
            } catch (err) {
                console.error('Error parsing JSON or uploading products:', err);
            }
        } else {
        }
    }

    async function addProduct(product) {
        const response = await fetch('http://localhost:8000/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: product.name,
                description: product.description,
                catId: product.catId,
                imageUrl: product.imageUrl,
                price: product.price,
                dimensions: product.dimensions,
                materials: product.materials
            })
        });

        if (!response.ok) {
            throw new Error('Failed to upload product');
        }

        return response;
    }
});