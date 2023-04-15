const express = require('express')
const app = express()
require("dotenv").config();

const port = process.env.PORT||8001

const morgan = require('morgan')
const handlebars = require('express-handlebars');
const bodyParser  = require('body-parser')
const cookieParser = require('cookie-parser') 
const cors = require('cors');
const path = require('path');


const { Client } = require('pg');

const connect = {
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT_DB,
}
const client = new Client(connect);

client.connect()
.then(() => console.log('Connected successfully!'))
.catch(err => console.error('Connection error', err.stack))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use(cookieParser())

//HTTP logger
app.use(morgan('combined'))

// lấy file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

//template engine
app.engine('hbs',handlebars.engine({
    extname : '.hbs',
    helpers : {
        // các function sử dụng
    }
  }));
app.set('view engine', 'hbs');
app.set('views',path.join(__dirname, 'resources','views'));

app.use(express.urlencoded({
  extended: true
})); 
app.use(express.json()); 

app.get("/api/search", (req, res) =>{
  try {
    const name = req.query.name.toLowerCase()
    const name2 = req.query.name.toLowerCase()
    if(name){
      const query = `SELECT *, ST_X(ST_Centroid(geom)) as x, ST_Y(ST_Centroid(geom)) as y 
               FROM camhoangdc_1 
               WHERE LOWER(txtmemo) LIKE '%${name}%' 
                     OR 
                     LOWER(chusd) LIKE '%${name2}%'`;

      client.query(query, (err, response) => {
        if (err) throw err;

        const data = response?.rows?.map(row => ({
          ma_memo: row.txtmemo,
          name: row.chusd,
          shape_area: row.shape_area,
          x: row.x,
          y: row.y,
      }));
        res.status(200).json({
          data:data,
          message:"Lấy dữ liệu thành công"
        })
      });
    }
    else{
      res.status(400).json({message:"hãy nhập thông tin cần search"})
    }
  } catch (error) {
    res.status(500).json({message:"Lỗi server"})
  }
 
  
})


app.get("/", (req, res) =>res.render('home'))




app.listen(port,()=>(console.log(`App listening on http://localhost:${port}`)
))