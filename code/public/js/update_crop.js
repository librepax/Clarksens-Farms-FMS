// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateCropForm = document.getElementById('update-crop-form-ajax');

// Modify the objects we need
updateCropForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCropID = document.getElementById("mySelect");
    let inputFarmID = document.getElementById("input-farm-id-update");
    let inputCropName = document.getElementById("input-crop-name-update");
    let inputUnitCost = document.getElementById("input-unit-cost-update");
    let inputUnitPrice = document.getElementById('input-unit-price-update');
    let inputQuantity = document.getElementById("input-quantity-update");
    let inputDateHarvested = document.getElementById("input-date-harvested-update");
    let inputDateSellBy = document.getElementById("input-date-sell-by-update");
    
    // Get the values from the form fields
    let cropIDValue = inputCropID.value;
    let farmIDValue = inputFarmID.value;
    let cropNameValue = inputCropName.value;
    let unitCostValue = inputUnitCost.value;
    let unitPriceValue = inputUnitPrice.value;
    let orderQuantityValue = inputQuantity.value;
    let dateHarvestedValue = inputDateHarvested.value;
    let dateSellByValue = inputDateSellBy.value;

    // Convert the dates to JavaScript Date objects
    let sellByDate = new Date(dateSellByValue);
    let harvestDate = new Date(dateHarvestedValue);

    // Check if sell by date is earlier than harvest date
    if(sellByDate < harvestDate){
        return alert("Sell by date cannot be earlier than the harvest date.");
        }

    // Convert the cost and value to numbers
    let unitCost = Number(unitCostValue);
    let unitPrice = Number(unitPriceValue);

    // Check if cost is greater than value
    if(unitCost > unitPrice){
        return alert("Unit price should be greater than unit cost.");
    };

    // Put our data we want to send in a javascript object
    let data = {
        cropID: cropIDValue,
        farmID: farmIDValue,
        cropName: cropNameValue,
        unitCost: unitCostValue,
        unitPrice: unitPriceValue,
        orderQuantity: orderQuantityValue,
        dateHarvested: dateHarvestedValue,
        dateSellBy: dateSellByValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-crop-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, cropIDValue);
            
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
    let table = document.getElementById("crops-table");

    let selectedRow = table.rows[row_index]
    document.getElementById("mySelect").value = selectedRow.cells[0].innerHTML;
    document.getElementById("input-farm-id-update").value = selectedRow.cells[1].innerHTML;
    document.getElementById("input-crop-name-update").value = selectedRow.cells[2].innerHTML;
    document.getElementById("input-unit-cost-update").value = selectedRow.cells[3].innerHTML;
    document.getElementById("input-unit-price-update").value = selectedRow.cells[4].innerHTML;
    document.getElementById("input-quantity-update").value = selectedRow.cells[5].innerHTML;

    let date_harvested = new Date(selectedRow.cells[6].innerHTML);
    let date_sell_by = new Date(selectedRow.cells[7].innerHTML);
    document.getElementById("input-date-harvested-update").value = date_harvested.toISOString().split('T')[0];
    document.getElementById("input-date-sell-by-update").value = date_sell_by.toISOString().split('T')[0];

}

function updateRow(data, cropID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("crops-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == cropID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of attributes value
            let tdfarmid = updateRowIndex.getElementsByTagName("td")[1];
            let tdcropname = updateRowIndex.getElementsByTagName("td")[2];
            let tdunitcost = updateRowIndex.getElementsByTagName("td")[3];
            let tdunitprice = updateRowIndex.getElementsByTagName("td")[4];
            let tdquantity = updateRowIndex.getElementsByTagName("td")[5];
            let tddateharvested = updateRowIndex.getElementsByTagName("td")[6];
            let tddatesellby = updateRowIndex.getElementsByTagName("td")[7];



            // Reassign attributes to our value we updated to
            tdfarmid.innerHTML = parsedData[0].farm_id;
            tdcropname.innerHTML = parsedData[0].crop_name;
            tdunitcost.innerHTML = parsedData[0].unit_cost;
            tdunitprice.innerHTML = parsedData[0].unit_price;
            tdquantity.innerHTML = parsedData[0].quantity;
            tddateharvested.innerHTML = parsedData[0].date_harvested;
            tddatesellby.innerHTML = parsedData[0].date_sell_by;
        }
    }
}
