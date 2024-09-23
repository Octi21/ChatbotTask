const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());


const jsonPath  = 	path.join(__dirname,'data.json');




app.get('/api/data', (req, res) => {
    fs.readFile(jsonPath, 'utf-8', (err, data) =>{
        if(err){
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});