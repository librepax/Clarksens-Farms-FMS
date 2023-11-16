// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addEquipmentForm = document.getElementById('add-equipment-form-ajax');

// Modify the objects we need
addEquipmentForm.addEventListener("submit", function (e) {


    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFarmID = document.getElementById("input-farm-id");
    let inputEquipmentName = document.getElementById("input-equipment-name");
    let inputEquipmentPurchaseDate = document.getElementById("input-equipment-purchase-date");
    let inputEquipmentCost = document.getElementById("input-equipment-cost");
    let inputEquipmentValue = document.getElementById("input-equipment-value");
    let inputEquipmentMaintenanceDate = document.getElementById("input-equipment-maintenance-date");



    // Get the values from the form fields
    let farmIDValue = inputFarmID.value;
    let equipmentNameValue = inputEquipmentName.value;
    let equipmentPurchaseDateValue = inputEquipmentPurchaseDate.value;
    let equipmentCostValue = inputEquipmentCost.value;
    let equipmenValueValue = inputEquipmentValue.value;
    let equipmentMaintenanceDateValue = inputEquipmentMaintenanceDate.value;

    // Convert the dates to JavaScript Date objects
    let purchaseDate = new Date(equipmentPurchaseDateValue);
    let maintenanceDate = new Date(equipmentMaintenanceDateValue);

    // Check if sell by date is earlier than harvest date
    if(purchaseDate > maintenanceDate){
        return alert("Maintenance date cannot be earlier than the Purchase date.");
        }
    
    // Convert the cost and value to numbers
    let equipmentCost = Number(equipmentCostValue);
    let equipmentValue = Number(equipmenValueValue);

    // Check if cost is greater than value
    if(equipmentCost > equipmentValue){
        return alert("Equipment value should be greater than cost.");
    }

    // Put our data we want to send in a javascript object
    let data = {
        farmID: farmIDValue,
        equipmentName: equipmentNameValue,
        equipmentPurchaseDate: equipmentPurchaseDateValue,
        equipmentCost: equipmentCostValue,
        equipmentValue: equipmenValueValue,
        equipmentMaintenanceDate: equipmentMaintenanceDateValue
    }


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-equipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFarmID.value = '';
            inputEquipmentName.value = '';
            inputEquipmentPurchaseDate.value = '';
            inputEquipmentCost.value = '';
            inputEquipmentValue.value = '';
            inputEquipmentMaintenanceDate.value = '';

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
    let currentTable = document.getElementById("equipment-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let equipmentIDCell = document.createElement("TD");
    let farmIDCell = document.createElement("TD");
    let equipmentNameCell = document.createElement("TD");
    let equipmentPurchaseDateCell = document.createElement("TD");
    let equipmentCostCell = document.createElement("TD");
    let equipmentValueCell = document.createElement("TD");
    let equipmentMaintenanceCell = document.createElement("TD");

    //let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    equipmentIDCell.innerText = newRow.equipment_id;
    farmIDCell.innerText = newRow.farm_id;
    equipmentNameCell.innerText = newRow.equipment_name;
    equipmentPurchaseDateCell.innerText = newRow.purchase_date;
    equipmentCostCell.innerText = newRow.equipment_cost;
    equipmentValueCell.innerText = newRow.equipment_value;
    equipmentMaintenanceCell.innerText = newRow.maintenance_date;

    //deleteCell = document.createElement("button");
    //deleteCell.innerHTML = "Delete";
    //deleteCell.onclick = function () {
        //deleteEquipment(newRow.equipment_id);
    //};


    // Add the cells to the row
    row.appendChild(equipmentIDCell);
    row.appendChild(farmIDCell);
    row.appendChild(equipmentNameCell);
    row.appendChild(equipmentPurchaseDateCell);
    row.appendChild(equipmentCostCell);
    row.appendChild(equipmentValueCell);
    row.appendChild(equipmentMaintenanceCell);
    //row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    //row.setAttribute('data-value', newRow.equipment_id);


    // Add the row to the table
    currentTable.appendChild(row);

    //let selectMenu = document.getElementById("mySelect");
    //let option = document.createElement("option");
    //option.text = newRow.equipment_id;
    //option.value = newRow.equipment_id;
    //selectMenu.add(option);
}
