require('dotenv').config();
const express = require('express');
const app = express();
const noteRoutes = require('./routes/notesRoutes');
const PORT = process.env.PORT;
const URL = process.env.BASE_URL;

app.use(express.json());

app.use('/api/notes', noteRoutes);


app.listen(PORT, URL , () => {
    console.log(`running at http://${URL}:${PORT} or http://localhost:${PORT}`);
}); 

/* const server = app.listen(PORT, () => {
    const address = server.address(); 

    if (address) {
        const port = address.port;
        console.log(port);
        const serverAddress = address.address;
        console.log(serverAddress);
        console.log(`Server running at http://${serverAddress}:${port}`);
    } else {
        console.error("Server address is not available.");
    }
}); */