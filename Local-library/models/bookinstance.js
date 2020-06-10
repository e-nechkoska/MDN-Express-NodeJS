let mongoose = require('mongoose');
let moment = require('moment')

let Schema = mongoose.Schema;

const statuses = require("./statuses");

const statusNames = statuses.map(status => status.name);
const defaultStatus = statuses.find(status => status.selected);

let BookInstanceSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    imprint: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: statusNames,
        default: 'Maintenance', // OR defaultStatus.name
    },
    due_back: {
        type: Date,
        default: Date.now()
    }
});

BookInstanceSchema.virtual('url').get(function () {
    return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema.virtual('due_back_formatted').get(function () {
    return moment(this.due_back).format('YYYY-MM-DD'); //'MMMM Do, YYYY'
});

let BookInstance = mongoose.model('BookInstance', BookInstanceSchema);

module.exports = BookInstance;