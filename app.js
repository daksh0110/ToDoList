const express = require("express");
require('dotenv').config();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const dotenv = require('dotenv')


const _=require("lodash");
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
 
 
const itemsSchema = {
  name:String
};
 
const Item = mongoose.model(
  "Item",itemsSchema
);
 
const item1 = new Item({
  name:"work"
})
 
const item2 = new Item({
  name:"play"
})
 
const item3 = new Item({
  name:"gym"
})
 
const listSchema = {
  name:String,
  items:[itemsSchema]
}
 
const defaultItems = [item1,item2,item3];
 
const List = mongoose.model("List", listSchema);
 
 
 
app.all("/", function(req, res) {
 
  Item.find({})
  .then(function(foundItems){
    if(foundItems.length === 0){
 
      Item.insertMany(defaultItems)
        .then(function(){
        console.log("added db");
        })
        .catch(function(err){
        console.log(err);
        });
        res.redirect("/");
    }else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  })
  .catch(function(err){
    console.log(err);
  })
 
  
 
});
 
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkedItemId)
  .then(function(){
    console.log("deleted item");
    })
  .catch(function(err){
    console.log(err);
    });
  res.redirect("/");
})
 
app.all("/", function(req, res){
 
  const itemName = req.body.newItem;
  const listname=req.body.list;
  const item = new Item({
    name:itemName
  });
  console.log(listname);
  if(listname=="Today"){
    item.save();
    res.redirect("/");
  } else{
    
    List.findOne({name:listname}).then(function(foundList){
      foundList.items.push(item)
      foundList.save();
      res.redirect("/"+listname);
    })
  }
  
 
 
});
 
app.get("/:customListName",function(req,res){
  const customListName = (req.params.customListName);
 
  List.findOne({name:_.capitalize(customListName)})
    .then(function(foundList){
        
          if(!foundList){
            const list = new List({
              name:customListName,
              items:defaultItems
            });
          
            list.save();
            console.log("saved");
            res.redirect("/"+customListName);
          }
          else{
            res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
          }
    })
    .catch(function(err){});
 
 
  
  
})
// app.all('*', (req,res) => {
//   // res.json({"every thing":"is awesome"})
// })

app.get("/about", function(req, res){
  res.render("about");
});
 
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
      console.log("listening for requests");
  })
});