// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputcustomerID = document.getElementById("mySelect");
    let inputCustomerFirstName = document.getElementById("input-customer-first-name-update");
    let inputCustomerLastName = document.getElementById("input-customer-last-name-update");
    let inputCustomerEmail = document.getElementById("input-customer-email-update");
    let inputCustomerPhoneNumber = document.getElementById("input-customer-phone-number-update");
    let inputCustomerAddressLine1 = document.getElementById("input-customer-address-line-1-update");
    let inputCustomerAddressLine2 = document.getElementById("input-customer-address-line-2-update");
    let inputCustomerCity = document.getElementById("input-customer-city-update");
    let inputCustomerState = document.getElementById("input-customer-state-update");
    let inputCustomerZipcode = document.getElementById("input-customer-zipcode-update");

    // Get the values from the form fields
    let customerIDValue = inputcustomerID.value;
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
        customerID: customerIDValue,
        customerFirstName: customerFirstNameValue,
        customerLastName: customerLastNameValue,
        customerEmail: customerEmailValue,
        customerPhoneNumber: customerPhoneNumberValue,
        customerAddressLine1: customerAddressLine1Value,
        customerAddressLine2: customerAddressLine2Value,
        customerCity: customerCityValue,
        customerState: customerStateValue,
        customerZipcode: customerZipcodeValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, customerIDValue);

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
    let table = document.getElementById("customer-table");

    let selectedRow = table.rows[row_index]
    document.getElementById("mySelect").value = selectedRow.cells[0].innerHTML;
    document.getElementById("input-customer-first-name-update").value = selectedRow.cells[1].innerHTML;
    document.getElementById("input-customer-last-name-update").value = selectedRow.cells[2].innerHTML;
    document.getElementById("input-customer-email-update").value = selectedRow.cells[3].innerHTML;
    document.getElementById("input-customer-phone-number-update").value = selectedRow.cells[4].innerHTML;
    document.getElementById("input-customer-address-line-1-update").value = selectedRow.cells[5].innerHTML;
    document.getElementById("input-customer-address-line-2-update").value = selectedRow.cells[6].innerHTML;
    document.getElementById("input-customer-city-update").value = selectedRow.cells[7].innerHTML;
    document.getElementById("input-customer-state-update").value = selectedRow.cells[8].innerHTML;
    document.getElementById("input-customer-zipcode-update").value = selectedRow.cells[9].innerHTML;

}

function updateRow(data, customerID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == customerID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of attributes value
            let tdfirstname = updateRowIndex.getElementsByTagName("td")[1];
            let tdlastname = updateRowIndex.getElementsByTagName("td")[2];
            let tdemail = updateRowIndex.getElementsByTagName("td")[3];
            let tdphonenumber = updateRowIndex.getElementsByTagName("td")[4];
            let tdaddressline1 = updateRowIndex.getElementsByTagName("td")[5];
            let tdaddressline2 = updateRowIndex.getElementsByTagName("td")[6];
            let tdcity = updateRowIndex.getElementsByTagName("td")[7];
            let tdstate = updateRowIndex.getElementsByTagName("td")[8];
            let tdzipcode = updateRowIndex.getElementsByTagName("td")[9];

            // Reassign attributes to our value we updated to
            tdfirstname.innerHTML = parsedData[0].first_name;
            tdlastname.innerHTML = parsedData[0].last_name;
            tdemail.innerHTML = parsedData[0].email;
            tdphonenumber.innerHTML = parsedData[0].phone_number;
            tdaddressline1.innerHTML = parsedData[0].address_line_1;
            tdaddressline2.innerHTML = parsedData[0].address_line_2;
            tdcity.innerHTML = parsedData[0].city;
            tdstate.innerHTML = parsedData[0].state;
            tdzipcode.innerHTML = parsedData[0].zipcode;

        }
    }
}
