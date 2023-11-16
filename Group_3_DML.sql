-- CS 340 Group Project
-- DML SQL file 
-- Written by Group 3 - Danny Lau and Noah Freeman
-- Note: We have updated insert functions with JS syntax as seen in app.js file. Originally, :attributeInput was used to denote input from html form.

--------------------------------------------------------
---Dropdown Queries---
--------------------------------------------------------

--get farm_id and name from Farms to populate dropdown
SELECT * FROM Farms;

--get equipment_id from Equipments to populate dropdown
SELECT * FROM Equipments;

--get crop_id and crop name from Crops to populate dropdown
SELECT * FROM Crops;

--get customer_id and email from Customers to populate dropdown
SELECT * FROM Customers;

--get order_id from Orders to populate dropdown
SELECT * FROM Orders;

--custom query to populate Order ID dropdown for Orders_Crops_Details page (we wanted the CONCAT value as the Order ID dropdown)
SELECT order_id, Orders.customer_id, CONCAT(Customers.first_name, Customers.last_name, '-Order#', Orders.order_id) AS order_ref_number, Customers.email AS customer_email, DATE_FORMAT(order_date, '%m/%d/%Y') AS order_date,
order_total, is_paid_in_full, payment_method 
FROM Orders 
INNER JOIN Customers on Customers.customer_id = Orders.customer_id;


--------------------------------------------------------
---Entities---
--------------------------------------------------------

--------------------------------------------------------
--Farms--
--------------------------------------------------------

--Browse all Farms
SELECT farm_id AS Farm, farm_name AS 'Farm_Name', acres AS 'Acres', address AS 'Address', 
                  description AS 'Description' FROM Farms;

--Insert new Farm
INSERT INTO Farms (farm_name, acres, address, description) 
VALUES ('${data.farmname}', '${data.acres}', '${data.address}', '${data.description}')

--------------------------------------------------------
--Equipments--
--------------------------------------------------------

--Browse all Equipments
SELECT equipment_id, Farms.farm_name AS farm_name, equipment_name, DATE_FORMAT(purchase_date, '%m/%d/%Y') AS purchase_date, equipment_cost, 
equipment_value, DATE_FORMAT(maintenance_date, '%m/%d/%Y') as maintenance_date 
FROM Equipments 
LEFT JOIN Farms on Farms.farm_id = Equipments.farm_id;

--Insert new Equipment
INSERT INTO Equipments (farm_id, equipment_name, purchase_date, equipment_cost, equipment_value, maintenance_date) 
VALUES (${farmID}, '${data.equipmentName}', '${data.equipmentPurchaseDate}', '${data.equipmentCost}', '${data.equipmentValue}', ${equipmentMaintenanceDate})

--Update existing Equipment
UPDATE Equipments 
SET farm_id = ${farmID}, equipment_name = '${equipmentName}', purchase_date = '${equipmentPurchaseDate}', equipment_cost = '${equipmentCost}', equipment_value = '${equipmentValue}', maintenance_date= ${equipmentMaintenanceDate} 
WHERE equipment_id = '${equipmentID}'

--Delete existing Equipment;
--Note: ? indicates user input (style replicated for all DELETE statements)
DELETE FROM Equipments WHERE equipment_id = ?


--------------------------------------------------------
--Crops--
--------------------------------------------------------

--Browse all Crops
SELECT crop_id, Farms.farm_name AS farm_name, crop_name, unit_cost, unit_price,
quantity, DATE_FORMAT(date_harvested, '%m/%d/%Y') AS date_harvested, DATE_FORMAT(date_sell_by, '%m/%d/%Y') AS date_sell_by
FROM Crops 
INNER JOIN Farms on Farms.farm_id = Crops.farm_id;

--Insert new Crop
INSERT INTO Crops (farm_id, crop_name, unit_cost, unit_price, quantity, date_harvested, date_sell_by) 
VALUES ('${data.farmID}', '${data.cropName}', '${data.cropUnitCost}', '${data.cropUnitPrice}', '${data.cropQuantity}','${data.cropDateHarvestedBy}', '${data.cropDateSellBy}'

--Update existing Crop
UPDATE Crops 
SET farm_id = '${farmID}', crop_name = '${cropName}', unit_cost = '${unitCost}', unit_price = '${unitPrice}', quantity = '${orderQuantity}', date_harvested = '${cropDateHarvested}', date_sell_by = '${cropDateSellBy}' 
WHERE crop_id = '${cropID}'

--Delete existing Equipment;
DELETE FROM Crops WHERE crop_id = ?

--------------------------------------------------------
--Customers--
--------------------------------------------------------

--Browse all Customers
SELECT * FROM Customers;

--Insert new Customer
INSERT INTO Customers (first_name, last_name, email, phone_number, address_line_1, address_line_2, city, state, zipcode) 
VALUES('${data.customerFirstName}', '${data.customerLastName}', '${data.customerEmail}', '${data.customerPhoneNumber}', '${data.customerAddressLine1}', ${customerAddressLine2}, '${data.customerCity}', '${data.customerState}','${data.customerZipcode}')

--Update existing Equipment
UPDATE Customers 
SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone_number = '${phonenumber}', address_line_1 = '${addressline1}', address_line_2 = ${addressline2}, city = '${city}', state = '${state}', zipcode = '${zipcode}'  
WHERE customer_id = '${customerID}'

--Delete existing Customer (this will also delete corresponding orders and order_crop_detail lines;
DELETE FROM Customers WHERE customer_id = ?

--------------------------------------------------------
--Orders--
--------------------------------------------------------

--Browse all Orders
SELECT order_id, Orders.customer_id, CONCAT(Customers.first_name, Customers.last_name, '-Order#', Orders.order_id) AS order_ref_number, Customers.email AS customer_email, DATE_FORMAT(order_date, '%m/%d/%Y') AS order_date,
     order_total, is_paid_in_full, payment_method 
	 FROM Orders 
	 INNER JOIN Customers on Customers.customer_id = Orders.customer_id;
	 
--Insert new Order
INSERT INTO Orders (customer_id, order_date, order_total, is_paid_in_full, payment_method) 
VALUES ('${data.customerID}', '${data.orderDate}', '${data.orderTotal}', '${data.orderIsPaidInFull}', '${data.orderPaymentMethod}'

--Update existing Orders
UPDATE Orders 
SET customer_id = '${orderCustomerID}', order_date = '${orderDate}', order_total = '${orderTotal}', is_paid_in_full = '${orderIsPaidInFull}', payment_method= '${orderPaymentMethod}' 
WHERE order_id = '${orderID}'

--Delete existing Order
DELETE FROM Orders WHERE order_id = ?;


--------------------------------------------------------
--Orders_Crops_Details--
--------------------------------------------------------

--Browse all Orders_Crops_Details
SELECT order_crop_detail_id, 
Orders.order_id,
CONCAT(Customers.first_name, Customers.last_name, '-Order#', Orders.order_id) AS order_ref_number, 
Crops.crop_id as crop_id, 
quantity_ordered, 
subtotal 
FROM Orders_Crops_Details
INNER JOIN Orders ON Orders.order_id = Orders_Crops_Details.order_id
INNER JOIN Crops ON Crops.crop_id = Orders_Crops_Details.crop_id
INNER JOIN Customers ON Customers.customer_id = Orders.customer_id;

--Insert new Orders_Crops_Details
INSERT INTO Orders_Crops_Details (order_id, crop_id, quantity_ordered, subtotal) 
VALUES ('${data.orderID}', '${data.cropID}', '${data.quantityOrdered}', '${data.subtotal}' );

--Update existing Orders/Crops Details
UPDATE Orders_Crops_Details 
SET order_id = '${orderID}', crop_id = '${cropID}', quantity_ordered = '${quantityOrdered}', subtotal = '${subtotal}' 
WHERE order_crop_detail_id = '${orderCropDetailID}'

--Delete existing Order/Crop Details
DELETE FROM Orders_Crops_Details WHERE order_crop_detail_id = ?
