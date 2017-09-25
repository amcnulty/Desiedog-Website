var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {type: String},
    pageTitle: {type: String},
    author: {type: String},
    articleBody: {type: String}
});

articleSchema.methods.getInfo = function() {
    var info = [title, pageTitle, author, articleBody];
    return info;
}

var Article = mongoose.model("myArticle", articleSchema);

module.exports = Article;