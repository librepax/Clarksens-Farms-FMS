// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {


    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerFirstName = document.getElementById("input-customer-first-name");
    let inputCustomerLastName = document.getElementById("input-customer-last-name");
    let inputCustomerEmail = document.getElementById("input-customer-email");
    let inputCustomerPhoneNumber = document.getElementById("input-customer-phone-number");
    let inputCustomerAddressLine1 = document.getElementById("input-customer-address-line-1");
    let inputCustomerAddressLine2 = document.getElementById("input-customer-address-line-2");
    let inputCustomerCity = document.getElementById("input-customer-city");
    let inputCustomerState = document.getElementById("input-customer-state");
    let inputCustomerZipcode = document.getElementById("input-customer-zipcode");


    // Get the values from the form fields
    let customerFirstNameValue = inputCustomerFirstName.value;
    let customerLastNameValue = inputCustomerLastName.value;
    let customerEmailValue = inputCustomerEmail.value;
    let customerPhoneNumberValue = inputCustomerPhoneNumber.value;
    let customerAddressLine1Value = inputCustomerAddressLine1.value;
    let customerAddressLine2Value = inputCustomerAddressLine2.value;
    let customerCityValue = inputCustomerCity.value;
    let customerStateValue = inputCustomerState.value;
    let customerZipcodeValue = inputCustomerZipcode.value;

    // Put our data we want to send in a javascript object
    let data = {
        customerFirstName: customerFirstNameValue,
        customerLastName: customerLastNameValue,
        customerEmail: customerEmailValue,
        customerPhoneNumber: customerPhoneNumberValue,
        customerAddressLine1: customerAddressLine1Value,
        customerAddressLine2: customerAddressLine2Value,
        customerCity: customerCityValue,
        customerState: customerStateValue,
        customerZipcode: customerZipcodeValue
    }



    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerFirstName.value = '';
            inputCustomerLastName.value = '';
            inputCustomerEmail.value = '';
            inputCustomerPhoneNumber.value = '';
            inputCustomerAddressLine1.value = '';
            inputCustomerAddressLine2.value = '';
            inputCustomerCity.value = '';
            inputCustomerState.value = '';
            inputCustomerZipcode.value = '';

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
    let currentTable = document.getElementById("customer-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let customerIDCell = document.createElement("TD");
    let customerFirstNameCell = document.createElement("TD");
    let customerLastNameCell = document.createElement("TD");
    let customerEmailCell = document.createElement("TD");
    let customerPhoneNumberCell = document.createElement("TD");
    let customerAddressLine1Cell = document.createElement("TD");
    let customerAddressLine2Cell = document.createElement("TD");
    let customerCityCell = document.createElement("TD");
    let customerStateCell = document.createElement("TD");
    let customerZipcodeCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    customerIDCell.innerText = newRow.customer_id;
    customerFirstNameCell.innerText = newRow.first_name;
    customerLastNameCell.innerText = newRow.last_name;
    customerEmailCell.innerText = newRow.email;
    customerPhoneNumberCell.innerText = newRow.phone_number;
    customerAddressLine1Cell.innerText = newRow.address_line_1;
    customerAddressLine2Cell.innerText = newRow.address_line_2;
    customerCityCell.innerText = newRow.city;
    customerStateCell.innerText = newRow.state;
    customerZipcodeCell.innerText = newRow.zipcode;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteCustomer(newRow.customer_id);
    };



    // Add the cells to the row
    row.appendChild(customerIDCell);
    row.appendChild(customerFirstNameCell);
    row.appendChild(customerLastNameCell);
    row.appendChild(customerEmailCell);
    row.appendChild(customerPhoneNumberCell);
    row.appendChild(customerAddressLine1Cell);
    row.appendChild(customerAddressLine2Cell);
    row.appendChild(customerCityCell);
    row.appendChild(customerStateCell);
    row.appendChild(customerZipcodeCell);

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.customer_id);


    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.customer_id;
    option.value = newRow.customer_id;
    selectMenu.add(option);
}
