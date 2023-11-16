// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addOrderCropDetailForm = document.getElementById('add-order-crop-detail-form-ajax');



// Modify the objects we need
addOrderCropDetailForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("input-order-id");
    let inputCropID = document.getElementById("input-crop-id");
    let inputQuantityOrdered = document.getElementById("input-quantity-ordered");
    let inputSubtotal = document.getElementById("input-subtotal");



    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let cropIDValue = inputCropID.value;
    let quantityOrderedValue = inputQuantityOrdered.value;
    let subtotalValue = inputSubtotal.value;


    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        cropID: cropIDValue,
        quantityOrdered: quantityOrderedValue,
        subtotal: subtotalValue,
    }


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-crop-detail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderID.value = '';
            inputCropID.value = '';
            inputQuantityOrdered.value = '';
            inputSubtotal.value = '';
            
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
    let currentTable = document.getElementById("orders-crops-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderCropDetailCell = document.createElement("TD");
    let orderIDCell = document.createElement("TD");
    let cropIDCell = document.createElement("TD");
    let quantityOrderedCell = document.createElement("TD");
    let subtotalCell = document.createElement("TD");


    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderCropDetailCell.innerText = newRow.order_crop_detail_id;
    orderIDCell.innerText = newRow.order_id;
    cropIDCell.innerText = newRow.crop_id;
    quantityOrderedCell.innerText = newRow.quantity_ordered;
    subtotalCell.innerText = newRow.subtotal;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteOrderCropDetail(newRow.order_crop_detail_id)
    };

    // Add the cells to the row
    row.appendChild(orderCropDetailCell);
    row.appendChild(orderIDCell);
    row.appendChild(cropIDCell);
    row.appendChild(quantityOrderedCell);
    row.appendChild(subtotalCell);


    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.order_crop_detail_id);


    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.order_crop_detail_id;
    option.value = newRow.order_crop_detail_id;
    selectMenu.add(option);

}
