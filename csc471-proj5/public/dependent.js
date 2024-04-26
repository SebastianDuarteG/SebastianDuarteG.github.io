document.addEventListener('DOMContentLoaded', function(){
    getDependentList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchSSN = document.getElementById('searchSSN').value;
        const searchName = document.getElementById('searchName').value;
        searchDependent(searchSSN, searchName);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const SSN = document.getElementById('addSSN').value;
        const name = document.getElementById('addName').value;
        const relation = document.getElementById('addRelation').value;
        addDependent (SSN, name, relation);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const SSN = document.getElementById('editSSN').value;
        const name = document.getElementById('editName').value;
        const relation = document.getElementById('editRelation').value;
        editDependent (SSN, name, relation);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteSSN = document.getElementById('deleteSSN').value;
        const deleteName = document.getElementById('deleteName').value;
        deleteDependent (deleteSSN, deleteName);
    });


    function getDependentList (){
        const dependentAPI = `http://localhost:8000/dependent`;
        fetch (dependentAPI)
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

    function displayList (dependentList){
        const dependentTable = document.getElementById('dependentTable');
        dependentTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'SSN';
        const column2 = document.createElement ('th');
        column2.textContent = 'Name';
        const column3 = document.createElement ('th');
        column3.textContent = 'Relation';
        row1.appendChild (column1);
        row1.appendChild (column2);
        row1.appendChild (column3);
        dependentTable.appendChild(row1);

        dependentList.forEach(dependent=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = dependent.ssn;
            const columnB = document.createElement ('th');
            columnB.textContent = dependent.name;
            const columnC = document.createElement ('th');
            columnC.textContent = dependent.relation;
            row.appendChild (columnA);
            row.appendChild (columnB);
            row.appendChild (columnC);
            dependentTable.appendChild(row);
        });
    }

    function searchDependent (searchSSN, searchName){
        if (!searchSSN || !searchName){
            location.reload();
        } 

        const dependentAPI= "http://localhost:8000/dependent/search";
        fetch(dependentAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ssn': `${searchSSN}`,
                'name': `${searchName}`,
            }
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data =>{
                const dependentTable = document.getElementById('dependentTable');
                dependentTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'SSN';
                const column2 = document.createElement ('th');
                column2.textContent = 'Name';
                const column3 = document.createElement ('th');
                column3.textContent = 'Relation';
                row1.appendChild (column1);
                row1.appendChild (column2);
                row1.appendChild (column3);
                dependentTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.ssn;
                const columnB = document.createElement ('th');
                columnB.textContent = data.name;
                const columnC = document.createElement ('th');
                columnC.textContent = data.relation;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                row.appendChild (columnC);
                dependentTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search dependent',error));
    }

    function addDependent (SSN, name, relation){
        if (!SSN || !name || !relation){
            addError();
            return;
        } 
        const dependentAPI= 'http://localhost:8000/dependent/add';
        const reqBody = {
            ssn: SSN,
            name: name,
            relation: relation, 
        }

        fetch(dependentAPI , {
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
            .catch (error => console.error('Couldnt add dependent',error));
        location.reload();
    }

    function editDependent (SSN, name, relation){
        if (!SSN || !name || !relation){
            editError();
            return;
        } 
        const dependentAPI= 'http://localhost:8000/dependent/edit';
        const reqBody = {
            ssn: SSN,
            name: name,
            relation: relation,
        }

        fetch (dependentAPI, {
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
                getDependentList();
            })
            .catch (error => console.error('Couldnt edit dependent', error));
        location.reload();
    }

    function deleteDependent (deleteSSN, deleteName){
        if (!deleteSSN || !deleteName){
            deleteError();
            return;
        }
        const dependentAPI= 'http://localhost:8000/dependent/delete';
        const reqBody = {
            ssn: deleteSSN,
            name: deleteName,
        }

        fetch (dependentAPI, {
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
                getDependentList();
            })
            .catch (error => console.error('Couldnt delete dependent', error));
        location.reload();
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