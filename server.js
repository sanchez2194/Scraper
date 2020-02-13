var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");



var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./public/models");


var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

console.log("Using database " + MONGODB_URI);


var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.get("/clean", function(req, res){
	
			res.send("Database updated.");
	
});


app.get("/scrape", function(req, res){
	
	axios.get("https://fastcompany.com/").then(function(response){
		var $ = cheerio.load(response.data);

		$("article").each(function(i, element){
			var result = {};

			result.title = $(this)
				.children("a")
				.attr("title");

			ArticleLink = $(this)
				.children("a")
				.attr("href");

			if (ArticleLink.charAt(0) === "/") {
				ArticleLink = "https://www.fastcompany.com" + ArticleLink;
				result.link = ArticleLink;
			}
			else {
				result.link = ArticleLink;
			}

			
			

			db.Article
			.find({title: result.title})
			.limit(1)
			.then(function(check){

				console.log('this is our check -', check);
				console.log('this is our result.title -', result.title);

				
			});
		});
		res.send("Scrape Complete");
	});
});

app.get("/articles", function(req, res){
	db.Article
		.find({})
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		});
});

app.get("/savedArticles", function(req, res){
	db.Article
		.find({ saved: true })
		.then(function(dbArticles){
			res.json(dbArticles);
		})
		.catch(function(err){
			res.json(err);
		});
});

app.get("/articles/:id", function(req, res){
	db.Article
		.findOne({ _id: req.params.id })
		.populate("note")
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		});
});

app.post("/articles/:id", function(req, res){
	db.Note
		.create(req.body)
		.then(function(dbNote){
			return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
		})
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		});
});

app.post("/save", function(req, res){
	db.Article
		.findOneAndUpdate({ _id: req.body.id }, { saved: req.body.saved }, { new: true })
		.then(function(dbArticle){
			res.json(dbArticle);
		})
		.catch(function(err){
			res.json(err);
		});
});



app.listen(PORT, function(){
	console.log("App running on port " + PORT);
});