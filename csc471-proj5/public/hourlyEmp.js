document.addEventListener('DOMContentLoaded', function(){
    getHourlyEmpList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchSSN = document.getElementById('searchSSN').value;
        searchHourlyEmp(searchSSN);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const ssn = document.getElementById('addSSN').value;
        const hourPay = document.getElementById('addHourPay').value;
        addHourlyEmp (ssn, hourPay);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const ssn = document.getElementById('editSSN').value;
        const hourPay = document.getElementById('editHourPay').value;
        editHourlyEmp(ssn, hourPay);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteSSN = document.getElementById('deleteSSN').value;
        deleteHourlyEmp(deleteSSN);
    });


    function getHourlyEmpList (){
        const hourlyEmpListAPI = `http://localhost:8000/hourlyEmp`;
        fetch (hourlyEmpListAPI)
            .then (response => {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data => {
                displayList (data);
            })
            .catch (error => console.error('Could not get list', error));
    }

    function displayList (hourlyEmpList){
        const hourlyEmpTable = document.getElementById('hourlyEmpTable');
        hourlyEmpTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'SSN';
        const column2 = document.createElement ('th');
        column2.textContent = 'Hour Pay';
        row1.appendChild (column1);
        row1.appendChild (column2);
        hourlyEmpTable.appendChild(row1);

        hourlyEmpList.forEach(hourlyEmp=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = hourlyEmp.ssn;
            const columnB = document.createElement ('th');
            columnB.textContent = hourlyEmp.hourPay;
            row.appendChild (columnA);
            row.appendChild (columnB);
            hourlyEmpTable.appendChild(row);
        });
    }

    function searchHourlyEmp (searchSSN){
        if (!searchSSN){
            location.reload();
        } else if (searchSSN.length!=9 ) {
            searchError();
            return;
        }

        const hourlyEmpAPI= 'http://localhost:8000/hourlyEmp/search';

        fetch(hourlyEmpAPI , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ssn': `${searchSSN}`,
            },
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data =>{
                const hourlyEmpTable = document.getElementById('hourlyEmpTable');
                hourlyEmpTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'SSN';
                const column2 = document.createElement ('th');
                column2.textContent = 'Hour Pay';
                row1.appendChild (column1);
                row1.appendChild (column2);
                hourlyEmpTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.ssn;
                const columnB = document.createElement ('th');
                columnB.textContent = data.hourPay;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                hourlyEmpTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search hourlyEmp',error));
    }

    function addHourlyEmp (ssn, hourPay){
        if (!ssn || !hourPay || ssn.length!=9 || hourPay< 7.50){
            addError();
            return;
        } 
        const hourlyEmpAPI= 'http://localhost:8000/hourlyEmp/add';
        const reqBody = {
            ssn: ssn,
            hourPay: hourPay,
        }

        fetch(hourlyEmpAPI , {
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
            .catch (error => console.error('Couldnt add hourlyEmp',error));
        location.reload();
    }

    function editHourlyEmp (ssn, hourPay){
        if (!ssn || !hourPay|| ssn.length!=9 || hourPay<7.50){
            editError();
            return;
        } 
        const hourlyEmpAPI= 'http://localhost:8000/hourlyEmp/edit';
        const reqBody = {
            ssn: ssn,
            hourPay: hourPay,
        }

        fetch (hourlyEmpAPI, {
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
            .then(data =>{
                getHourlyEmpList();
            })
            .catch (error => console.error('Couldnt edit Hourly Employee', error));
        location.reload();
    }

    function deleteHourlyEmp (deleteSSN){
        if (!deleteSSN){
            deleteError();
            return;
        }
        const hourlyEmpAPI= 'http://localhost:8000/hourlyEmp/delete';
        const reqBody = {
            ssn: deleteSSN,
        }

        fetch (hourlyEmpAPI, {
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
            .then(data =>{
                getHourlyEmpList();
            })
            .catch (error => console.error('Couldnt delete hourly employee', error));
        location.reload();
    }

    function searchError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const addSection = document.getElementById('search');
        const addErrorMsg = document.createElement('p');
        addErrorMsg.setAttribute('id', 'errorMessage');
        addErrorMsg.textContent="INVALID SEARCH REQUEST"
        addSection.appendChild(addErrorMsg);
    }

    function addError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const addSection = document.getElementById('add');
        const addErrorMsg = document.createElement('p');
        addErrorMsg.setAttribute('id', 'errorMessage');
        addErrorMsg.textContent="INVALID ADD REQUEST"
        addSection.appendChild(addErrorMsg);
    }

    function editError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const editSection = document.getElementById('edit');
        const editErrorMsg = document.createElement('p');
        editErrorMsg.setAttribute('id', 'errorMessage');
        editErrorMsg.textContent="INVALID EDIT REQUEST"
        editSection.appendChild(editErrorMsg);
    }

    function deleteError(){
        const errorMsg= document.getElementById('errorMessage');
        if (errorMsg){
            errorMsg.parentNode.removeChild(errorMsg);
        }
        const deleteSection = document.getElementById('delete');
        const deleteErrorMsg = document.createElement('p');
        deleteErrorMsg.setAttribute('id', 'errorMessage');
        deleteErrorMsg.textContent="INVALID DELETE REQUEST"
        deleteSection.appendChild(deleteErrorMsg);
    }
})