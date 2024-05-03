require("dotenv").config();
const express = require("express");
const app = express();
const noteRoutes = require("./routes/notesRoutes");
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT;
const URL = process.env.BASE_URL;
const { specifications, swaggerUi } = require("./utils/swagger");

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specifications));
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, URL, () => {
  console.log(`running at http://${URL}:${PORT} or http://localhost:${PORT}`);
});
