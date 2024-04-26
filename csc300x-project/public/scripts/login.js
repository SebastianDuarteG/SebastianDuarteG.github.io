document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginBtn');
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();

        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;
        const reqBody = {
            loginEmail: loginEmail,
            loginPassword: loginPassword,
        };

        const loginAPI = 'http://localhost:8000/login';
        fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        })
        .then(response => {
            const status = response.status;
            return response.text().then(userId => {
                if (status === 200) {
                    document.cookie = `userId=${userId}; path=/`;
                    window.location.href = `index.html`;
                } else if (status === 201) {
                    document.cookie = `userId=${userId}; path=/`;
                    window.location.href = `product_Edit.html`;
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    const registerButton = document.getElementById('registerBtn');
    registerButton.addEventListener('click', function(event){
        event.preventDefault();
        const registerUserName= document.getElementById('registerUserName').value;
        const registerEmail = document.getElementById('registerEmail').value;
        const registerPassword = document.getElementById('registerPassword').value;
        const reqBody = {
            registerUserName: registerUserName,
            registerEmail: registerEmail,
            registerPassword: registerPassword,
        };

        const registerAPI = 'http://localhost:8000/register';
        fetch(registerAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody)
        })
        .then(response => {
            if (!response.ok){
                throw new Error ('Response not ok');
            }
            return response;
        })
        .then(data =>{
            const registerContainer= document.getElementById('registerBtn').parentNode;
            const lineBreak= document.createElement('br');
            registerContainer.appendChild(lineBreak);
            const registerSuccess= document.createTextNode('Registered Successfully');
            registerContainer.appendChild(registerSuccess);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

});