document.addEventListener('DOMContentLoaded', function(){
    getDepartmentList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchDeptNum = document.getElementById('searchDeptNum').value;
        searchDepartment(searchDeptNum);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const deptNum = document.getElementById('addDeptNum').value;
        const deptName = document.getElementById('addDeptName').value;
        const numEmp = document.getElementById('addNumEmp').value;
        addDepartment (deptNum, deptName, numEmp);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const deptNum = document.getElementById('editDeptNum').value;
        const deptName = document.getElementById('editDeptName').value;
        const numEmp = document.getElementById('editNumEmp').value;
        editDepartment (deptNum, deptName, numEmp);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteDeptNum = document.getElementById('deleteDeptNum').value;
        deleteDepartment (deleteDeptNum);
    });


    function getDepartmentList (){
        const departmentListAPI = `http://localhost:8000/department`;
        fetch (departmentListAPI)
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

    function displayList (departmentList){
        const departmentTable = document.getElementById('departmentTable');
        departmentTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'DeptNum';
        const column2 = document.createElement ('th');
        column2.textContent = 'DeptName';
        const column3 = document.createElement ('th');
        column3.textContent = 'NumEmp';
        row1.appendChild (column1);
        row1.appendChild (column2);
        row1.appendChild (column3);
        departmentTable.appendChild(row1);

        departmentList.forEach(department=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = department.deptNum;
            const columnB = document.createElement ('th');
            columnB.textContent = department.deptName;
            const columnC = document.createElement ('th');
            columnC.textContent =department.numEmp;
            row.appendChild (columnA);
            row.appendChild (columnB);
            row.appendChild (columnC);
            departmentTable.appendChild(row);
        });
    }

    function searchDepartment (searchDeptNum){
        if (!searchDeptNum){
            location.reload();
        } 

        const departmentAPI= "http://localhost:8000/department/search";
        fetch(departmentAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'deptnum': `${searchDeptNum}`,
            }
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data =>{
                const departmentTable = document.getElementById('departmentTable');
                departmentTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'deptNum';
                const column2 = document.createElement ('th');
                column2.textContent = 'deptName';
                const column3 = document.createElement ('th');
                column3.textContent = 'numEmp';
                row1.appendChild (column1);
                row1.appendChild (column2);
                row1.appendChild (column3);
                departmentTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.deptNum;
                const columnB = document.createElement ('th');
                columnB.textContent = data.deptName;
                const columnC = document.createElement ('th');
                columnC.textContent = data.numEmp;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                row.appendChild(columnC);
                departmentTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search department',error));
    }

    function addDepartment (deptNum, deptName, numEmp){
        if (!deptNum || !deptName || !numEmp){
            addError();
            return;
        } 
        const departmentAPI= 'http://localhost:8000/department/add';
        const reqBody = {
            deptNum: deptNum,
            deptName: deptName,
            numEmp: numEmp,
        }

        fetch(departmentAPI , {
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
            .catch (error => console.error('Couldnt add department',error));
        location.reload();
    }

    function editDepartment (deptNum, deptName, numEmp){
        if (!deptNum || !deptName|| !numEmp){
            editError();
            return;
        } 
        const departmentAPI= 'http://localhost:8000/department/edit';
        const reqBody = {
            deptNum: deptNum,
            deptName: deptName,
            numEmp: numEmp,
        }

        fetch (departmentAPI, {
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
                getDepartmentList();
            })
            .catch (error => console.error('Couldnt edit Department', error));
        location.reload();
    }

    function deleteDepartment (deleteDeptNum){
        if (!deleteDeptNum){
            deleteError();
            return;
        }
        const departmentAPI= 'http://localhost:8000/department/delete';
        const reqBody = {
            deptNum: deleteDeptNum,
        }

        fetch (departmentAPI, {
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
                getDepartmentList();
            })
            .catch (error => console.error('Couldnt delete department', error));
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