document.addEventListener('DOMContentLoaded', function(){
    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
    let totalProducts=0;


    getCartProducts(userId);

    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', function (){
        const searchInput= document.getElementById('searchValue');
        const searchValue= searchInput.value;
        window.location.href = `searchProduct.html?search=${searchValue}`; 
    })

    function getCartProducts (userId){
        const productAPI = 'http://localhost:8000/cart/products';
        fetch (productAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userid': userId,
            },
        })
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                const products = Array.isArray(data) ? data : [data];
                if (products.length > 0) {
                    displayCartProducts(products);
                    displayCartSummary(products);
                    attachEventListeners();
                } else {
                    const container = document.getElementById('cartProducts');
                    container.textContent = 'No products in your cart.';
                }
            })
            .catch (error => console.error('Could not get featured', error));
    }

    function displayCartProducts(products) {
        const container = document.getElementById('cartProducts');
        container.textContent = '';
    
        products.forEach(product => {
            const flexContainer = document.createElement('div');
            flexContainer.className = 'flex-container';
    
            const imgItem = document.createElement('div');
            imgItem.classList.add('flex-item');
            const img = document.createElement('img');
            img.className = 'cart-image';
            img.src = product.imageUrl;
            img.alt = 'product image';
            imgItem.appendChild(img);
    
            const infoItem = document.createElement('div');
            infoItem.className = 'flex-item';
            infoItem.appendChild(document.createTextNode(` ${product.productName} `));
            infoItem.appendChild(document.createElement('br'));
            infoItem.appendChild(document.createTextNode(` Price: $${product.productPrice} `));
    
            const qtyDiv = document.createElement('div');
            qtyDiv.className = 'qty';
            qtyDiv.textContent = 'Quantity= ';
            const qtyInput = document.createElement('input');
            qtyInput.id = `setInput${product.productId}`;
            qtyInput.type = 'text';
            qtyInput.placeholder = product.quantity.toString();
            qtyInput.value = product.quantity;
            qtyDiv.appendChild(qtyInput);
            const setButton = document.createElement('button');
            setButton.productId= product.productId;
            setButton.classList.add('goButton');
            setButton.classList.add('setBtn');
            setButton.textContent = 'SET';
            qtyDiv.appendChild(setButton);
            infoItem.appendChild(qtyDiv);

            
    
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('goButton');
            deleteButton.classList.add('deleteBtn');
            deleteButton.productId= product.productId;
            deleteButton.textContent = 'DELETE';
            infoItem.appendChild(deleteButton);
            infoItem.appendChild(document.createElement('br'));
            infoItem.appendChild(document.createTextNode(` TOTAL ITEM: $${product.productPrice * product.quantity} `));
            totalProducts += product.productPrice * product.quantity;
    
            flexContainer.appendChild(imgItem);
            flexContainer.appendChild(infoItem);
            container.appendChild(flexContainer);
        });
    }
    
    function displayCartSummary(products) {
        const tax = totalProducts * 0.065; 
        const delivery = 15.00; 
        const grandTotal = totalProducts + tax + delivery;
    
        const summary = document.getElementById('cartSummary');
        summary.innerHTML = '';
    
        const totalTitle = document.createElement('h2');
        totalTitle.textContent = 'Total:';
        summary.appendChild(totalTitle);
    
        const totalCostText = document.createTextNode(` Total Cost: $${totalProducts} `);
        summary.appendChild(totalCostText);
        summary.appendChild(document.createElement('br'));
    
        const taxText = document.createTextNode(` Tax: $${tax.toFixed(2)} `);
        summary.appendChild(taxText);
        summary.appendChild(document.createElement('br'));
    
        const deliveryText = document.createTextNode(` Delivery: $${delivery} `);
        summary.appendChild(deliveryText);
        summary.appendChild(document.createElement('br'));
    
        const grandTotalText = document.createElement('strong');
        grandTotalText.textContent = `Total: $${grandTotal.toFixed(2)}`;
        summary.appendChild(grandTotalText);
        summary.appendChild(document.createElement('br'));
    
        const checkoutButton = document.createElement('button');
        checkoutButton.classList.add('goButton');
        checkoutButton.setAttribute("id", "checkoutBtn")
        checkoutButton.textContent = 'CHECKOUT';
        summary.appendChild(checkoutButton);
    }

    function attachEventListeners (){
        const setButtons =document.querySelectorAll('.setBtn');
        setButtons.forEach(setButton => {
            setButton.addEventListener('click', function (){
                const productId= this.productId;
                const setNumber= document.getElementById(`setInput${productId}`).value;
                setQuantity (productId, setNumber);
            });
            
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', function (){
                const productId= this.productId;
                deleteProduct (productId);
            });
            
        });

        const checkoutButton = document.getElementById('checkoutBtn');
        checkoutButton.addEventListener('click', function (){
            checkout (userId);
        });
    }

    function setQuantity (productId, setNumber){
        const reqBody = {
            productId: productId,
            setNumber: setNumber,
        };

        const productAPI = 'http://localhost:8000/quantity/change';
        fetch(productAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
        .then(response=> {
            if (!response.ok){
                throw new Error ('Response not ok');
            }
            return response;
        })
        .then (data =>{
        })
        .catch(error => {
            console.error('Error:', error);
        });
        location.reload();
    }

    function deleteProduct (productId){
        const reqBody = {
            productId: productId,
        };

        const productAPI = 'http://localhost:8000/deleteProduct';
        fetch(productAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
        .then(response=> {
            if (!response.ok){
                throw new Error ('Response not ok');
            }
            return response;
        })
        .then (data =>{
        })
        .catch(error => {
            console.error('Error:', error);
        });
        location.reload();
    }

    function checkout (userId){
        const reqBody = {
            userId: userId,
        };

        const productAPI = 'http://localhost:8000/checkout';
        fetch(productAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
        .then(response=> {
            if (!response.ok){
                throw new Error ('Response not ok');
            }
            return response;
        })
        .then (data =>{
        })
        .catch(error => {
            console.error('Error:', error);
        });
        location.reload();
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