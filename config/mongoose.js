const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURL).then(function (){
    console.log('database connected successfully...');
});

module.exports = mongoose.connection;