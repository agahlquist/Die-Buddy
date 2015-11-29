var mongoose = require('mongoose');
var _ = require('underscore');

var CharModel;

var setName = function(name) {
  return _.escape(name).trim();
};

var CharSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName
  },
  
  strength: {
    type: Number,
    min: 0,
    required: true
  },
  
  dexterity: {
    type: Number,
    min: 0,
    required: true
  },
  
  constitution: {
    type: Number,
    min: 0,
    required: true
  },
  
  intelligence: {
    type: Number,
    min: 0,
    required: true
  },
  
  wisdom: {
    type: Number,
    min: 0,
    required: true
  },
  
  charisma: {
    type: Number,
    min: 0,
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account'
  },
  
  createdDate: {
    type: Date,
    default: Date.now
  }
});

CharSchema.methods.toAPI = function() {
  return {
    name: this.name,
    strength: this.strength,
    dexterity: this.dexterity,
    constitution: this.constitution,
    intelligence: this.intelligence,
    wisdom: this.wisdom,
    charisma: this.charisma,
  };
};

CharSchema.statics.findByOwner = function(ownerID, callback) {
  var search = { owner: mongoose.Types.ObjectId(ownerID) };
  
  return CharModel.find(search).select('name strength dexterity constitution intelligence wisdom charisma').exec(callback);
};

CharModel = mongoose.model('Char', CharSchema);

module.exports.CharModel = CharModel;
module.exports.CharSchema = CharSchema;