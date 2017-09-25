var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    poster: {type: String},
    headline: {type: String},
    title: {type: String},
    pageTitle: {type: String},
    author: {type: String},
    articleBody: {type: String},
    featured: {type: Boolean}
});

articleSchema.methods.getInfo = function() {
    var info = [title, pageTitle, author, articleBody];
    return info;
}

var Article = mongoose.model("myArticle", articleSchema);

module.exports = Article;