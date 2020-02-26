$.getJSON("/savedArticles", function(data){
	for (var i = 0; i < data.length; i++){
		// display the information on the page
	    $("#savedArticles").append("<div class='panel panel-default article' data-id='" + data[i]._id + "'>"
	      + "<div class='row'><div class='col-md-8'>"
	      + "<h4>" + data[i].title + "</h4>"
	      + "<a href='" + data[i].link + "' target='_blank'>Click here for event details</a>"
	      + "</div><div class='col-md-4'>"
	      + "<button class = 'add-note btn btn-primary pull-right' data-toggle='modal' data-target='#notesmodal' data-id='" + data[i]._id + "'>Notes</button>"
	      + "<button class = 'unsave btn btn-primary pull-right' data-id='" + data[i]._id + "'>Remove</button>"
	      + "</div></div></div>"	
	    );	
	};
});

$(document).on("click", ".add-note", function(){
	$("#notes").empty();
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	.done(function(data){
	    console.log(data);
	    $("#notes").append("<h4>" + data.title + "</h4>");
	    $("#notes").append("<input class='form-control' id='titleinput' name='title' placeholder='Title' >");
	    $("#notes").append("<textarea class='form-control' id='bodyinput' name='body' placeholder='Enter notes here'></textarea>");
	    $("#notes").append("<br><button class='btn btn-primary' data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save and Close</button>");
	    if (data.note) {
	    	$("#titleinput").val(data.note.title);
	    	$("#bodyinput").val(data.note.body);
	    }		
	});
});

$(document).on("click", "#savenote", function(){
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	})
	.done(function(data){
		console.log(data);
		$("#notes").empty();
	});

	$("#titleinput").val("");
	$("#bodyinput").val("");
});

$(document).on("click", ".unsave", function(){
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/save",
		data: {
			id: thisId,
			saved: false
		}
	})
	.done(function(data){
		console.log(data);
	});

	var articleSelector = ".article[data-id='" + thisId + "']";
	$(articleSelector).remove();
	$("#notes").empty();
});


