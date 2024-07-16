const express = require("express");
const fs = require("fs");
const PORT = 3000;

const app = express();
app.use(express.json());

// Custom validation middleware
const validateTodo = (req, res, next) => {
    const { ID, Name, Rating, Description, Genre, Cast } = req.body;

    let validationErrors = [];

    if (typeof ID !== 'number') validationErrors.push("ID must be a number");
    if (typeof Name !== 'string') validationErrors.push("Name must be a string");
    if (typeof Rating !== 'number') validationErrors.push("Rating must be a number");
    if (typeof Description !== 'string') validationErrors.push("Description must be a string");
    if (typeof Genre !== 'string') validationErrors.push("Genre must be a string");
    if (!Array.isArray(Cast) || !Cast.every(c => typeof c === 'string')) validationErrors.push("Cast must be an array of strings");

    
    if (validationErrors.length > 0) {
        const errorMessage = "bad request. some data is incorrect.";
        const errorDetails = validationErrors.join('; ');

        // Log errors to res.txt
        fs.appendFileSync('res.txt', `${errorMessage} ${errorDetails}\n`);

        return res.status(400).json({ message: errorMessage, errors: validationErrors });
    } else {
        next();
    }
};

// Apply validation middleware only to the POST route
app.post('/',validateTodo,(req, res) => {
    console.log(req.body);
  const data = fs.readFileSync("./db.json","utf-8");
  const parsedData = JSON.parse(data);
  parsedData.todos.push(req.body);
  fs.writeFileSync("./db.json",JSON.stringify(parsedData));
    res.status(200).send('data received');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
