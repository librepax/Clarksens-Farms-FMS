-- CS 340 Group Project, Step 2
-- DDL SQL file (draft)
-- Written by Group 3 - Danny Lau and Noah Freeman

-- minimize import errors
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;


-- Create Farms table with primary key

CREATE OR REPLACE TABLE Farms(
    farm_id int AUTO_INCREMENT NOT NULL,
        PRIMARY KEY (farm_id),
    farm_name varchar(255) NOT NULL,
    acres decimal (10,2) NOT NULL,
    address varchar(255) NOT NULL,
    description varchar(255) NOT NULL
);

-- Create Equipments table with primary and foreign keys

CREATE OR REPLACE TABLE Equipments(
    equipment_id int AUTO_INCREMENT NOT NULL,
        PRIMARY KEY(equipment_id),
    farm_id int,
        FOREIGN KEY (farm_id) REFERENCES Farms(farm_id)
		ON DELETE CASCADE,
    equipment_name varchar(255) NOT NULL, 
    purchase_date date NOT NULL,
    equipment_cost decimal(10,2) NOT NULL,
    equipment_value decimal(10,2) NOT NULL,
    maintenance_date date
);

-- Create Crops table with primary and foreign keys

CREATE OR REPLACE TABLE Crops(
    crop_id int AUTO_INCREMENT NOT NULL,
        PRIMARY KEY(crop_id),
    farm_id int NOT NULL,
        FOREIGN KEY (farm_id) REFERENCES Farms(farm_id)
        ON DELETE CASCADE,
    crop_name varchar(255) NOT NULL,
    unit_cost decimal(10,2) NOT NULL,
    unit_price decimal(10,2) NOT NULL,
    quantity int NOT NULL,
    date_harvested date NOT NULL,
    date_sell_by date NOT NULL
);

-- Create Customers table with primary key 
CREATE OR REPLACE TABLE Customers(
    customer_id int AUTO_INCREMENT NOT NULL,
        PRIMARY KEY (customer_id),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone_number varchar(15) NOT NULL,
    address_line_1 varchar(255) NOT NULL,
    address_line_2 varchar(255),
    city varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    zipcode varchar(5) NOT NULL
);

-- Create Orders Table with primary and foreign keys 
CREATE OR REPLACE TABLE Orders(
    order_id int AUTO_INCREMENT NOT NULL,
        PRIMARY KEY (order_id),
    customer_id int NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE,
    order_date date NOT NULL,
    order_total decimal(10,2) NOT NULL,
    is_paid_in_full tinyint(1) NOT NULL,
    payment_method varchar(255) NOT NULL
);

CREATE OR REPLACE TABLE Orders_Crops_Details(
	order_crop_detail_id int AUTO_INCREMENT NOT NULL,
		PRIMARY KEY (order_crop_detail_id),
    order_id int NOT NULL,
        FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE,
    crop_id int NOT NULL,
        FOREIGN KEY (crop_id) REFERENCES Crops(crop_id)
        ON DELETE CASCADE,
    quantity_ordered int NOT NULL,
    subtotal decimal(10,2) NOT NULL
);

-- Insert into Farms table

INSERT INTO Farms(
    farm_name,
    acres,
    address,
    description
)
VALUES
(
    'Garden Dreams',
    100.5,
    '355 Mission Ave., Los Angeles, California, 90312',
    'Source for brussel sprouts, which could use a lot of work.'
),
(
    'Top Notch Fruits',
    50,
    '22 N Berry St., Chicago, Illinois, 11223',
    'Source for strawberries, which is the sweetest I have ever had.'
),
(
    'Lame Carrots',
    22.22,
    '43 SE Rocket Drive, Boston, Massachusetts, 02934',
    'Source for carrots, although they should consider a name change.'
),
(
    'Pop Top',
    6000,
    '3456 Legacy St., Chino, California, 12345',
    'Source for potatoes, which they say is the best for making crisps... mmm!'
),
(
    'My Sweet Farm',
    78.2,
    '1441 Republic Ave., Monroe, Iowa, 50710',
    'Where I supposedly grow all my produces sold in the shop... but nobody needs to know that.'
);

-- Insert into Equipments tables

INSERT INTO Equipments (
    farm_id,
    equipment_name,
    purchase_date,
    equipment_cost,
    equipment_value,
    maintenance_date
)
VALUES
(
    3,
    'Tractor',
    '2020-05-12',
    5699.99,
    4000,
    '2028-1-1'
),
(
    3,
    'Seed Sprayer',
    '2022-03-13',
    100.13,
    50,
    '2024-2-2'
),
(
    
    1,
    'Irrgation System',
    '2002-6-4',
    800,
    600.99,
    '2016-04-04'
),
(
    
    4,
    'Potato Spiker',
    '2002-08-27',
    12300.99,
    6500,
    '2025-6-6'
);

-- Insert into Crops table

INSERT INTO Crops(
    farm_id,
    crop_name,
    unit_cost,
    unit_price,
    quantity,
    date_harvested,
    date_sell_by
)
VALUES
(
    3,
    'Carrots',
    10,
    20,
    6000,
    '2023-01-15',
    '2023-02-15'
),

(
    4,
    'Potatoes',
    5.99,
    7.99,
    250000,
    '2022-08-17',
    '2022-09-15'
),

(
    2, 
    'Strawberries',
    8.50,
    9,
    20340,
    '2021-03-4',
    '2021-04-04'
),
(
    1,
    'Brussel Sprouts',
    1.99,
    2.99,
    300,
    '2022-07-19',
    '2022-08-01'
);

-- Insert Into Customers Table
INSERT INTO Customers(
    first_name,
    last_name,
    email,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    zipcode
)
VALUES
(
    'Colin',
    'Farrell',
    'vampirehunter@gmail.com',
    '818-999-6321',
    '101 Hollywood Lane',
    NULL,
    'Hollywood',
    'CA',
    90210
),
(
    'Jackie',
    'Landau',
    'jackie2022@yahoo.com',
    '503-654-5512',
    '3123 Duane St',
    'Apt 5',
    'Austin',
    'TX',
    31244
),
(
    'Robert',
    'Ripples',
    'robthegoat@msn.com',
    '222-412-3544',
    '99 Chester Drive',
    NULL,
    'Hartford',
    'CT',
    42156
);

-- Insert into Orders tables

INSERT INTO Orders(
    customer_id,
    order_date,
    order_total,
    is_paid_in_full,
    payment_method
)
VALUES
(
    2,
    '2022-04-05',
    100,
    0,
    'Cash'
),
(
    1,
    '2023-01-14',
    200,
    1,
    'Credit Card'
),
(
    2,
    '2023-11-11',
    300,
    1,
    'Gold'
);

-- Insert into Orders_Crops_Details
INSERT INTO Orders_Crops_Details(
    order_id,
    crop_id,
    quantity_ordered,
    subtotal
)
VALUES
(
    3,
    4,
    150,
    700
),
(
    2,
    1,
    3500,
    6000
),
(
    1,
    4,
    900,
    1600
),
(
    1,
    2,
    800,
    2580
);

-- re-enable foreign key check and commit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;



