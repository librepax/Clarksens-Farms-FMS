// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {


    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("input-customer-id");
    let inputOrderDate = document.getElementById("input-order-date");
    let inputOrderTotal = document.getElementById("input-order-total");
    let inputOrderIsPaidInFull = document.querySelector('input[name="input-is-paid-in-full"]:checked');
    let inputOrderPaymentMethod = document.getElementById("input-payment-method");



    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let orderDateValue = inputOrderDate.value;
    let orderTotalValue = inputOrderTotal.value;
    let orderIsPaidInFullValue = inputOrderIsPaidInFull.value;
    let orderPaymentMethodValue = inputOrderPaymentMethod.value;

    console.log(orderIsPaidInFullValue)
    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        orderDate: orderDateValue,
        orderTotal: orderTotalValue,
        orderIsPaidInFull: orderIsPaidInFullValue,
        orderPaymentMethod: orderPaymentMethodValue
    }


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerID.value = '';
            inputOrderDate.value = '';
            inputOrderTotal.value = '';
            inputOrderIsPaidInFull.value = document.querySelector('input[name="input-is-paid-in-full"]:checked').value;
            inputOrderPaymentMethod.value = '';

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
    let currentTable = document.getElementById("order-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderIDCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let orderTotalCell = document.createElement("TD");
    let orderIsPaidInFullCell = document.createElement("TD");
    let orderPaymentMethodCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIDCell.innerText = newRow.order_id;
    customerIDCell.innerText = newRow.customer_id;
    orderDateCell.innerText = newRow.order_date;
    orderTotalCell.innerText = newRow.order_total;
    orderIsPaidInFullCell.innerText = newRow.is_paid_in_full;
    orderPaymentMethodCell.innerText = newRow.payment_method;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteOrder(newRow.order_id)
    };



    // Add the cells to the row
    row.appendChild(orderIDCell);
    row.appendChild(customerIDCell);
    row.appendChild(orderDateCell);
    row.appendChild(orderTotalCell);
    row.appendChild(orderIsPaidInFullCell);
    row.appendChild(orderPaymentMethodCell);

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.order_id);


    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.order_id;
    option.value = newRow.order_id;
    selectMenu.add(option);
}
