// // const express = require("express");
// // const app = express();
// // const users = require("./users.json"); 
// // app.post("/api/userdata", (req,res)=>{
// //     return res.json({msg:"Pending"});
// // });
// // app.listen(5000,()=>{
// //     console.log("http://localhost:5000");
// // });
// const express = require("express");
// const app = express();

// const users = require("./users.json");

// // Middleware to parse JSON
// app.use(express.json());

// app.post("/api/userdata", (req, res) => {
//     console.log(req.body); // to see incoming data
//     return res.json({ msg: "Pending" });
// });

// // Start server
// app.listen(5000, () => {
//     console.log("Server running on http://localhost:5000");
// });
const express = require("express");
const app = express();
const fs = require("fs");
const users = require("./users.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running ");
});

app.post("/api/userdata", (req, res) => {
    const data = req.body;
    users.push(data);
    fs.writeFile("users.json", JSON.stringify(users) + "\n", (err) => {
        if (err) {
            console.error("Error writing to file", err);
            return res.status(500).json({ msg: "Error saving data" });
        }
        return res.json({ msg: "file successfully appended" });
    });
});
app.delete("/api/userdata/:id", (req, res) => {
    const id = Number(req.params.id);
    const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));  
    const filterusers = users.filter(user => user.id !== id);
        fs.writeFile("users.json", JSON.stringify(filterusers, null, 2), (err) => {
    if (err) {
        return res.status(500).json({ msg: "Error deleting user" });
    }
    return res.json({ msg: "file successfully deleted" });
});
});
app.patch("/api/userdata/:id", (req, res) => {
    const id = Number(req.params.id);
    const updates = req.body;

    const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

    const updateusers = users.map(user =>
        user.id === id ? { ...user, ...updates } : user
    );

    fs.writeFile("users.json", JSON.stringify(updateusers, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ msg: "Error updating user" });
        }
        return res.json({ msg: "file successfully updated" });
    });
});


app.listen(5000, () => {
    console.log("http://localhost:5000");
});