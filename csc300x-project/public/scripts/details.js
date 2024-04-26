document.addEventListener('DOMContentLoaded', function(){
    const params = new URLSearchParams(window.location.search);
    const productId= params.get('productId');

    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }


    getProduct(productId);

    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', function (){
        const searchInput= document.getElementById('searchValue');
        const searchValue= searchInput.value;
        window.location.href = `searchProduct.html?search=${searchValue}`; 
    })

    function getProduct(productId){
        const productAPI = 'http://localhost:8000/product/search';
        fetch (productAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'productid': productId,
            },
        })
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                displayProduct (data);
            })
            .catch (error => console.error('Could not get featured', error));
    }

    function displayProduct (product){
        const productTitle= document.getElementById('productName');
        productTitle.innerHTML='';
        productTitle.textContent = product.productName;

        productImage= document.getElementById('productImage');
        productImage.src= product.imageUrl;

        productPrice= document.getElementById('productPrice');
        productPrice.innerHTML='';
        productPrice.textContent=`$${product.productPrice}`;

        addToButton = document.getElementById('addToBtn');
        addToButton.productId= product.productId;

        productDescription = document.getElementById('productDescription');
        productDescription.innerHTML='';
        productDescription.textContent = product.productDesc;

        productDimensions = document.getElementById('productDimensions');
        productDimensions.innerHTML='';
        productDimensions.textContent = product.productDimen;

        productMaterials = document.getElementById('productMaterials');
        productMaterials.innerHTML='';
        productMaterials.textContent = product.productMater;

        addToButton.addEventListener('click', function (){
            const addToId = addToButton.productId;
            addToCart(addToId);
        })
    }

    function addToCart (productId){
        const productAPI= 'http://localhost:8000/addToCart';
        const reqBody = {
            userId: userId,
            productId: productId,
        }

        fetch(productAPI , {
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
                return response.json();
            })
            .then (data =>{
            })
            .catch (error => console.error('Couldnt add department',error));
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