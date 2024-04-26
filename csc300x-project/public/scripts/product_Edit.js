document.addEventListener('DOMContentLoaded', function(){
    const userId = getCookie('userId');
    getAllProducts ();

    document.getElementById('addBtn').addEventListener('click', function(event) {
        event.preventDefault();
        addProduct();
    });

    document.getElementById('editBtn').addEventListener('click', function(event) {
        event.preventDefault();
        editProduct();
    });

    function addProduct() {
        const productAPI = 'http://localhost:8000/addProduct';
        const name = document.getElementById('addName').value;
        const description = document.getElementById('addDescription').value;
        const catId = document.getElementById('addCatId').value;
        const imageUrl = document.getElementById('addImageUrl').value;
        const price = document.getElementById('addPrice').value;
        const dimensions = document.getElementById('addProductDimen').value;
        const materials = document.getElementById('addProductMater').value;

        const productData = {
            name: name,
            description: description,
            catId: parseInt(catId), 
            imageUrl: imageUrl,
            price: parseInt(price),
            dimensions : dimensions,
            materials: materials,
        };

        fetch(productAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(data => {
            getAllProducts();
        })
        .catch(error => {
            console.error('Error:', error);
        });
        location.reload();
    }

    function editProduct() {
        const productAPI = 'http://localhost:8000/editProduct';
        const productId = document.getElementById('editProductId').value;
        const name = document.getElementById('editName').value;
        const description = document.getElementById('editDescription').value;
        const catId = document.getElementById('editCatId').value;
        const imageUrl = document.getElementById('editImageUrl').value;
        const price = document.getElementById('editPrice').value;
        const dimensions = document.getElementById('editProductDimen').value;
        const materials = document.getElementById('editProductMater').value;

        const productData = {
            productId: productId, 
            name: name,
            description: description,
            catId: parseInt(catId),
            imageUrl: imageUrl,
            price: parseInt(price),
            dimensions : dimensions,
            materials: materials,
        };

        fetch(productAPI, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to edit product');
            }
            return;
        })
        .then(data => {
            console.log('Product updated:', data);
            getAllProducts(); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function getAllProducts(){
        const allAPI = 'http://localhost:8000/allProducts';
        fetch (allAPI)
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                displayAllProducts (data);
            })
            .catch (error => console.error('Could not get products', error));
    }

    function displayAllProducts (allProducts){
        const allProductsContainer = document.getElementById('allProducts');
        allProductsContainer.innerHTML='';
        allProducts.forEach(product =>{
            const item = document.createElement('div');
            item.classList.add('flex-item');
            const link = document.createElement ('p');
            link.textContent = product.productId+" | ";
            link.textContent += product.productName+" | ";
            link.textContent += product.productDesc+" | ";
            link.textContent += product.catId+" | ";
            link.textContent += product.imageUrl+" | ";
            link.textContent += product.productPrice+" | ";
            link.textContent += product.productDimen+" | ";
            link.textContent += product.productMater;
            item.appendChild(link);
            allProductsContainer.appendChild(item);
        })
    }

    function getCookie(name) {
        let cookieArray = document.cookie.split(';');
        for(let i = 0; i < cookieArray.length; i++) {
            let cookiePair = cookieArray[i].split('=');
            if(name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }
})