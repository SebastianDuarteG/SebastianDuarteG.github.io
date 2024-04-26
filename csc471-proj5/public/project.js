document.addEventListener('DOMContentLoaded', function(){
    getProjectList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchProjNum = document.getElementById('searchProjNum').value;
        searchProject(searchProjNum);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const projNum = document.getElementById('addProjNum').value;
        const projName = document.getElementById('addProjName').value;
        const projDesc = document.getElementById('addProjDesc').value;
        addProject (projNum, projName, projDesc);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const projNum = document.getElementById('editProjNum').value;
        const projName = document.getElementById('editProjName').value;
        const projDesc = document.getElementById('editProjDesc').value;
        editProject (projNum, projName, projDesc);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteProjNum = document.getElementById('deleteProjNum').value;
        deleteProject (deleteProjNum);
    });


    function getProjectList (){
        const projectListAPI = `http://localhost:8000/project`;
        fetch (projectListAPI)
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

    function displayList (projectList){
        const projectTable = document.getElementById('projectTable');
        projectTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'projNum';
        const column2 = document.createElement ('th');
        column2.textContent = 'projName';
        const column3 = document.createElement ('th');
        column3.textContent = 'projDesc';
        row1.appendChild (column1);
        row1.appendChild (column2);
        row1.appendChild (column3);
        projectTable.appendChild(row1);

        projectList.forEach(project=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = project.projNum;
            const columnB = document.createElement ('th');
            columnB.textContent = project.projName;
            const columnC = document.createElement ('th');
            columnC.textContent = project.projDesc;
            row.appendChild (columnA);
            row.appendChild (columnB);
            row.appendChild (columnC);
            projectTable.appendChild(row);
        });
    }

    function searchProject (searchProjNum){
        if (!searchProjNum){
            location.reload();
        } 

        const projectAPI= "http://localhost:8000/project/search";
        fetch(projectAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'projNum': `${searchProjNum}`,
            }
        })
            .then(response=> {
                if (!response.ok){
                    throw new Error ('Response not ok');
                }
                return response.json();
            })
            .then (data =>{
                const projectTable = document.getElementById('projectTable');
                projectTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'projNum';
                const column2 = document.createElement ('th');
                column2.textContent = 'projName';
                const column3 = document.createElement ('th');
                column3.textContent = 'projDesc';
                row1.appendChild (column1);
                row1.appendChild (column2);
                row1.appendChild (column3);
                projectTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.projNum;
                const columnB = document.createElement ('th');
                columnB.textContent = data.projName;
                const columnC = document.createElement ('th');
                columnC.textContent = data.projDesc;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                row.appendChild (columnC);
                projectTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search project',error));
    }

    function addProject (projNum, projName, projDesc){
        if (!projNum || !projName || !projDesc){
            addError();
            return;
        } 
        const projectAPI= 'http://localhost:8000/project/add';
        const reqBody = {
            projNum: projNum,
            projName: projName,
            projDesc: projDesc, 
        }

        fetch(projectAPI , {
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
            .catch (error => console.error('Couldnt add Project',error));
        location.reload();
    }

    function editProject (projNum, projName, projDesc){
        if (!projNum || !projName || !projDesc){
            editError();
            return;
        } 
        const projectAPI= 'http://localhost:8000/project/edit';
        const reqBody = {
            projNum: projNum,
            projName: projName,
            projDesc: projDesc,
        }

        fetch (projectAPI, {
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
                getProjectList();
            })
            .catch (error => console.error('Couldnt edit Project', error));
        location.reload();
    }

    function deleteProject (deleteProjNum){
        if (!deleteProjNum){
            deleteError();
            return;
        }
        const projectAPI= 'http://localhost:8000/project/delete';
        const reqBody = {
            projNum: deleteProjNum,
        }

        fetch (projectAPI, {
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
                getProjectList();
            })
            .catch (error => console.error('Couldnt delete project', error));
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