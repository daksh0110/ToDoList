const {Client} = require("pg");
const client = new Client(
    {
        host: 'localhost',
        port: 5432,
        password:"Mahaksh@123",
        user: 'postgres',
        database:'postgres'
    }
  
  )


  module.exports=client;