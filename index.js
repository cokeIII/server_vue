var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shop_cola'
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}

handleDisconnect();

var app = express();
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
};
app.use(cors(corsOptions));
// app.use(bodyParser.json());

connection.on('error', function(err) {
    console.log("[mysql error]", err);
});
app.get("/getData", function(req, res) {
    connection.query('SELECT * from users', function(err, rows, fields) {
        if (!err) {
            var data = rows
                //console.log('The solution is: ', rows);
            res.json(data);
        } else
            console.log('Error while performing Query.');
    });
});

app.listen(7777);
console.log("serverrun is port 7777")
    // connection.end();