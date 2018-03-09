var instruments = ["Guitar", "Fiddle", "Violin", "Cello", "Drum", "Keyboard", "Trombone", "Clarinet"];
var storageKey = "myInstrumentArray";
var storageType = localStorage;

function loadButtons() {
    var dtemp = JSON.parse(storageType.getItem(storageKey));
    if (dtemp != null && dtemp.length > 0) {
        instruments = dtemp;
    }

    for (var i = 0; i < instruments.length; i++) {
        var music = instruments[i];

        addButton(music);
    }
}

function addButton(music) {
    var button = $("<button>");
    button.attr("data-music", music);
    button.addClass("btn btn-info musicButton");
    button.append(music);

    var butDiv = $("#musicButtons");
    butDiv.append(button);
}

loadButtons();

$(document).on("click", ".musicButton", function () {
    var music = $(this).attr("data-music");
    console.log(music);

    var searchTerm = music;

    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=Gc5FI979zU30A8kQUEMBdAcTmScRxuR7&q=" +
        searchTerm + "&limit=10&offset=0&rating=G&rating=PG&lang=en";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        var results = response.data;
        $("#musicGifs").empty();
        for (var i = 0; i < results.length; i++) {
            var gifDiv = $("<div class='item'>");

            var rating = results[i].rating;

            var p = $("<p>").text("Rating: " + rating);

            var personImage = $("<img>");
            personImage.attr("src", results[i].images.fixed_height_still.url);
            personImage.attr("data-still", results[i].images.fixed_height_still.url);
            personImage.attr("data-animate", results[i].images.fixed_height.url);
            personImage.addClass("gif");
            personImage.attr("data-state", "still");

            gifDiv.prepend(p);
            gifDiv.append(personImage);


            $("#musicGifs").prepend(gifDiv);
        }
    });
});

$("#addMusic").on("click", function () {
    event.preventDefault();
    var input = $("#music-input").val();

    if (!instruments.includes(input)) {
        instruments.push(input);
        storageType.setItem(storageKey, JSON.stringify(instruments));
        addButton(input);
    }
    document.getElementById("music-input").value = "";
});

$(document).on("click",".gif", function() {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

