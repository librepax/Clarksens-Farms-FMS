// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addFarmForm = document.getElementById('add-farm-form-ajax');

// Modify the objects we need
addFarmForm.addEventListener("submit", function (e) {


    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFarmName = document.getElementById("input-farm-name");
    let inputAcres = document.getElementById("input-acres");
    let inputAddress = document.getElementById("input-address");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let farmNameValue = inputFarmName.value;
    let acresValue = inputAcres.value;
    let addressValue = inputAddress.value;
    let descriptionValue = inputDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        farmname: farmNameValue,
        acres: acresValue,
        address: addressValue,
        description: descriptionValue
    }



    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-farm-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFarmName.value = '';
            inputAcres.value = '';
            inputAddress.value = '';
            inputDescription.value = '';
            
            // refresh page
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// function for confirm popup dialog
function confirmAdd() {
    return confirm('Are you sure you want to add this row?');
}

// Creates a single row from an Object representing a single record from entity
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("farm-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let farmIDCell = document.createElement("TD");
    let farmNameCell = document.createElement("TD");
    let acresCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");

    // Fill the cells with correct data
    farmIDCell.innerText = newRow.farm_id;
    farmNameCell.innerText = newRow.farm_name;
    acresCell.innerText = newRow.acres;
    addressCell.innerText = newRow.address;
    descriptionCell.innerText = newRow.description;

    // Add the cells to the row 
    row.appendChild(farmIDCell);
    row.appendChild(farmNameCell);
    row.appendChild(acresCell);
    row.appendChild(addressCell);
    row.appendChild(descriptionCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
