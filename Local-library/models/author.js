let mongoose = require('mongoose');
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

AuthorSchema.virtual('name').get(function () {
  let fullname = '';
  if (this.firstName && this.familyName) {
    return fullname = this.familyName + ', ' + this.firstName + ' ';
  }
  return fullname = '';
});

AuthorSchema.virtual('lifespan').get(function () {
  // if(!this.dateOfBirth && this.dateOfDeath) {T
  //   return ('Died on (' + this.dateOfDeathFormatted + ').');
  // } else if(this.dateOfBirth && !this.dateOfDeath) {
  //   return ('Born on (' + this.dateOfBirthFormatted + ').');
  // } else if(!this.dateOfBirth && !this.dateOfDeath) {
  //   return 'No dates available.';
  // } else {
  //   return ('Died at ' + (this.dateOfDeath.getFullYear() - this.dateOfBirth.getFullYear()) + ' years.');
  // }

  if (this.dateOfDeath && this.dateOfBirth) {
    return this.dateOfDeath.getFullYear() - this.dateOfBirth.getFullYear();
  }
});

AuthorSchema.virtual('dateOfBirthFormatted').get(function () {
  return this.dateOfBirth ? moment(this.dateOfBirth).format('YYYY-MM-DD') : '';
});

AuthorSchema.virtual('dateOfDeathFormatted').get(function () {
  return this.dateOfDeath ? moment(this.dateOfDeath).format('YYYY-MM-DD') : '';
})

AuthorSchema.virtual('url').get(function () {
  return '/catalog/author/' + this._id;
});

let Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
