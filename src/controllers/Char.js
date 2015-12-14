var _ = require('underscore');
var models = require('../models');

var Char = models.Char;

var makerPage = function(req, res) {
  Char.CharModel.findByOwner(req.session.account._id, function(err, docs) {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    res.render('app', { /*csrfToken: req.csrfToken(),*/ chars: docs });
  });
};

var makeChar = function(req, res) {
  if(!req.body.name ||
     !req.body.strength || !req.body.dexterity || !req.body.constitution ||
     !req.body.intelligence || !req.body.wisdom || !req.body.charisma) {
    return res.status(400).json({ error: 'All fields are requried' });
  }
  
  var charData = {
    name: req.body.name,
    strength: req.body.strength,
    dexterity: req.body.dexterity,
    constitution: req.body.constitution,
    intelligence: req.body.intelligence,
    wisdom: req.body.wisdom,
    charisma: req.body.charisma,
    owner: req.session.account._id
  };
  
  var newChar = new Char.CharModel(charData);
  
  newChar.save(function(err) {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    res.json({ type: 'makechar', char: newChar });
  });
};

var deleteChar = function(req, res) {
  var selectedChar = Char.CharModel.findByOwner(req.session.account._id, function(err, doc) {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    for(var i = 0; i < doc.length; i++) {
      if(doc[i].id == req.body.id) {
        console.log('deleting ' + doc[i].name);
        doc[i].remove();
      }
    }
    
    res.json({ type: 'deletechar', id: req.body.id });
  });
};

var selectChar = function(req, res) {
  var selectedChar = Char.CharModel.findByOwner(req.session.account._id, function(err, doc) {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    var charData;
    
    for(var i = 0; i < doc.length; i++) {
      if(doc[i].id == req.body.id) {
        console.log('selecting: ' + doc[i].name);
        charData = doc[i];
      }
    }
    
    res.json({ type: 'selectchar', char: charData });
  });
};

var editChar = function(req, res) {
  var updatedChar = Char.CharModel.findByOwner(req.session.account._id, function(err, doc) {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    var charData;
    
    for(var i = 0; i < doc.length; i++) {
      if(doc[i].id == req.body.old.id) {
        console.log('updating: ' + doc[i].name);
        doc[i].name = req.body.update.name;
        doc[i].strength = req.body.update.str;
        doc[i].dexterity = req.body.update.dex;
        doc[i].constitution = req.body.update.con;
        doc[i].intelligence = req.body.update.int;
        doc[i].wisdom = req.body.update.wis;
        doc[i].charisma = req.body.update.cha;
        
        charData = doc[i];
        
        doc[i].save(function(err) {
          if(err) {
            console.log('update saev err: ' + err);
            return res.status(400).json({ error: 'An error occured' });
          }
          
          res.json({ type: 'updatechar', char: charData });
        });
      }
    }
    
  });
  /*var updatedChar = Char.CharModel.findByIdAndUpdate(req.session.account._id, {
    $set: {
      name: req.body.update.name,
      strength: req.body.update.str,
      dexterity: req.body.update.dex,
      constitution: req.body.update.con,
      intelligence: req.body.update.int,
      wisdom: req.body.update.wis,
      charisma: req.body.update.cha
    }
  }, function(err, doc) {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    console.log('update doc: ' + doc);
  });*/
};

module.exports.makerPage = makerPage;
module.exports.make = makeChar;
module.exports.delete = deleteChar;
module.exports.select = selectChar;
module.exports.edit = editChar;