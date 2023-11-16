// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("mySelect");
    let inputCustomerID = document.getElementById("input-order-customer-id-update");
    let inputOrderDate = document.getElementById("input-order-date-update");
    let inputOrderTotal = document.getElementById("input-order-total-update");
    let inputOrderIsPaidInFull = document.querySelector('input[name="input-is-paid-in-full-update"]:checked');
    let inputOrderPaymentMethod = document.getElementById("input-order-payment-method-update");


    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let customerIDValue = inputCustomerID.value;
    let orderDateValue = inputOrderDate.value;
    let orderTotalValue = inputOrderTotal.value;
    let orderIsPaidInFullValue = inputOrderIsPaidInFull.value;
    let orderPaymentMethodValue = inputOrderPaymentMethod.value;

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        orderCustomerID: customerIDValue,
        orderDate: orderDateValue,
        orderTotal: orderTotalValue,
        orderIsPaidInFull: orderIsPaidInFullValue,
        orderPaymentMethod: orderPaymentMethodValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderIDValue);

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
    let table = document.getElementById("order-table");

    let selectedRow = table.rows[row_index]
    document.getElementById("mySelect").value = selectedRow.cells[0].innerHTML;
    document.getElementById("input-order-customer-id-update").value = selectedRow.cells[3].innerHTML;
    document.getElementById("input-order-total-update").value = selectedRow.cells[5].innerHTML;
    document.getElementById("input-order-payment-method-update").value = selectedRow.cells[7].innerHTML;

    let order_date = new Date(selectedRow.cells[4].innerHTML);
    document.getElementById("input-order-date-update").value = order_date.toISOString().split('T')[0];

    let paidInFullValue = selectedRow.cells[6].innerHTML.trim(); // get value from the row

    if (paidInFullValue == "Yes") { 
        document.getElementById("paid-update").checked = true;
    } else if (paidInFullValue == "No") { 
        document.getElementById("not-paid-update").checked = true;
    }
}

function updateRow(data, orderID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("order-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of attributes value

            let tdcustomerid = updateRowIndex.getElementsByTagName("td")[1];
            let tdorderdate = updateRowIndex.getElementsByTagName("td")[2];
            let tdordertotal = updateRowIndex.getElementsByTagName("td")[3];
            let tdispaidinfull = updateRowIndex.getElementsByTagName("td")[4];
            let tdpaymentmethod = updateRowIndex.getElementsByTagName("td")[5];



            // Reassign attributes to our value we updated to

            tdcustomerid.innerHTML = parsedData[0].customer_id;
            tdorderdate.innerHTML = parsedData[0].order_date;
            tdordertotal.innerHTML = parsedData[0].order_total;
            tdispaidinfull.innerHTML = parsedData[0].is_paid_in_full;
            tdpaymentmethod.innerHTML = parsedData[0].payment_method;

        }
    }
}
