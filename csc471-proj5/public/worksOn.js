document.addEventListener('DOMContentLoaded', function(){
    getWorksOnList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchSSN = document.getElementById('searchSSN').value;
        searchWorksOn(searchSSN);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const SSN = document.getElementById('addSSN').value;
        const deptNum = document.getElementById('addDeptNum').value;
        const projNum = document.getElementById('addProjNum').value;
        addWorksOn (SSN, deptNum, projNum);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const SSN = document.getElementById('editSSN').value;
        const deptNum = document.getElementById('editDeptNum').value;
        const projNum = document.getElementById('editProjNum').value;
        editWorksOn (SSN, deptNum, projNum);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteSSN = document.getElementById('deleteSSN').value;
        deleteWorksOn (deleteSSN);
    });


    function getWorksOnList (){
        const worksOnListAPI = `http://localhost:8000/worksOn`;
        fetch (worksOnListAPI)
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

    function displayList (worksOnList){
        const worksOnTable = document.getElementById('worksOnTable');
        worksOnTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'SSN';
        const column2 = document.createElement ('th');
        column2.textContent = 'deptNum';
        const column3 = document.createElement ('th');
        column3.textContent = 'projNum';
        row1.appendChild (column1);
        row1.appendChild (column2);
        row1.appendChild (column3);
        worksOnTable.appendChild(row1);

        worksOnList.forEach(worksOn=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = worksOn.ssn;
            const columnB = document.createElement ('th');
            columnB.textContent = worksOn.deptNum;
            const columnC = document.createElement ('th');
            columnC.textContent = worksOn.projNum;
            row.appendChild (columnA);
            row.appendChild (columnB);
            row.appendChild (columnC);
            worksOnTable.appendChild(row);
        });
    }

    function searchWorksOn (searchSSN){
        if (!searchSSN){
            location.reload();
        } 

        const worksOnAPI= "http://localhost:8000/worksOn/search";
        fetch(worksOnAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ssn': `${searchSSN}`,
            }
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data =>{
                const worksOnTable = document.getElementById('worksOnTable');
                worksOnTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'SSN';
                const column2 = document.createElement ('th');
                column2.textContent = 'deptNum';
                const column3 = document.createElement ('th');
                column3.textContent = 'projNum';
                row1.appendChild (column1);
                row1.appendChild (column2);
                row1.appendChild (column3);
                worksOnTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.ssn;
                const columnB = document.createElement ('th');
                columnB.textContent = data.deptNum;
                const columnC = document.createElement ('th');
                columnC.textContent = data.projNum;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                row.appendChild (columnC);
                worksOnTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search worksOn',error));
    }

    function addWorksOn (SSN, deptNum, projNum){
        if (!SSN || !deptNum || !projNum){
            addError();
            return;
        } 
        const worksOnAPI= 'http://localhost:8000/worksOn/add';
        const reqBody = {
            ssn: SSN,
            deptNum: deptNum,
            projNum: projNum, 
        }

        fetch(worksOnAPI , {
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
            .catch (error => console.error('Couldnt add worksOn',error));
        location.reload();
    }

    function editWorksOn (SSN, deptNum, projNum){
        if (!SSN || !deptNum || !projNum){
            editError();
            return;
        } 
        const worksOnAPI= 'http://localhost:8000/worksOn/edit';
        const reqBody = {
            ssn: SSN,
            deptNum: deptNum,
            projNum: projNum,
        }

        fetch (worksOnAPI, {
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
                getWorksOnList();
            })
            .catch (error => console.error('Couldnt edit worksOn', error));
        location.reload();
    }

    function deleteWorksOn (deleteSSN){
        if (!deleteSSN){
            deleteError();
            return;
        }
        const worksOnAPI= 'http://localhost:8000/worksOn/delete';
        const reqBody = {
            ssn: deleteSSN,
        }

        fetch (worksOnAPI, {
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
                getWorksOnList();
            })
            .catch (error => console.error('Couldnt delete worksOn', error));
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