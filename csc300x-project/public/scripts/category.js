document.addEventListener('DOMContentLoaded', function(){
    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('catId');
    getCategoryTitle(categoryId);
    getCategoryProducts (categoryId);

    function getCategoryTitle (categoryId){
        const titleAPI = 'http://localhost:8000/category/search';
        fetch (titleAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'catid': categoryId,
            },
        })
        .then (response => {
            if (!response.ok){
                throw new Error ('Response not ok');
            }
            return response.json();
        })
        .then (data => {
            const title = document.getElementById('categoryTitle');
            title.innerHTML='';
            title.textContent= data.catName;
        })
        .catch (error => console.error('Could not get search', error));
    }


    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', function (){
        const searchInput= document.getElementById('searchValue');
        const searchValue= searchInput.value;
        window.location.href = `searchProduct.html?search=${searchValue}`; 
    })

    function getCategoryProducts (categoryId){
        const catProductsAPI = 'http://localhost:8000/category/products';
        fetch (catProductsAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'catid': categoryId,
            },
        })
        .then (response => {
            if (!response.ok){
                throw new Error ('Response not ok');
            }
            return response.json();
        })
        .then (data => {
            displayProducts (data);
        })
        .catch (error => console.error('Could not get search', error));
    }

    function displayProducts (products){
        const categoryContainer = document.getElementById('categoryProducts');
        categoryContainer.innerHTML='';

        products.forEach (product => {
            const item = document.createElement('div');
            item.classList.add('flex-item');
            const link = document.createElement ('a');
            link.href= `details.html?productId=${product.productId}`;

            const image = document.createElement ('img');
            image.src = `${product.imageUrl}`;
            image.alt = `${product.productName} image`;

            link.appendChild(image);
            const lineBreak = document.createElement('br');
            link.appendChild(lineBreak);
            const itemName= document.createTextNode(`${product.productName}`);
            link.appendChild(itemName);
            item.appendChild(link);
            categoryContainer.appendChild(item);
        });
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