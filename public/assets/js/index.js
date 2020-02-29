$("#get-articles").click(function() {
  // $.ajax({
  // 	method: "GET",
  // 	url: "/clean"
  // })
  // .done(function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function() {
    $("#articles").empty();

    $.getJSON("/articles", function(data) {
      console.log("Inside getJSON");
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#articles").append(
          "<div class='panel panel-default article' data-id='" +
            data[i]._id +
            "'>" +
            "<div class='row'><div class='col-md-8'>" +
            "<h4>" +
            data[i].title +
            "</h4>" +
            "<a href='" +
            data[i].link +
            "' target='_blank'>Link to Article Source</a>" +
            "</div><div class='col-md-4'>" +
            "<button class='save-article btn btn-primary pull-right' data-id='" +
            data[i]._id +
            "'>Save</button>" +
            "</div></div></div>"
        );

        if (data[i].saved) {
          // disable the save button
          var articleSelector = ".save-article[data-id='" + data[i]._id + "']";
          $(articleSelector).attr("disabled", "disabled");
          $(articleSelector).text("Saved");
        }
      }
    });
  });
  // });
});

$(document).on("click", ".save-article", function() {
  // grab the id associated with the article
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $(this).text("Saved");
  $(this).attr("disabled", "disabled");

  $.ajax({
    method: "POST",
    url: "/save",
    data: {
      id: thisId,
      saved: true
    }
  }).done(function(data) {
    console.log(data);
  });
});
