var express = require('express');

var app = express();
app.set('views', __dirname);
app.engine('.html', require('jade').render);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public/'));
app.get('*', function(req, res) {
    res.render('index');
});
app.listen(8080, 'localhost');
