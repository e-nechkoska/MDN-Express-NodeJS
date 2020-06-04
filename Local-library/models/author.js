let mongoose = require("mongoose");
let moment = require('moment');
 
let Schema = mongoose.Schema;

let AuthorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100,
  },
  family_name: {
    type: String,
    required: true,
    max: 100,
  },
  date_of_birth: Date,
  date_of_death: Date,
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.family_name + "," + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }

  return fullname;
});

AuthorSchema.virtual("lifespan").get(function () {
  return this.date_of_death.getYear() - this.date_of_birth.getYear();
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
})

AuthorSchema.virtual("url").get(function () {
  return "catalog/author/" + this._id;
});

let Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
