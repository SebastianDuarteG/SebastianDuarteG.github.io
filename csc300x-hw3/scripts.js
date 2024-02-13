document.addEventListener('DOMContentLoaded', function(){
    const images = document.querySelectorAll(".flex-item2 img");
    for (let i=0; i<images.length; i++){
        images[i].addEventListener('click', onClick);
    }

    function onClick(event) {
        const hiddenImage = event.currentTarget;
        const hiddenInfo = hiddenImage.nextElementSibling;
        const displayedDescription = hiddenInfo.classList.contains('image-shown-info');

        if (displayedDescription) {
            hiddenInfo.classList.remove('image-shown-info');
            hiddenInfo.classList.add('image-hidden-info');
        } else {
            const displayedDescription = document.querySelector(".image-shown-info");
            if (displayedDescription) {
                displayedDescription.classList.remove('image-shown-info');
                displayedDescription.classList.add('image-hidden-info');
            }
            hiddenInfo.classList.remove('image-hidden-info');
            hiddenInfo.classList.add('image-shown-info');
        }
    }
})

document.addEventListener('DOMContentLoaded', function(){
    const items= document.querySelectorAll(".item");
    for (let i=0; i<items.length; i++){
        items[i].addEventListener('click', onClick2);
    }

    const mealPlan = document.getElementById("meal-plan");
    mealPlan.addEventListener('click', function (){
        if (event.target.classList.contains('remove')){
            removeItem(event.target.parentNode);
        }
        else if (event.target.classList.contains('another')){
            addAnother (event.target.parentNode);
        }
    })
})

function onClick2(item){
    const description = item.dataset.description;
    const price = parseFloat(item.dataset.cost);

    const newItem = document.createElement('li');
    newItem.innerHTML = 
        <span>${description} - $${price} </span>
        <button class="remove-item">Remove</button>
        <button class="add-another">Add Another</button>
    ;

    const mealPlan = document.getElementById("meal-plan");
    mealPlan.appendChild(newItem);

    updateCost();
}

function removeItem (item) {
    item.parentNode.removeChild(item);
    updateCost();
}

function addAnother (item){
    
}



