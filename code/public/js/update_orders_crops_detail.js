// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateOrderCropDetailForm = document.getElementById('update-order-crop-detail-form-ajax');

    // Get form fields we need to get data from
    let inputOrderCropDetailID = document.getElementById("mySelect");
    let inputOrderID = document.getElementById("input-order-id-update");
    let inputCropID = document.getElementById("input-crop-id-update");
    let inputQuantityOrdered = document.getElementById("input-quantity-ordered-update");
    let inputSubtotal = document.getElementById("input-subtotal-update");

// Modify the objects we need
updateOrderCropDetailForm.addEventListener("submit", function (e) {

        // Prevent the form from submitting
        e.preventDefault();
        
    // Get the values from the form fields
    let orderCropDetailIDValue = inputOrderCropDetailID.value;
    let orderIDValue = inputOrderID.value;
    let cropIDValue = inputCropID.value;
    let quantityOrderedValue = inputQuantityOrdered.value;
    let subtotalValue = inputSubtotal.value;

    // Put our data we want to send in a javascript object
    let data = {
        orderCropDetailID: orderCropDetailIDValue,
        orderID: orderIDValue,
        cropID: cropIDValue,
        quantityOrdered: quantityOrderedValue,
        subtotal: subtotalValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-crop-detail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderCropDetailIDValue);

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
    let table = document.getElementById("orders-crops-table");

    let selectedRow = table.rows[row_index]
    document.getElementById("mySelect").value = selectedRow.cells[0].innerHTML;
    document.getElementById("input-order-id-update").value = selectedRow.cells[2].innerHTML;
    document.getElementById("input-crop-id-update").value = selectedRow.cells[3].innerHTML;
    document.getElementById("input-quantity-ordered-update").value = selectedRow.cells[4].innerHTML;
    document.getElementById("input-subtotal-update").value = selectedRow.cells[5].innerHTML;

}

function updateRow(data, orderCropDetailID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("orders-crops-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == orderCropDetailID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value

            let tdorderid = updateRowIndex.getElementsByTagName("td")[1];
            let tdcropid = updateRowIndex.getElementsByTagName("td")[2];
            let tdquantityordered = updateRowIndex.getElementsByTagName("td")[3];
            let tdsubtotal = updateRowIndex.getElementsByTagName("td")[4];




            // Reassign homeworld to our value we updated to

            tdorderid.innerHTML = parsedData[0].order_id;
            tdcropid.innerHTML = parsedData[0].crop_id;
            tdquantityordered.innerHTML = parsedData[0].quantity_ordered;
            tdsubtotal.innerHTML = parsedData[0].subtotal;
        }
    }
}
