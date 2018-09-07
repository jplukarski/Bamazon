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

})

start();

function start() {
    inquirer.prompt([
        {
            name: "managerPrompt",
            type: "list",
            message: "What do you want to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
        .then(function (answer) {
            if (answer.managerPrompt === "View Products for Sale") {
                viewProducts();
            } else if (answer.managerPrompt === "View Low Inventory") {
                viewLowInventory();
            } else if (answer.managerPrompt === "Add to Inventory") {
                addToInventory();
            } else if (answer.managerPrompt === "Add New Product") {
                addNewProduct();
            }
        })
};

function viewProducts() {
    connection.query("select * from products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("-----------------" + "\n" + "Product ID: " + results[i].item_id + "\n" + "Product Name: " + results[i].product_name + "\n" + "Price: " + results[i].price + "\n" + "Available Inventory: " + results[i].stock_quantity + "\n")
        }

        start();
    })
};
function viewLowInventory() {
    connection.query("select * from products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 5) {
                console.log("-----------------" + "\n" + "Product ID: " + results[i].item_id + "\n" + "Product Name: " + results[i].product_name + "\n" + "Price: " + results[i].price + "\n" + "Available Inventory: " + results[i].stock_quantity + "\n")
            }
        }

        start();
    })
};
function addToInventory() {
    inquirer.prompt([
        {
            name: "addedInventory",
            type: "input",
            message: "What is the id number of the item you would like to add inventory to?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "addedInventoryQuantity",
            type: "input",
            message: "How much inventory would you like to add to this number?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            var idChosen = parseInt(answer.addedInventory);
            var totalAdded = parseInt(answer.addedInventoryQuantity);
            connection.query("select * from products",
                function (err, results) {
                    if (err) throw err;
                    for (i = 0; i < results.length; i++) {
                        if (results[i].item_id === idChosen) {
                            connection.query(
                                "update products set ? where ?",
                                [
                                    {
                                        stock_quantity: totalAdded + results[i].stock_quantity
                                    },
                                    {
                                        item_id: idChosen
                                    }
                                ]
                            )
                        }
                    }
                }

            )
            start();
        })


};
function addNewProduct() {
    inquirer.prompt([
        {
            name: "new_product",
            type: "input",
            message: "What is the new item we are selling?"
        },
        {
            name: "new_department",
            type: "list",
            message: "What department are we selling it from?",
            choices: ["Guitars", "Pedals", "Basses",]
        },
        {
            name: "new_price",
            type: "input",
            message: "How much are we selling this item for?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "new_quantity",
            type: "input",
            message: "How much inventory of this new item do we have?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            var newPrice = parseInt(answer.new_price);
            var newQuantity = parseInt(answer.new_quantity);
            connection.query(
                "insert into products set ?",
                {
                    product_name: answer.new_product,
                    department_name: answer.new_department,
                    price: newPrice,
                    stock_quantity: newQuantity
                },
                function (err) {
                    if (err) throw err;
                    start()
                }
            )
        })
};