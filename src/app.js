const express = require("express");
const { initializeWAClient } = require("./client/waClient");
const path = require("path");
const _MessageController = require("./controllers/messageController");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize WhatsApp client
initializeWAClient();

// Render the Form
app.get('/', (req, res) => {
    res.render('form');
});

// Handle the send message route
app.post('/submit', _MessageController.sendMessagesFromExcel);

app.listen(PORT, () => {
    console.log("\x1b[32m%s\x1b[0m", `Server is running on http://localhost:${PORT}`);
});