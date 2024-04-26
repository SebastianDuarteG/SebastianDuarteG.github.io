document.addEventListener('DOMContentLoaded', function(){
    getLocationList();
    
    const searchButton = document.getElementById('find');
    searchButton.addEventListener('click', function(){
        const searchDeptNum = document.getElementById('searchDeptNum').value;
        searchLocation(searchDeptNum);
    });

    const addButton = document.getElementById('create');
    addButton.addEventListener('click', function(){
        const deptNum = document.getElementById('addDeptNum').value;
        const locAddress = document.getElementById('addLocAddress').value;
        addLocation (deptNum, locAddress);
    });
    
    const editButton = document.getElementById('alter');
    editButton.addEventListener('click', function(){
        const deptNum = document.getElementById('editDeptNum').value;
        const locAddress = document.getElementById('editLocAddress').value;
        editLocation (deptNum, locAddress);
    });

    const deleteButton = document.getElementById('remove');
    deleteButton.addEventListener('click', function(){
        const deleteDeptNum = document.getElementById('deleteDeptNum').value;
        deleteLocation (deleteDeptNum);
    });


    function getLocationList (){
        const locationListAPI = `http://localhost:8000/location`;
        fetch (locationListAPI)
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

    function displayList (locationList){
        const locationTable = document.getElementById('locationTable');
        locationTable.innerHTML = '';

        const row1 = document.createElement ('tr');
        const column1 = document.createElement ('th');
        column1.textContent = 'DeptNum';
        const column2 = document.createElement ('th');
        column2.textContent = 'locAddress';
        row1.appendChild (column1);
        row1.appendChild (column2);
        locationTable.appendChild(row1);

        locationList.forEach(location=> {
            const row = document.createElement ('tr');
            const columnA = document.createElement ('th');
            columnA.textContent = location.deptNum;
            const columnB = document.createElement ('th');
            columnB.textContent = location.locAddress;
            row.appendChild (columnA);
            row.appendChild (columnB);
            locationTable.appendChild(row);
        });
    }

    function searchLocation (searchDeptNum){
        if (!searchDeptNum){
            location.reload();
        } 

        const locationAPI= "http://localhost:8000/location/search";
        fetch(locationAPI, {
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
                const locationTable = document.getElementById('locationTable');
                locationTable.innerHTML = '';

                const row1 = document.createElement ('tr');
                const column1 = document.createElement ('th');
                column1.textContent = 'deptNum';
                const column2 = document.createElement ('th');
                column2.textContent = 'locAddress';
                row1.appendChild (column1);
                row1.appendChild (column2);
                locationTable.appendChild(row1);
                const row = document.createElement ('tr');
                const columnA = document.createElement ('th');
                columnA.textContent = data.deptNum;
                const columnB = document.createElement ('th');
                columnB.textContent = data.locAddress;
                row.appendChild (columnA);                    
                row.appendChild (columnB);
                locationTable.appendChild(row);
            })
            .catch (error => console.error('Couldnt search location',error));
    }

    function addLocation (deptNum, locAddress){
        if (!deptNum || !locAddress){
            addError();
            return;
        } 
        const locationAPI= 'http://localhost:8000/location/add';
        const reqBody = {
            deptNum: deptNum,
            locAddress: locAddress, 
        }

        fetch(locationAPI , {
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
            .catch (error => console.error('Couldnt add location',error));
        location.reload();
    }

    function editLocation (deptNum, locAddress){
        if (!deptNum || !locAddress){
            editError();
            return;
        } 
        const locationAPI= 'http://localhost:8000/location/edit';
        const reqBody = {
            deptNum: deptNum,
            locAddress: locAddress,
        }

        fetch (locationAPI, {
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
                getLocationList();
            })
            .catch (error => console.error('Couldnt edit Location', error));
        location.reload();
    }

    function deleteLocation (deleteDeptNum){
        if (!deleteDeptNum){
            deleteError();
            return;
        }
        const locationAPI= 'http://localhost:8000/location/delete';
        const reqBody = {
            deptNum: deleteDeptNum,
        }

        fetch (locationAPI, {
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
                getLocationList();
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