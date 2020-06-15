let mongoose = require("mongoose");
let moment = require('moment');
 
let Schema = mongoose.Schema;

let AuthorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    max: 100,
  },
  familyName: {
    type: String,
    required: true,
    max: 100,
  },
  dateOfBirth: Date,
  dateOfDeath: Date,
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.firstName && this.familyName) {
    fullname = this.familyName + "," + this.firstName;
  }
  if (!this.firstName || !this.familyName) {
    fullname = "";
  }

  return fullname;
});

AuthorSchema.virtual("lifespan").get(function () {
  if(!this.dateOfBirth && this.dateOfDeath) {
    return this.dateOfDeath.getYear();
  } else if(this.dateOfBirth && !this.dateOfDeath) {
    return this.dateOfBirth.getYear();
  } else if(!this.dateOfBirth && !this.dateOfDeath) {
    return '';
  } else {
    return this.dateOfDeath.getYear() - this.dateOfBirth.getYear();
  }
});

AuthorSchema.virtual("dateOfBirthFormatted").get(function () {
  return this.dateOfBirth ? moment(this.dateOfBirth).format('YYYY-MM-DD') : '';
});

AuthorSchema.virtual("dateOfDeathFormatted").get(function () {
  return this.dateOfDeath ? moment(this.dateOfDeath).format('YYYY-MM-DD') : '';
})

AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

let Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
