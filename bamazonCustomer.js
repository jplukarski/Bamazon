var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function (err) {
    if (err) throw err;
    displayInventory();
});
start();

function start() {

    inquirer.prompt([
        {
            name: "product_id",
            type: "input",
            message: "What is the product ID of the item you would like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "units_quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            connection.query
        })
}

function displayInventory() {
    connection.query("select * from products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("-----------------" + "\n" + "Product ID: " + results[i].item_id + "\n" + "Product Name: " + results[i].product_name + "\n" + "Price: " + results[i].price + "\n")
        }
    })

};