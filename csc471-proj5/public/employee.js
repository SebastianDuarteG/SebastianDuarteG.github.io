document.addEventListener('DOMContentLoaded', function(){
    getEmployeeList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchSSN = document.getElementById('searchSSN').value;
        searchEmployee(searchSSN);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const ssn = document.getElementById('addSSN').value;
        const DOB = document.getElementById('addDOB').value;
        const fName = document.getElementById('addfName').value;
        const mInit = document.getElementById('addmInit').value;
        const lName = document.getElementById('addlName').value;
        const address = document.getElementById('addaddress').value;
        addEmployee (ssn, DOB, fName, mInit, lName, address);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const ssn = document.getElementById('editSSN').value;
        const DOB = document.getElementById('editDOB').value;
        const fName = document.getElementById('editfName').value;
        const mInit = document.getElementById('editmInit').value;
        const lName = document.getElementById('editlName').value;
        const address = document.getElementById('editaddress').value;
        editEmployee(ssn, DOB, fName, mInit, lName, address);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteSSN = document.getElementById('deleteSSN').value;
        deleteEmployee(deleteSSN);
    });


    function getEmployeeList (){
        const employeeListAPI = `http://localhost:8000/employee`;
        fetch (employeeListAPI)
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

    function displayList (employeeList){
        const employeeTable = document.getElementById('employeeTable');
        employeeTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'SSN';
        const column2 = document.createElement ('th');
        column2.textContent = 'DOB';
        const column3 = document.createElement ('th');
        column3.textContent = 'fName';
        const column4 = document.createElement ('th');
        column4.textContent = 'mInit';
        const column5 = document.createElement ('th');
        column5.textContent = 'lName';
        const column6 = document.createElement ('th');
        column6.textContent = 'adress';
        row1.appendChild (column1);
        row1.appendChild (column2);
        row1.appendChild (column3);
        row1.appendChild (column4);
        row1.appendChild (column5);
        row1.appendChild (column6);
        employeeTable.appendChild(row1);

        employeeList.forEach(employee=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = employee.ssn;
            const columnB = document.createElement ('th');
            columnB.textContent = employee.DOB;
            const columnC = document.createElement ('th');
            columnC.textContent = employee.fName;
            const columnD = document.createElement ('th');
            columnD.textContent = employee.mInit;
            const columnE = document.createElement ('th');
            columnE.textContent = employee.lName;
            const columnF = document.createElement ('th');
            columnF.textContent = employee.address;
            row.appendChild (columnA);
            row.appendChild (columnB);
            row.appendChild (columnC);
            row.appendChild (columnD);
            row.appendChild (columnE);
            row.appendChild (columnF);
            employeeTable.appendChild(row);
        });
    }

    function searchEmployee (searchSSN){
        if (!searchSSN){
            location.reload();
        } else if (searchSSN.length!=9 ) {
            searchError();
            return;
        }

        const taskListAPI= 'http://localhost:8000/employee/search';

        fetch(taskListAPI , {
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
                const employeeTable = document.getElementById('employeeTable');
                employeeTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'SSN';
                const column2 = document.createElement ('th');
                column2.textContent = 'DOB';
                const column3 = document.createElement ('th');
                column3.textContent = 'fName';
                const column4 = document.createElement ('th');
                column4.textContent = 'mInit';
                const column5 = document.createElement ('th');
                column5.textContent = 'lName';
                const column6 = document.createElement ('th');
                column6.textContent = 'adress';
                row1.appendChild (column1);
                row1.appendChild (column2);
                row1.appendChild (column3);
                row1.appendChild (column4);
                row1.appendChild (column5);
                row1.appendChild (column6);
                employeeTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.ssn;
                const columnB = document.createElement ('th');
                columnB.textContent = data.DOB;
                const columnC = document.createElement ('th');
                columnC.textContent = data.fName;
                const columnD = document.createElement ('th');
                columnD.textContent = data.mInit;
                const columnE = document.createElement ('th');
                columnE.textContent = data.lName;
                const columnF = document.createElement ('th');
                columnF.textContent = data.address;
                row.appendChild (columnA);                    row.appendChild (columnB);
                row.appendChild (columnC);
                row.appendChild (columnD);
                row.appendChild (columnE);
                row.appendChild (columnF);
                employeeTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search employee',error));
    }

    function addEmployee (ssn, DOB, fName, mInit, lName, address){
        if (!ssn || !DOB || !fName || !lName || !address || ssn.length!=9){
            addError();
            return;
        } else if (!mInit){
            mInit = "N/A"
        } 
        const employeeAPI= 'http://localhost:8000/employee/add';
        const reqBody = {
            ssn: ssn,
            DOB: DOB,
            fName: fName,
            mInit: mInit,
            lName: lName,
            address: address,
        }

        fetch(employeeAPI , {
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
            .catch (error => console.error('Couldnt add task',error));
        location.reload();
    }

    function editEmployee (ssn, DOB, fName, mInit, lName, address){
        if (!ssn || !DOB || !fName || !lName || !address || ssn.length!=9){
            editError();
            return;
        } else if (!mInit){
            mInit = "N/A"
        } 
        const employeeAPI= 'http://localhost:8000/employee/edit';
        const reqBody = {
            ssn: ssn,
            DOB: DOB,
            fName: fName,
            mInit: mInit,
            lName: lName,
            address: address,
        }

        fetch (employeeAPI, {
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
                getEmployeeList();
            })
            .catch (error => console.error('Couldnt edit task', error));
        location.reload();
    }

    function deleteEmployee (deleteSSN){
        if (!deleteSSN){
            deleteError();
            return;
        }
        const employeeAPI= 'http://localhost:8000/employee/delete';
        const reqBody = {
            ssn: deleteSSN,
        }

        fetch (employeeAPI, {
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
                getEmployeeList();
            })
            .catch (error => console.error('Couldnt delete task', error));
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