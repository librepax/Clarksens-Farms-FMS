// Citation (for all code below)
// Date: 5/24/23
// Copied directly from Canvas: Activity 2 - Connect webapp to database (Individual)
// Source URL: https://canvas.oregonstate.edu/courses/1914747/assignments/9180988


// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'redacted',
    user: 'redacted',
    password: 'redacted',
    database: 'redacted'
})

// Export it for use in our applicaiton
module.exports.pool = pool;