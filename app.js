const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const apiRouter = require("./routes/api")
const port = 3000

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// app.use(express.static(__dirname + "/dist/"));
app.use("/api", apiRouter);
// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/dist/index.html");
// });
app.listen(port);