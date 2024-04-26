document.addEventListener('DOMContentLoaded', function(){
    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
    getBestSellers ();


    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', function (){
        const searchInput= document.getElementById('searchValue');
        const searchValue= searchInput.value;
        window.location.href = `searchProduct.html?search=${searchValue}`; 
    })

    function getBestSellers(){
        const featuredAPI = 'http://localhost:8000/products/featured';
        fetch (featuredAPI)
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                displayBestSellers (data);
            })
            .catch (error => console.error('Could not get best sellers', error));
    }

    function displayBestSellers (featuredProduct){
        const featuredContainer = document.getElementById('bestSellers');
        featuredContainer.innerHTML='';
        featuredProduct.forEach(product =>{
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
            featuredContainer.appendChild(item);
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