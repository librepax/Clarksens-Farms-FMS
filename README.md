# Clarksens-Farms-FMS
Farm Management System for Clarksen's Farms

EXECUTIVE SUMMARY

This project intends to be the one-stop-shop database manager for all prospective farmers
yearning to keep track of their farms, equipment, crops, and every data related to sales of its
products, such as customer and order information. The conception of this project is greatly
attributed to our infatuation with a program widely popular in a major streaming platform, where
a famous British car commentator suddenly decides to start a farm in the English countryside,
and unsurprisingly faces a myriad of challenges. We wanted to help out any fellow farmers that
may be facing similar problems; hence, the project was born.

PROJECT OVERVIEW
Jeremiah Clarksen, the world renown British car commentator turned farmer in the quaint
English countryside, sets focus of his next venture to the vast land of opportunities on the other side of the Atlantic known as the American Midwest. Confident from his successes garnered
through hard work back home, he is determined to single-handedly capture the hearts and
minds of American fans, only with a little help from his fellow distributors and a
database-powered website that records pertinent information of his farms, equipment, crops,
and gift shop orders and customers. The secret to his stateside success, which none other than
himself or his distributors shall ever know, is that he will neither own a farm nor participate in the farming operation himself; instead, he will resell produce sourced from his subsidiary farms elsewhere in the nation and rebranded as his very own harvest. Despite locating himself in the sparsely populated middle of nowhere, Jeremiah expects to own and/or track at least 500 items
for each entity and record $9 million in sales for the first fiscal year, all of which the system is perfectly capable of.

DATABASE OUTLINE

- Farms
  - Description: The heart of the action, where the growing of all crops take place,
  grown and harvested all by Jeremiah… at least on appearance, that is. One farm
  will exclusively produce one crop, and each farm is maintained by one or many
  equipment. The database will manage a collection of such farms.
  - Attributes:
    - farm_id, PK, INT, auto_increment, not NULL
    - farm_name, VARCHAR(255), not NULL
    - acres, DECIMAL(10, 2), not NULL
    - address, VARCHAR(255), not NULL
    - description, VARCHAR(255), not NULL
    - Relationships:
    - 1:1 with Crops. One farm will only grow one crop, and one crop can only
    be sourced from one farm.
    - 1:M with Equipments. One farm may be maintained by many equipment,
    but one equipment will solely be used by one farm.
- Equipments
  - Stores all kinds of equipment ranging from tractors to fertilizers. Any given
  equipment will only belong to one farm but many equipment may be used to
  maintain a single farm. Equipment cost and value fields are set to keep track of
  purchase price and the expected value in the event the equipment is no longer
  necessary and better off sold. An optional maintenance date field will store the
  next future date a necessary maintenance should take place.
  - Attributes:
    - equipment_id, PK, INT, auto_increment, not NULL
    - farm_id, FK, INT, not NULL
  - purchase_date, DATE, not NULL
  - equipment_cost, DECIMAL(10, 2), not NULL
  - equipment_value, DECIMAL(10, 2), not NULL
  - maintenance_date, DATE
  - Relationships:
    - M:1 with Farms. Many equipment may be used to maintain one farm, but
      one equipment will only belong to one farm.
      
- Crops
  - The driver of growth for the enterprise and the sweet product that keeps bringing
  the customers back for more. For ease of operations, each crop is sourced from
  a single farm. This includes any sort of grains/vegetable that can conceivably be
  grown at a typical farm (including but not limited to corn, soybeans, wheat,
  potato, carrots, etc). Unit cost and price fields keep track of the best estimate
  cost to make one unit of crop and its potential selling price. Quantity is the
  amount harvested and available for sale. Date harvested field shows the date of
  harvest of a unit of crop for the customer’s benefit, whereas sell by date is set as
  dictated by relevant laws and regulations.
  - Attributes:
    - crop_id, PK, INT, auto_increment, not NULL
    - farm_id, FK, INT, not NULL
    - crop_name, VARCHAR(255), not NULL
    - unit_cost, DECIMAL(10, 2), not NULL
    - unit_price, DECIMAL(10, 2), not NULL
    - quantity, INT, not NULL
    - date_harvested, DATE, not NULL
    - date_sell_by, DATE, not NULL
  - Relationships:
    - M:M with Orders, by way of Orders_Crops_Detail table. One or many
    crops can appear on one or many orders, and one or many orders may
    include one or many crops.
    - 1:1 with Farms. A single crop can only be sourced from a single farm, and
    a single farm only grows a single crop.

- Orders
  - The entity that keeps track of all orders made by customers. Each individual
  order includes the customer ID, date order is placed, total of order, status of order
  payment (whether paid or not), and payment method (cash, card, check, etc)...
  Details of any given order, such as how many of what crops were ordered, is kept
  track by the Order_Details joint table.
  - Attributes:
    - order_id, PK, INT, auto_increment, not NULL
    - customer_id, FK, INT, not NULL
    - order_date, DATE, not NULL
    - order_total, DECIMAL(10,2), not NULL
    - is_paid_in_full, TINYINT(1), not NULL
    - payment_method, VARCHAR(255), not NULL
  - Relationships:
    - M:M with Crops, by way of Orders_Crops_Detail table. One or many
    orders can include one or many crops, and one or many crops can be
    seen on one or many orders.
    - 1:M with Customers. A unique order only belongs to one customer, but
    one or many customer(s) may make as many orders as they wish.

- Customers
  - What good is a farm without its roadside shop and customers? Each customer
  will be asked, at the time of order, its full name, email address, phone number,
  and full address, so that the Farm can send promotional letters and random gifts,
  at the sole discretion of the owner.
- Attributes:
  - customer_id, PK, INT, auto_increment, not NULL
  - first_name, VARCHAR(255), not NULL
  - last_name, VARCHAR(255), not NULL
  - email, VARCHAR(255), not NULL
  - phone_number, VARCHAR(15), not NULL
  - address_line_1, VARCHAR(255), not NULL
  - address_line_2, VARCHAR(255)
  - city, VARCHAR(255), not NULL
  - state, VARCHAR(255), not NULL
  - zip_code, VARCHAR(5), not NULL
- Relationships:
  - M:1 with Orders. One or many customers can place as many orders, but
  a single order will only belong to one customer.

INTERSECTION TABLE
- Orders_Crops_Details
  - A joint table to help keep track of the crop type and quantity of crop ordered in a
  given order. A single order may contain multiple counts of multiple crops, which is
  first kept track in this entity per crop, and then fed to the Order entity in
  aggregate. To illustrate, if a customer orders 5 bushels of corn and 3 pounds of
  wheat, there will be two order details: one for the corn, and another for the wheat,
  both sharing the same order ID.
- Attributes:
  - order_crop_detail_id, PK, INT, not NULL, auto increment
  - order_id, PK, FK1, INT, not NULL
  - crop_id, PK, FK2, INT, not NULL
  - quantity_ordered, INT, not NULL
  - subtotal, DECIMAL(10,2), not NULL
- Relationships:
  - 1:M with Crops. A single order detail must contain one crop, and one crop
  can show up on one or many order details.
  - M:1 with Orders. A single order detail will only belong to one order, but an
  order may contain at least one or many order details.

ENTITY-RELATIONSHIP DIAGRAM (ERD)
  ![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/50c5f88a-feff-4733-ba02-7ad52369bfbc)
  
SCHEMA DIAGRAM
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/e8ac914b-f8c7-4dfe-8cb1-d7d7960f9ee4)

UI SCREENSHOTS
Homepage
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/69b20194-baab-4ddf-b532-8fba8986fc82)

Create and Read Farms Entity
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/614ab19d-0515-49dc-8e26-e0ec4cb86af7)

Create, Read, Update, Delete Equipments Entity
(Farm Name is tied to farm_id per DML SQL and is a NULLable relationship)

![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/0eea92b6-9516-46e5-bf41-a6dac4314690)
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/7d1c754a-8f42-45b8-8cfe-5f53e0bc01fc)

Create/Read/Update/Delete Crops Entity
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/acab5a61-d5d1-4eb8-826f-08b2c19fbad7)
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/f5401c6e-4875-46e0-8265-c982581066f5)

Create/Read/Update/Delete Customers Entity
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/349503c0-6a89-46e8-b976-a6871eb426e0)
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/051b528c-cbde-4647-af7e-ee5458ab6597)

Create/Read/Update/Delete Orders Entity
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/7d88ba71-8d0d-440d-bc13-26e05f23400b)
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/38b32f1d-237c-40bf-a3fe-9c2daba228e7)

Create/Read/Update/Delete Orders and Crops Details Entity
This is an intersection table of Orders and Crops, and we have implemented update and delete
for these M:N relationships.
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/00aba1b5-0c27-45d8-82da-3ee0da011ce6)
![image](https://github.com/librepax/Clarksens-Farms-FMS/assets/114368114/f80f2265-e25b-479e-8f73-02f79f3be501)
