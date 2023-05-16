//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://vinuthasadasivam:Pravinu1209@cluster0.pqglaia.mongodb.net/todolistDB1", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

// const item1 = new Item({
//   name: "welcome to our todolist"
// });
const item1 = new Item({
  name: "welcome"
});

const item2 = new Item({
  name: "hit + button to add a new item"
});

const item3 = new Item({
  name: "hit -> to delete the item"
});

const defaultItems = [ item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems)
// .then(function(){
//   console.log("default items successfully saved ti db");
// })
// .catch(function(err){
//   console.log(err);
// });

app.get("/", function(req, res) {

Item.find({})
.then(function(foundItems){
  if(foundItems.length === 0){
    
Item.insertMany([item1, item2, item3])
.then(function(){
  // console.log("default items successfully saved ti db");
})
.catch(function(err){
  console.log(err);
});
res.redirect("/");
  }else{
    // console.log(foundItems);
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  
})
.catch(function(err){
  console.log(err);
});

  // res.render("list", {listTitle: "Today", newListItems: defaultItems});

});

app.get("/:postName",async function(req, res){
  const customListName = _.capitalize(req.params.postName);

 await List.findOne({name: customListName}).exec()

  
  .then(function(foundList){
 if(foundList===null){
  //   if(!foundList){
  //     console.log("d exists");
  //   }else{
  //     console.log("exists");
  //   }
  // })
  // .catch(function(err){
  //   console.log(err);
  // });

// console.log("d exists");
//creating a new list if the custom list name does not exists
const list = new List({
  name: customListName,
  items: defaultItems
});

list.save();
res.redirect("/" + customListName);


  }else{
    // console.log("e");
    //if the name already present then render the page
    res.render("list", {listTitle: foundList.name, newListItems: foundList.items}); 

  }
})
  .catch(function(err){
    console.log(err);
  });
  


 
 });

app.post("/",async function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
  name: itemName
 });



 if(listName === "Today"){
  item.save();
  res.redirect("/");
 }else{
await List.findOne({name: listName}).exec()
.then(function(foundList){
  foundList.items.push(item);
  foundList.save();
  res.redirect("/" + listName);
})
 }

});



// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName1 = req.body.listName;
 
  if(listName1 === "Today"){
   Item.findByIdAndRemove(checkedItemId)
   .then(function(foundItem){
     Item.deleteOne({_id: checkedItemId})
  
    // console.log("deleted");
    res.redirect("/");
   })
   .catch(function(err){
    console.log(err);
   });
 
  }else{
   List.findOneAndUpdate({name: listName1}, {$pull: {items: {_id: checkedItemId}}})
   .then(function(foundList){
     console.log(foundList);
     res.redirect("/" + listName1);
   })
   .catch(function(err){
     console.log(err);
   });
  }
  
 });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
