document.addEventListener('DOMContentLoaded', function(){
    getSalariedEmpList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchSSN = document.getElementById('searchSSN').value;
        searchSalariedEmp(searchSSN);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const ssn = document.getElementById('addSSN').value;
        const salary = document.getElementById('addSalary').value;
        addSalariedEmp (ssn, salary);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const ssn = document.getElementById('editSSN').value;
        const salary = document.getElementById('editSalary').value;
        editSalariedEmp(ssn, salary);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteSSN = document.getElementById('deleteSSN').value;
        deleteSalariedEmp(deleteSSN);
    });


    function getSalariedEmpList (){
        const salariedEmpListAPI = `http://localhost:8000/salariedEmp`;
        fetch (salariedEmpListAPI)
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

    function displayList (salariedEmpList){
        const salariedEmpTable = document.getElementById('salariedEmpTable');
        salariedEmpTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'SSN';
        const column2 = document.createElement ('th');
        column2.textContent = 'Salary';
        row1.appendChild (column1);
        row1.appendChild (column2);
        salariedEmpTable.appendChild(row1);

        salariedEmpList.forEach(salariedEmp=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = salariedEmp.ssn;
            const columnB = document.createElement ('th');
            columnB.textContent = salariedEmp.salary;
            row.appendChild (columnA);
            row.appendChild (columnB);
            salariedEmpTable.appendChild(row);
        });
    }

    function searchSalariedEmp (searchSSN){
        if (!searchSSN){
            location.reload();
        } else if (searchSSN.length!=9 ) {
            searchError();
            return;
        }

        const salariedEmpAPI= 'http://localhost:8000/salariedEmp/search';

        fetch(salariedEmpAPI , {
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
                const salariedEmpTable = document.getElementById('salariedEmpTable');
                salariedEmpTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'SSN';
                const column2 = document.createElement ('th');
                column2.textContent = 'Salary';
                row1.appendChild (column1);
                row1.appendChild (column2);
                salariedEmpTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.ssn;
                const columnB = document.createElement ('th');
                columnB.textContent = data.salary;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                salariedEmpTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search salariedEmp',error));
    }

    function addSalariedEmp (ssn, salary){
        if (!ssn || !salary || ssn.length!=9){
            addError();
            return;
        } 
        const salariedEmpAPI= 'http://localhost:8000/salariedEmp/add';
        const reqBody = {
            ssn: ssn,
            salary: salary,
        }

        fetch(salariedEmpAPI , {
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
            .catch (error => console.error('Couldnt add salariedEmp',error));
        location.reload();
    }

    function editSalariedEmp (ssn, salary){
        if (!ssn || !salary|| ssn.length!=9){
            editError();
            return;
        } 
        const salariedEmpAPI= 'http://localhost:8000/salariedEmp/edit';
        const reqBody = {
            ssn: ssn,
            salary: salary,
        }

        fetch (salariedEmpAPI, {
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
                getSalariedEmpList();
            })
            .catch (error => console.error('Couldnt edit Salaried Employee', error));
        location.reload();
    }

    function deleteSalariedEmp (deleteSSN){
        if (!deleteSSN){
            deleteError();
            return;
        }
        const salariedEmpAPI= 'http://localhost:8000/salariedEmp/delete';
        const reqBody = {
            ssn: deleteSSN,
        }

        fetch (salariedEmpAPI, {
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
                getSalariedEmpList();
            })
            .catch (error => console.error('Couldnt delete salaried employee', error));
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