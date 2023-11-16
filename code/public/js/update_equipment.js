// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateEquipmentForm = document.getElementById('update-equipment-form-ajax');

// Modify the objects we need
updateEquipmentForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEquipmentID = document.getElementById("mySelect");
    let inputFarmID = document.getElementById("input-equipment-farm-id-update");
    let inputEquipmentName = document.getElementById("input-equipment-name-update");
    let inputEquipmentPurchaseDate = document.getElementById("input-equipment-purchase-date-update");
    let inputEquipmentCost = document.getElementById("input-equipment-cost-update");
    let inputEquipmentValue = document.getElementById("input-equipment-value-update");
    let inputEquipmentMaintenanceDate = document.getElementById("input-equipment-maintenance-date-update");

    // Get the values from the form fields
    let equipmentIDValue = inputEquipmentID.value;
    let equipmentFarmIDValue = inputFarmID.value;
    let EquipmentNameValue = inputEquipmentName.value;
    let equipmentPurchaseDateValue = inputEquipmentPurchaseDate.value;
    let equipmentCostValue = inputEquipmentCost.value;
    let equipmentValueValue = inputEquipmentValue.value;
    let equipmentMaintenanceDateValue = inputEquipmentMaintenanceDate.value;

    // Convert the dates to JavaScript Date objects
    let purchaseDate = new Date(equipmentPurchaseDateValue);
    let maintenanceDate = new Date(equipmentMaintenanceDateValue);

    // Check if sell by date is earlier than harvest date
    if(purchaseDate > maintenanceDate){
        return alert("Maintenance date cannot be earlier than the Purchase date.");
        };
    
            // Convert the cost and value to numbers
    let equipmentCost = Number(equipmentCostValue);
    let equipmentValue = Number(equipmentValueValue);

    // Check if cost is greater than value
    if(equipmentCost > equipmentValue){
        return alert("Equipment value should be greater than cost.");
    };


    // Put our data we want to send in a javascript object
    let data = {
        equipmentID: equipmentIDValue,
        equipmentFarmID: equipmentFarmIDValue,
        equipmentName: EquipmentNameValue,
        //equipmentPurchaseDate: equipmentPurchaseDateValue,
        equipmentPurchaseDate: purchaseDate,
        //equipmentCost: equipmentCostValue,
        equipmentCost: equipmentCost,
        //equipmentValue: equipmentValueValue,
        equipmentValue: equipmentValue,
        //equipmentMaintenanceDate: equipmentMaintenanceDateValue,
        equipmentMaintenanceDate: maintenanceDate,
    }


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-equipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, equipmentIDValue);

            
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
function confirmUpdate() {
    return confirm('Are you sure you want to update this row?');
}

function autofillForm(row_index) {
    let table = document.getElementById("equipment-table");

    let selectedRow = table.rows[row_index]
    document.getElementById("mySelect").value = selectedRow.cells[0].innerHTML;
    document.getElementById("input-equipment-farm-id-update").value = selectedRow.cells[1].innerHTML;
    document.getElementById("input-equipment-name-update").value = selectedRow.cells[2].innerHTML;
    document.getElementById("input-equipment-cost-update").value = selectedRow.cells[4].innerHTML;
    document.getElementById("input-equipment-value-update").value = selectedRow.cells[5].innerHTML;

    let date_purchase = new Date(selectedRow.cells[3].innerHTML);
    let date_maintenance = new Date(selectedRow.cells[6].innerHTML);
    document.getElementById("input-equipment-purchase-date-update").value = date_purchase.toISOString().split('T')[0];

    if (selectedRow.cells[6].innerHTML.trim() !== '') {
        let date_maintenance = new Date(selectedRow.cells[6].innerHTML);
        document.getElementById("input-equipment-maintenance-date-update").value = date_maintenance.toISOString().split('T')[0];
    } else {
        document.getElementById("input-equipment-maintenance-date-update").value = '';
    }
    
}

function updateRow(data, equipmentID) {
    let parsedData = JSON.parse(data);

    console.log(parsedData)

    let table = document.getElementById("equipment-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == equipmentID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of attributes value
            let tdfarmid = updateRowIndex.getElementsByTagName("td")[1];
            let tdequipmentname = updateRowIndex.getElementsByTagName("td")[2];
            let tdpurchasedate = updateRowIndex.getElementsByTagName("td")[3];
            let tdcost = updateRowIndex.getElementsByTagName("td")[4];
            let tdvalue = updateRowIndex.getElementsByTagName("td")[5];
            let tdmaintenancedate = updateRowIndex.getElementsByTagName("td")[6];


            // Reassign atrtributes to our value we updated to
            tdfarmid.innerHTML = parsedData[0].farm_id;
            tdequipmentname.innerHTML = parsedData[0].equipment_name;
            tdpurchasedate.innerHTML = parsedData[0].purchase_date;
            tdcost.innerHTML = parsedData[0].equipment_cost;
            tdvalue.innerHTML = parsedData[0].equipment_value;
            tdmaintenancedate.innerHTML = parsedData[0].maintenance_date;

        }
    }
}
