const notes = require('express').Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
    // read from the file and send back the data to the client
    fs.readFile('./db/groceries.json', "utf-8", function (err, data) {
        res.json(JSON.parse(data))
    })
});

notes.post('/', (req, res) => {
    // When adding to a previous list, you first need to read from the list...
    fs.readFile('./db/notes.json', "utf-8", function (err, data) {
        let myData = JSON.parse(data)
        const { itemName, itemQuantity } = req.body;
        const newItem = {
            itemName,
            itemQuantity,
            itemID: uuidv4()
          };
        // then add the new item to the previous list...
        myData.push(newItem)
        // then save back into the list.
        fs.writeFile('./db/groceries.json', JSON.stringify(myData, null, 4), function (err) {
            if (err) throw err;
            res.json(myData)
        })
    })
});

notes.delete('/:id', (req, res) => {
    // req.params.id matches :id. If I wrote :turtle, we would write req.params.turtle
    const myID = req.params.id;
    // Same thing as the post. If we are modifying our existing data, first we read it.
    fs.readFile('./db/groceries.json', "utf-8", function (err, data) {
        let myData = JSON.parse(data)
        // Now we filter our data, returning all items where the id doesn't match the id sent
        // to this route via the parameter. 
       const filteredData = myData.filter((item) => item.itemID !== myID);
        // Save our filtered data back into the file, effectively deleting the item in the grocery list.
        fs.writeFile('./db/notes.json', JSON.stringify(filteredData, null, 4), function (err) {
            if (err) throw err;
            // Send the data back to the client.
            res.json(filteredData)
        })
    })
});

module.exports = notes;