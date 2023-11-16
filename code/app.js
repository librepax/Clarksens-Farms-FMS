// Citation
// Date: 5/24/23
// Copied, with some adjustments made, from OSU NodeJS Starter Guide on Github
// SQL queries updated from previously written DML
// Various variable/function adjusted to match project needs
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


/*
    SETUP
*/

// Database
var db = require('./database/db-connector')
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));


PORT = 9311;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { stat } = require('forever');
const { NULL } = require('mysql/lib/protocol/constants/types');
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.





/*
    ROUTES
*/

// Homepage


app.get('/', function (req, res) {
    res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
});


// Farms - Show Table

app.get('/farms', function (req, res) {
    let query1 = `SELECT farm_id AS Farm, farm_name AS 'Farm_Name', acres AS 'Acres', address AS 'Address', 
                  description AS 'Description' FROM Farms;`;               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('farms', { data: rows });                  
    })                                                      
});                                         

// Farms - Add Farm

app.post('/add-farm-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Farms (farm_name, acres, address, description) VALUES ('${data.farmname}', '${data.acres}', '${data.address}', '${data.description}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Farms
            query2 = `SELECT * FROM Farms;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// Equipments - Show Table

app.get('/equipments', function (req, res) {
    let query1 = `SELECT equipment_id, Farms.farm_name AS farm_name, equipment_name, DATE_FORMAT(purchase_date, '%m/%d/%Y') AS purchase_date, equipment_cost, 
    equipment_value, DATE_FORMAT(maintenance_date, '%m/%d/%Y') as maintenance_date FROM Equipments LEFT JOIN Farms on Farms.farm_id = Equipments.farm_id;`;               // Define our query

    

    let query2 = "SELECT * FROM Farms;";                    // for dropdown menu


    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        let equipments = rows

        db.pool.query(query2, (error, rows, fields) => {

            let farms = rows;
            
            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let farmsmap = {}
            farms.map(farm => {
                let id = parseInt(farm.farm_id, 10);
                farmsmap[id] = farm["farm_name"];
            })
            equipments = equipments.map(equipment => {
                return Object.assign(equipment, { farm_id: farmsmap[equipment.farm_id] })
            })

            return res.render('equipments', { data: equipments, farms: farms });
        })                                                // an object where 'data' is equal to the 'rows' we
    })
});                                                        // received back from the query


// Equipments - Add Equipment

app.post('/add-equipment-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let farmID = parseInt(data.farmID);
    console.log(farmID)
    console.log(typeof(farmID))
    if (isNaN(farmID)) {
        farmID = 'NULL'
    }
    
    else {
        farmID = `'${data.farmID}'`
    }


    let equipmentMaintenanceDate = parseInt(data.equipmentMaintenanceDate);
    if (isNaN(equipmentMaintenanceDate)) {
        equipmentMaintenanceDate = 'NULL'
    }
    else {
        equipmentMaintenanceDate = `'${data.equipmentMaintenanceDate}'`
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Equipments (farm_id, equipment_name, purchase_date, equipment_cost, equipment_value, maintenance_date) VALUES (${farmID}, '${data.equipmentName}', '${data.equipmentPurchaseDate}', '${data.equipmentCost}', '${data.equipmentValue}', ${equipmentMaintenanceDate})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Equipments;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// Equipments - Delete Equipment

app.delete('/delete-equipment-ajax/', function (req, res, next) {
    let data = req.body;
    let equipmentID = parseInt(data.id);
    let deleteEquipment = `DELETE FROM Equipments WHERE equipment_id = ?`;



    // Run the 1st query
    db.pool.query(deleteEquipment, [equipmentID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }

    })
});

// Equipments - Update Equipment

app.put('/put-equipment-ajax', function (req, res, next) {
    let data = req.body;

    let equipmentID = data.equipmentID;
    let farmID = data.equipmentFarmID;
    let equipmentName = data.equipmentName;
    let equipmentPurchaseDate = data.equipmentPurchaseDate;
    let equipmentCost = data.equipmentCost;
    let equipmentValue = data.equipmentValue;
    let equipmentMaintenanceDate = parseInt(data.equipmentMaintenanceDate);

    console.log(farmID)
    console.log(typeof(farmID))
    //console.log(equipmentMaintenanceDate)
    if (!(farmID)) {
        farmID = 'NULL'
    }
    else {
        farmID = `'${data.equipmentFarmID}'`
    }
    console.log(farmID)
    console.log(typeof(farmID))

    if (isNaN(equipmentMaintenanceDate)) {
        equipmentMaintenanceDate = 'NULL'
    }
    else {
        equipmentMaintenanceDate = `'${data.equipmentMaintenanceDate}'`
    }
    //console.log(equipmentName)

    //console.log(equipmentMaintenanceDate)
    let queryUpdateEquipment = `UPDATE Equipments SET farm_id = ${farmID}, equipment_name = '${equipmentName}', purchase_date = '${equipmentPurchaseDate}', equipment_cost = '${equipmentCost}', equipment_value = '${equipmentValue}', maintenance_date= ${equipmentMaintenanceDate} WHERE equipment_id = '${equipmentID}'`;
    let selectEquipment = `SELECT * FROM Equipments WHERE equipment_id = '${equipmentID}'`

    // Run the 1st query
    db.pool.query(queryUpdateEquipment, [farmID, equipmentName, equipmentPurchaseDate, equipmentCost, equipmentValue, equipmentMaintenanceDate, equipmentID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectEquipment, [equipmentID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


// Customers - Show Table

app.get('/customers', function (req, res) {
    let query1 = "SELECT * FROM Customers;";               // Define our query


    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('customers', { data: rows });                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});        // received back from the query

// Customer - Add Customer

app.post('/add-customer-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values



    let customerAddressLine2 = (data.customerAddressLine2);


    if ((customerAddressLine2.trim()).length === 0) {
        customerAddressLine2 = 'NULL'
    }
    else {
        customerAddressLine2 = `'${customerAddressLine2}'`
    }



    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (first_name, last_name, email, phone_number, address_line_1, address_line_2, city, state, zipcode) VALUES('${data.customerFirstName}', '${data.customerLastName}', '${data.customerEmail}', '${data.customerPhoneNumber}', '${data.customerAddressLine1}', ${customerAddressLine2}, '${data.customerCity}', '${data.customerState}','${data.customerZipcode}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// Customers - Delete Customer

app.delete('/delete-customer-ajax/', function (req, res, next) {
    let data = req.body;
    let customerID = parseInt(data.id);
    let deleteCustomer_From_Customers = `DELETE FROM Customers WHERE customer_id = ?`;
    let deleteCustomer_From_Orders = `DELETE FROM Orders WHERE customer_id = ?`;


    // Run the 1st query
    db.pool.query(deleteCustomer_From_Customers, [customerID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteCustomer_From_Orders, [customerID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});


// Customers - Update Customers

app.put('/put-customer-ajax', function (req, res, next) {
    let data = req.body;

    let customerID = data.customerID;
    let first_name = data.customerFirstName;
    let last_name = data.customerLastName;
    let email = data.customerEmail;
    let phonenumber = data.customerPhoneNumber;
    let addressline1 = data.customerAddressLine1;
    let addressline2 = data.customerAddressLine2;
    let city = data.customerCity;
    let state = data.customerState;
    let zipcode = data.customerZipcode;

    console.log(typeof (addressline2))

    if ((addressline2.trim()).length === 0) {
        addressline2 = 'NULL'
    }
    else {
        addressline2 = `'${addressline2}'`
    }

    console.log(addressline2)
    console.log(first_name)
    let queryUpdateCustomer = `UPDATE Customers SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone_number = '${phonenumber}', address_line_1 = '${addressline1}', address_line_2 = ${addressline2}, city = '${city}', state = '${state}', zipcode = '${zipcode}'  WHERE customer_id = '${customerID}'`;
    let selectCustomer = `SELECT * FROM Customers WHERE customer_id = '${customerID}'`

    // Run the 1st query
    db.pool.query(queryUpdateCustomer, [first_name, last_name, email, phonenumber, addressline1, addressline2, city, state, zipcode, customerID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectCustomer, [customerID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



// Orders - Show Table


// app.js

app.get('/orders', function (req, res) {
    let query1 = `SELECT order_id, Orders.customer_id, CONCAT(Customers.first_name, Customers.last_name, '-Order#', Orders.order_id) AS order_ref_number, Customers.email AS customer_email, DATE_FORMAT(order_date, '%m/%d/%Y') AS order_date,
     order_total, is_paid_in_full, payment_method FROM Orders INNER JOIN Customers on Customers.customer_id = Orders.customer_id;`;               // Define our query

    let query2 = "SELECT * FROM Customers"

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        let orders = rows

        db.pool.query(query2, (error, rows, fields) => {


            let customers = rows;

            let customersmap = {}
            customers.map(customer => {
                let id = parseInt(customer.customer_id, 10);
                customersmap[id] = customer["email"];
            })
            orders = orders.map(order => {
                return Object.assign(order, { customer_id: customersmap[order.customer_id] })
            })

            return res.render('orders', { data: orders, customers: customers });
        })                                                // an object where 'data' is equal to the 'rows' we
    })
});                                           // received back from the query


// Order - Add Order
app.post('/add-order-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customer_id, order_date, order_total, is_paid_in_full, payment_method) VALUES ('${data.customerID}', '${data.orderDate}', '${data.orderTotal}', '${data.orderIsPaidInFull}', '${data.orderPaymentMethod}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Orders;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// Order - Delete Order

app.delete('/delete-order-ajax', function (req, res, next) {
    let data = req.body;
    let orderID = parseInt(data.id);
    let deleteOrder_From_Orders = `DELETE FROM Orders WHERE order_id = ?`;
    let deleteOrder_From_Orders_Crops_Details = `DELETE FROM Orders_Crops_Details WHERE order_id = ?`;


    // Run the 1st query
    db.pool.query(deleteOrder_From_Orders, [orderID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteOrder_From_Orders_Crops_Details, [orderID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});
// Order - Update Order

app.put('/put-order-ajax', function (req, res, next) {
    let data = req.body;

    let orderID = data.orderID;
    let orderCustomerID = data.orderCustomerID;
    let orderDate = data.orderDate;
    let orderTotal = data.orderTotal;
    let orderIsPaidInFull = data.orderIsPaidInFull;
    let orderPaymentMethod = data.orderPaymentMethod;


    let queryUpdateOrder = `UPDATE Orders SET customer_id = '${orderCustomerID}', order_date = '${orderDate}', order_total = '${orderTotal}', is_paid_in_full = '${orderIsPaidInFull}', payment_method= '${orderPaymentMethod}' WHERE order_id = '${orderID}'`;
    let selectOrder = `SELECT * FROM Orders WHERE order_id = '${orderID}'`

    // Run the 1st query
    db.pool.query(queryUpdateOrder, [orderCustomerID, orderDate, orderTotal, orderIsPaidInFull, orderPaymentMethod, orderID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectOrder, [orderID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


// Crops - Display Table


app.get('/crops', function (req, res) {
    let query1 = `SELECT crop_id, Farms.farm_name AS farm_name, crop_name, unit_cost, unit_price,
    quantity, DATE_FORMAT(date_harvested, '%m/%d/%Y') AS date_harvested, DATE_FORMAT(date_sell_by, '%m/%d/%Y') AS date_sell_by
     FROM Crops INNER JOIN Farms on Farms.farm_id = Crops.farm_id;`;               // Define our query

    let query2 = "SELECT * FROM Farms";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        let crops = rows

        db.pool.query(query2, (error, rows, fields) => {

            let farms = rows;

            let farmsmap = {}
            farms.map(farm => {
                let id = parseInt(farm.farm_id, 10);
                farmsmap[id] = farm["farm_name"];
            })
            crops = crops.map(crop => {
                return Object.assign(crop, { farm_id: farmsmap[crop.farm_id] })
            })

            return res.render('crops', { data: crops, farms: farms });
        })                                                // an object where 'data' is equal to the 'rows' we
    })
});                                       // will process this file, before sending the finished HTML to the client.


// Crops - Add Crop

app.post('/add-crop-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Crops (farm_id, crop_name, unit_cost, unit_price, quantity, date_harvested, date_sell_by) VALUES ('${data.farmID}', '${data.cropName}', '${data.cropUnitCost}', '${data.cropUnitPrice}', '${data.cropQuantity}','${data.cropDateHarvestedBy}', '${data.cropDateSellBy}' )`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Crops;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

// Crops - Delete Crop

app.delete('/delete-crop-ajax/', function (req, res, next) {
    let data = req.body;
    let cropID = parseInt(data.id);
    let deleteCrop_From_Crops = `DELETE FROM Crops WHERE crop_id = ?`;
    let deleteCrop_From_Orders_Crops_Details = `DELETE FROM Orders_Crops_Details WHERE crop_id = ?`;


    // Run the 1st query
    db.pool.query(deleteCrop_From_Crops, [cropID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteCrop_From_Orders_Crops_Details, [cropID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// Crops - Update Crop

app.put('/put-crop-ajax', function (req, res, next) {
    let data = req.body;

    let cropID = data.cropID;
    let farmID = data.farmID;
    let cropName = data.cropName;
    let unitCost = data.unitCost;
    let unitPrice = data.unitPrice;
    let orderQuantity = data.orderQuantity;
    let cropDateHarvested = data.dateHarvested;
    let cropDateSellBy = data.dateSellBy;


    let queryUpdateCrop = `UPDATE Crops SET farm_id = '${farmID}', crop_name = '${cropName}', unit_cost = '${unitCost}', unit_price = '${unitPrice}', quantity = '${orderQuantity}', date_harvested = '${cropDateHarvested}', date_sell_by = '${cropDateSellBy}' WHERE crop_id = '${cropID}'`;
    let selectCrop = `SELECT * FROM Crops WHERE crop_id = '${cropID}'`

    // Run the 1st query
    db.pool.query(queryUpdateCrop, [farmID, cropName, unitCost, unitPrice, orderQuantity, cropDateHarvested, cropDateSellBy], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectCrop, [cropID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Order and Crops - Display Table



app.get('/orders-and-crops', function (req, res) {
    let query1 = `
    SELECT order_crop_detail_id, 
    Orders.order_id,
    CONCAT(Customers.first_name, Customers.last_name, '-Order#', Orders.order_id) AS order_ref_number, 
    Crops.crop_id as crop_id, 
    quantity_ordered, 
    subtotal 
    FROM Orders_Crops_Details
    INNER JOIN Orders ON Orders.order_id = Orders_Crops_Details.order_id
    INNER JOIN Crops ON Crops.crop_id = Orders_Crops_Details.crop_id
    INNER JOIN Customers ON Customers.customer_id = Orders.customer_id;`;               // Define our query

    let query2 = `SELECT order_id, Orders.customer_id, CONCAT(Customers.first_name, Customers.last_name, '-Order#', Orders.order_id) AS order_ref_number, Customers.email AS customer_email, DATE_FORMAT(order_date, '%m/%d/%Y') AS order_date,
    order_total, is_paid_in_full, payment_method FROM Orders INNER JOIN Customers on Customers.customer_id = Orders.customer_id;`

    let query3 = "SELECT * FROM Crops;"

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        let orders_crops_details = rows

        db.pool.query(query2, (error, rows, fields) => {


            let orders = rows;
            db.pool.query(query3, (error, rows, fields) => {


                let crops = rows;

                let cropsmap = {}
                crops.map(crop => {
                    let id = parseInt(crop.crop_id, 10);
                    cropsmap[id] = crop["crop_name"];
                })
                orders_crops_details = orders_crops_details.map(crop => {
                    return Object.assign(crop, { crop_id: cropsmap[crop.crop_id] })
                })


                return res.render('orders-and-crops', { data: orders_crops_details, orders: orders, crops: crops });
            })                                                // an object where 'data' is equal to the 'rows' we
        })
    })
});

// Order and Crops - Add Order and Crop Detail

app.post('/add-order-crop-detail-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders_Crops_Details (order_id, crop_id, quantity_ordered, subtotal) VALUES ('${data.orderID}', '${data.cropID}', '${data.quantityOrdered}', '${data.subtotal}' )`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            
            query2 = `SELECT * FROM Orders_Crops_Details;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-order-crop-detail-ajax', function (req, res, next) {
    let data = req.body;
    let orderCropDetailID = parseInt(data.id);
    let deleteOrderCropDetail_From_OrderCropDetail = `DELETE FROM Orders_Crops_Details WHERE order_crop_detail_id = ?`;


    // Run the 1st query
    db.pool.query(deleteOrderCropDetail_From_OrderCropDetail, [orderCropDetailID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            res.sendStatus(204);
        }

    })
});


app.put('/put-order-crop-detail-ajax', function (req, res, next) {
    let data = req.body;

    let orderCropDetailID = data.orderCropDetailID;
    let orderID = data.orderID;
    let cropID = data.cropID;
    let quantityOrdered = data.quantityOrdered;
    let subtotal = data.subtotal;

    let queryUpdateOrderCropDetail = `UPDATE Orders_Crops_Details SET order_id = '${orderID}', crop_id = '${cropID}', quantity_ordered = '${quantityOrdered}', subtotal = '${subtotal}' WHERE order_crop_detail_id = '${orderCropDetailID}'`;
    let selectOrderCropDetail = `SELECT * FROM Orders_Crops_Details WHERE order_crop_detail_id = '${orderCropDetailID}'`

    // Run the 1st query
    db.pool.query(queryUpdateOrderCropDetail, [orderID, cropID, quantityOrdered, subtotal, orderCropDetailID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectOrderCropDetail, [orderCropDetailID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});