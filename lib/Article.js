var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {type: String},
    location: {type: String}
});

articleSchema.methods.getInfo = function() {
    var info = [title, location];
    return info;
}

var Article = mongoose.model("myArticle", articleSchema);

module.exports = Article;