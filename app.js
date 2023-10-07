let express = require('express');

let app = express();


let port = 5000;

app.listen(port, ()=>{
    console.log(`Connected on port ${port}`);
})