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

});
connection.query("select * from products", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
        console.log("-----------------" + "\n" + "Product ID: " + results[i].item_id + "\n" + "Product Name: " + results[i].product_name + "\n" + "Price: " + results[i].price + "\n")
    }
    start();
});

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
            var idChosen = parseInt(answer.product_id);
            var purchaseQuantity = answer.units_quantity;
            connection.query("select * from products", function (err, results) {
                if (err) throw err;
                for (i = 0; i < results.length; i++) {
                    if (results[i].item_id === idChosen && results[i].stock_quantity !== 0 && results[i].stock_quantity > purchaseQuantity) {
                        connection.query("update products set ? where ?",
                            [
                                { stock_quantity: results[i].stock_quantity - purchaseQuantity },
                                { item_id: results[i].item_id }
                            ]
                        )
                        console.log("Your total will be: $" + results[i].price * purchaseQuantity)
                        anotherPurchase();
                    } else if (results[i].item_id === idChosen && results[i].stock_quantity < purchaseQuantity) {
                        console.log("I'm sorry, but we only have " + results[i].stock_quantity + " left in our inventory.");
                        anotherPurchase();
                        break;
                    } else if (results[i].item_id === idChosen && results[i].stock_quantity === 0) {
                        console.log("We are sorry but this item is currently sold out! Please check back with us soon as we are expecting a new shipment shortly.");
                        anotherPurchase();
                    }
                }
            })
        })
}

function anotherPurchase() {
    inquirer.prompt([
        {
            name: "anotherPurchase",
            type: "list",
            message: "Would you like to make another purchase?",
            choices: ["Yes", "No"]
        }
    ])
        .then(function (answer) {
            if (answer.anotherPurchase === "Yes") {
                start();
            } else {
                console.log("Thank you for shopping at bamazon! Have a great day!")
            }
        })
}