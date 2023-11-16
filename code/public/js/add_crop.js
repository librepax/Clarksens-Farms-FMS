// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addCropForm = document.getElementById('add-crop-form-ajax');

// Modify the objects we need
addCropForm.addEventListener("submit", function (e) {


    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFarmID = document.getElementById("input-farm-id");
    let inputCropName = document.getElementById("input-crop-name");
    let inputUnitCost = document.getElementById("input-unit-cost");
    let inputUnitPrice = document.getElementById("input-unit-price");
    let inputQuantity = document.getElementById("input-quantity");
    let inputDateHarvested = document.getElementById("input-date-harvested");
    let inputDateSellBy = document.getElementById("input-date-sell-by");



    // Get the values from the form fields
    let farmIDValue = inputFarmID.value;
    let cropNameValue = inputCropName.value;
    let cropUnitCostValue = inputUnitCost.value;
    let cropUnitPriceValue = inputUnitPrice.value;
    let cropQuantityValue = inputQuantity.value;
    let cropDateHarvestedByValue = inputDateHarvested.value;
    let cropDateSellByValue = inputDateSellBy.value;

    // Convert the dates to JavaScript Date objects
    let sellByDate = new Date(cropDateSellByValue);
    let harvestDate = new Date(cropDateHarvestedByValue);

    // Check if sell by date is earlier than harvest date
    if(sellByDate < harvestDate){
        return alert("Sell by date cannot be earlier than the harvest date.");
        }
    
    // Convert the cost and value to numbers
    let unitCost = Number(cropUnitCostValue);
    let unitPrice = Number(cropUnitPriceValue);

    // Check if cost is greater than value
    if(unitCost > unitPrice){
        return alert("Unit price should be greater than unit cost.");
    };

    // Put our data we want to send in a javascript object
    let data = {
        farmID: farmIDValue,
        cropName: cropNameValue,
        cropUnitCost: cropUnitCostValue,
        cropUnitPrice: cropUnitPriceValue,
        cropQuantity: cropQuantityValue,
        cropDateHarvestedBy: cropDateHarvestedByValue,
        cropDateSellBy: cropDateSellByValue,
    }


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-crop-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFarmID.value = '';
            inputCropName.value = '';
            inputUnitCost.value = '';
            inputUnitPrice.value = '';
            inputQuantity.value = '';
            inputDateHarvested.value = '';
            inputDateSellBy.value = '';

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
    let currentTable = document.getElementById("crops-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let cropIDCell = document.createElement("TD");
    let farmIDCell = document.createElement("TD");
    let cropNameCell = document.createElement("TD");
    let cropUnitCostCell = document.createElement("TD");
    let cropUnitPriceCell = document.createElement("TD");
    let cropQuantityCell = document.createElement("TD");
    let cropDateHarvestedCell = document.createElement("TD");
    let cropDateSellByCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    cropIDCell.innerText = newRow.crop_id;
    farmIDCell.innerText = newRow.farm_id;
    cropNameCell.innerText = newRow.crop_name;
    cropUnitCostCell.innerText = newRow.unit_cost;
    cropUnitPriceCell.innerText = newRow.unit_price;
    cropQuantityCell.innerText = newRow.quantity;
    cropDateHarvestedCell.innerText = newRow.date_harvested;
    cropDateSellByCell.innerText = newRow.date_sell_by;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteCrop(newRow.crop_id)
    };



    // Add the cells to the row
    row.appendChild(cropIDCell);
    row.appendChild(farmIDCell);
    row.appendChild(cropNameCell);
    row.appendChild(cropUnitCostCell);
    row.appendChild(cropUnitPriceCell);
    row.appendChild(cropQuantityCell);
    row.appendChild(cropDateHarvestedCell);
    row.appendChild(cropDateSellByCell);

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.crop_id);


    // Add the row to the table
    currentTable.appendChild(row);


    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.crop_id;
    option.value = newRow.crop_id;
    selectMenu.add(option);

};


