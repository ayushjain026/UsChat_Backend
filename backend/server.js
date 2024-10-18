const express = require("express");
const dotenv = require("dotenv");

const { chats } = require("./data/data");

const app = express();
dotenv.config();

app.get("/", (req, res) => {
    res.send("Tested");
})


app.get("/api/chat/", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  res.send(chats.find(x => x._id === req.params.id));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => { console.log(`Server started at port ${PORT}.`); });