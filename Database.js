const pg        = require('pg');
const express   = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
const app       = express();

app.use(express.static("NCDs"));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const config = {
    user: 'postgres',
    host:'localhost',
    database: 'NCDs',
    password: '2624',
    port: 5432       
};

const pool = new pg.Pool(config);
app.get('/login/site', (req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT DISTINCT ht_site FROM login ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/login/data',(req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT * FROM login ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/index/doctor/data',(req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT * FROM doctor ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/hypertension-l/data',(req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT * FROM hypertension_list ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/index/data',(req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT * FROM config ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/appointment/data',(req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT * FROM appointment ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/patient/data',(req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
       client.query("SELECT * FROM patient ", function (err, result) {
            done(); 
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
       })
   })
});
app.get('/patient/data/:hncode/:status', (req, res) => {
    res.send('Id is'+req.params.hncode+'Id2 is'+req.params.status)
    var hncode=req.params.hncode
    console.log(hncode)
    var status=req.params.status
    console.log(status)
  })
/*
app.post('/auth', function(request, response) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
    var username = request.body.Username;
    console.log(username)
    var password = request.body.Password;
	if (username && password) {
		client.query("SELECT * FROM login WHERE ht_username = ? AND ht_password = ?", [username, password], function(error, results, fields) {
            console.log(results)
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/index');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
        });
	} else {
		response.send('Please enter Username and Password!');
		response.end();
    }
})
});
*/
app.get('/login',function(req,resp){
    resp.sendFile('login.html',{root: path.join(__dirname,'./NCDs')});
})
app.get('/hypertension-visit',function(req,resp){
    resp.sendFile('hypertension-visit',{root: path.join(__dirname,'./hypertension-visit')})
})
app.get('/summaryVisit',function(req,resp){
    resp.sendFile('summaryVisit',{root: path.join(__dirname,'./summaryVisit')})
})
app.get('/hypertension_list',function(req,resp){
    resp.sendFile('hypertension_list',{root: path.join(__dirname,'./hypertension_list')})
})
/*
var Fdate
function dateT(startdate,enddate){
   Fdate = "where job_date between '" + startdate + "' and '" + enddate + "'"
   console.log(Fdate)
}
app.get('/data/:date/:date2', (req, res) => {
    res.send('Id is'+req.params.date)
    var startdate=req.params.date
    console.log(startdate)
    var enddate=req.params.date2
    console.log(enddate)
    dateT(startdate,enddate)
  })
*/
var server = app.listen(7500, function () { 
	console.log('Server is listening at port 7500...'); 
}); 
