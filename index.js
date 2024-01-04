const express = require('express');


const app = express();
app.use(express.static('public'))
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));


const mvcController = require("./controllers/mvc-controller");
mvcController.routes(app);

const port = 3000

app.listen(port, () => {
  console.log(`App started. Listening at http://localhost:${port}`);
})
.on('error', function(err) {
  if (err.errno === 'EADDRINUSE')
    console.error(`Port ${port} busy.`);
  else 
    throw err;
});
