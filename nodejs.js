const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8888;

const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '***',
    database: 'calendar'
});

con.connect(function(err) {
    if(err) {
        console.log(err);
        console.log('SQL Not Connect!!')
    } else {
        console.log('mysql Connected!')

    }
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//statics files
app.use(express.static('public'));

app.get('', function(req, res){
    res.sendFile(__dirname + '/public/index');
});

//テキストボックスに値入力時、DBにデータ登録
app.post('/req-post-A', urlencodedParser, function(req, res) {
    const sql = `INSERT INTO data(year,month,day,memo) VALUES("${req.body.year}","${req.body.month}","${req.body.day}","${req.body.data}")`;
    con.query(sql, function(err, result, field){
        if (err) throw err;
        res.end();
    });  
});

//deleteボタン押下時、削除フラグを1に更新
app.post('/req-post-D', urlencodedParser, function(req, res) {
    const sql = `UPDATE data SET flag=1 WHERE id=${req.body.id}`;
    console.log(req.body);
    con.query(sql, function(err, result, field){
        if (err) throw err;
        res.end();
    });  
});

//起動時、DBデータ登録後に年月の一致するデータを取得
app.post('/req-data', urlencodedParser, function(req, res) {
    //var sql = `SELECT memo FROM data WHERE year = ${req.body.year} AND month = ${req.body.month} AND day = ${i} AND flag !=1 ORDER BY id asc; `;
    var sql = `SELECT id, day, memo FROM data WHERE year = ${req.body.year} AND month = ${req.body.month} AND flag !=1 ORDER BY id asc; `;
    con.query(sql, function(err, result, field) {
        if(err) throw err;
        //console.log(result);
        res.send(result);
    });
});

app.listen(port, function(){
    console.info(`Listening on port ${port}`);
});
