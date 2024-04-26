document.addEventListener('DOMContentLoaded', function(){
    const userId = getCookie('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }
    getCategories ();


    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', function (){
        const searchInput= document.getElementById('searchValue');
        const searchValue= searchInput.value;
        window.location.href = `searchProduct.html?search=${searchValue}`; 
    })

    function getCategories(){
        const featuredAPI = 'http://localhost:8000/categories';
        fetch (featuredAPI)
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                displayCategories (data);
            })
            .catch (error => console.error('Could not get categories', error));
    }

    function displayCategories (categories){
        const categoriesContainer = document.getElementById('categories');
        categoriesContainer.innerHTML='';
        categories.forEach(category =>{
            const item = document.createElement('div');
            item.classList.add('flex-item');
            const link = document.createElement ('a');
            link.href= `category.html?catId=${category.catId}`;
            link.textContent = category.catName;
            item.appendChild(link);
            categoriesContainer.appendChild(item);
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