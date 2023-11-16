// Citation
// Date: 5/24/23
// Copied and slightly adjusted from the OSU CS340 NodeJS Starter Guide
// Structure parallels, with some variable/function name changes
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// function for confirm popup dialog
function confirmDelete() {
    return confirm('Are you sure you want to delete this row?');
}

function confirmDelete() {
    return confirm('Are you sure you want to delete this row?');
}

function deleteEquipment(equipmentID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: equipmentID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-equipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(equipmentID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(equipmentID) {

    let table = document.getElementById("equipment-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == equipmentID) {
            table.deleteRow(i);
            deleteDropDownMenu(equipmentID)
            break;
        }
    }
}

function deleteDropDownMenu(equipmentID) {
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(equipmentID)) {
            selectMenu[i].remove();
            break;
        }

    }
}