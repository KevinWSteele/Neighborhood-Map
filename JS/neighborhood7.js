//store info for all the places
var places = [
    {
        name: "The Elephant House",
        hours: "8:00 am to 10:00 pm",
        address: "21 George IV Bridge",
        postcode: "EH1 1EN",
        url: "http://www.elephanthouse.biz/",
        lat: "55.947617",
        lng: "-3.191880",
        instagramTag: "elephanthouse"
    },
    {
        name: "Camera Obscura & World of Illusions",
        hours: "9:30 am to 7pm",
        address: "549 Castlehill",
        postcode: "EH1 2ND",
        url: "http://www.camera-obscura.co.uk/",
        lat: "55.948938",
        lng: "-3.195771",
        instagramTag: "cameraobscura"
    },
    {
        name: "Arthur's Seat",
        hours: "Open Year Round",
        address: "Holyrood Park",
        postcode: "EH8 8HG",
        url: "http://www.historic-scotland.gov.uk/index/places/propertyresults/propertyoverview.htm?PropID=PL_125",
        lat: "55.944033",
        lng: "-3.161799",
        instagramTag: "arthursseat"
    },
    {
        name: "National Museum of Scotland",
        hours:"10am - 5pm",
        address:"Chambers Street",
        postcode:"EH1 1JF",
        url:"http://www.nms.ac.uk/national-museum-of-scotland/",
        lat:"55.946965",
        lng:"-3.190852",
        instagramTag: "museumofscotland"
    },
    {
        name: "Princes Street Garden",
        hours: "7am - 7:15pm",
        address: "Princes Street",
        postcode: "EH2 2HG",
        url: "http://www.edinburgh.gov.uk/directory_record/164144/princes_street_gardens",
        lat: "55.952251",
        lng: "-3.193255",
        instagramTag: "princesstreetgarden"
    },
    {
        name: "City of the Dead Tours",
        hours: "Check site for tour times",
        address: "St Giles' Cathedral, The Royal Mile",
        postcode: "EH1 1RE",
        url: "http://www.cityofthedeadtours.com/",
        lat: "55.949771",
        lng: "-3.190791",
        instagramTag: "edinburghvaults"
    }

    ];

//create ko.observables for each part of a location
var Location = function(data){
    this.name = ko.observable(data.name);
    this.hours = ko.observable(data.hours);
    this.address = ko.observable(data.address);
    this.url = ko.observable(data.url);
    this.postcode = ko.observable(data.postcode);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.instagramTag = ko.observable(data.instagramTag);
};

//load google maps
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC-l8J-1yZsmU4jAXluphw5gN-qUSh_uRA' +
      '&signed_in=true&callback=initialize';
    script.onerror = function(){
        alert("Oops! Google maps could not be loaded, please try again later." );
    };

  document.body.appendChild(script);
}

//callback for google maps
function initialize(){
    ko.applyBindings(new viewModel());
}

var viewModel = function(){
  //VARIABLES
  var self = this;

  //Colors based on selection state so markers and names match colors
  var selectedIcon = 'http://www.google.com/mapfiles/marker.png',
        unselectedIcon = 'http://www.google.com/mapfiles/marker_green.png',
        selectedColor = 'red',
        unselectedColor = 'green';

  this.placeList = ko.observableArray([]); //array of locations data and markers associated with each location
  arrayOfMarkers = []; //markers stored in arrayOfMarkers

  self.filter = ko.observable(''); //user input in search field
  self.currentLocation = ko.observable(defaultName); //set current location to default

  //variables for instagram
  var defaultName ="Edinburgh";
  var defaultTag = "edinburgh";

  var instagramSelected = "visible";
  var instagramClosed = "hidden";

  //METHODS
  //push each location to the placeList array
  places.forEach(function(placeItem){
    self.placeList.push(new Location(placeItem));
  });

  //draw the map
  this.drawMap = function() {
    var edinburgh = new google.maps.LatLng(55.949080, -3.186951);
    var mapOptions = {
        zoom: 14,
        center: edinburgh,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementsByClassName('map-canvas')[0], mapOptions);

    //loop through ko placeList to change infoWindow and add marker for each location as object in placeList.
    var i;
    for (i = 0; i < self.placeList().length; i++) {

        var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=200x200&location=' +
        self.placeList()[i].lat() + ','+ self.placeList()[i].lng();

        //Add content for infoWindow - this changes for each marker
        var contentString = '<div id="content">' +
            '<h3>' + self.placeList()[i].name() + '</h3>' +
            '<p>Address: ' + self.placeList()[i].address() + '</p>' +
            '<p>Postcode: ' + self.placeList()[i].postcode() + '</p>' +
            '<p>Hours: ' + self.placeList()[i].hours() + '</p>' +
            '<a href = "' + self.placeList()[i].url() + '" target="_blank">Website</a>' +
            '<img src = "' + streetViewUrl + '">' +
            '</div>';
        var infowindow = new google.maps.InfoWindow({content: contentString});

        //Add markers to map
        var currentLatLng = new google.maps.LatLng(self.placeList()[i].lat(), self.placeList()[i].lng());
        var marker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            title: self.placeList()[i].name(),
            icon: unselectedIcon
        });

        //Push each marker into arrayOfMarkers
        arrayOfMarkers.push(marker);

    //Event listeners
    google.maps.event.addListener(marker, "click", self.markerReset);
    google.maps.event.addListener(infowindow, "closeclick", self.markerReset);

    //Use closure on click event to display correct infowindow content
    google.maps.event.addListener(marker, "click", (function(marker, contentString, infoWindow){
            return function(){
                infowindow.setContent(contentString);
                infowindow.open(map,this);
                self.currentLocation(this.title);
                marker.setIcon(selectedIcon);
                self.getInstagram();
                //map.panTo(marker.getPosition());
            };
        })(marker, contentString,infowindow));
    }  //End of loop through ko placeList

  }; //end of drawMap function


  //Reset marker colors and thename back to unselected color
  self.markerReset = function(){
    for (var i = 0; i < arrayOfMarkers.length; i++){
      arrayOfMarkers[i].setIcon(unselectedIcon);
      //Reset thename colors in list
      $("h3").css('color', unselectedColor);
    }
  };

  //Needed for filter in sidebar
  self.stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
        return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    //Filter the items using the filter text
    self.filteredItems = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter) {  //no search term entered so show all markers
        return self.placeList(); //nothing entered by user, so show entire list
      } else { //a search term is entered
          return ko.utils.arrayFilter(self.placeList(), function(Location) {
              return self.stringStartsWith(Location.name().toLowerCase(), filter) ;
          });
      }
    }, self.placeList, arrayOfMarkers);

    //display markers of the filtered items
    self.filteredMarkers = ko.computed(function() { //beginning of function
      for (var k = 0; k < self.filteredItems().length; k++) {
        for (var i = 0; i < arrayOfMarkers.length; i++) { //for each filteredItem, find the corresponding marker
          if (arrayOfMarkers[i].title === self.filteredItems()[k].name()) {
            arrayOfMarkers[i].setVisible(true);
          } else {
            arrayOfMarkers[i].setVisible(false);
          }
        }
      }
      var filter = self.filter().toLowerCase();
      if (!filter) {  //no search term entered so show all markers
        for (var j = 0; j < arrayOfMarkers.length; j++){
          arrayOfMarkers[j].setVisible(true);
        }
      }
    }, self.filteredItems, arrayOfMarkers);

    //code to sync clicked place in side bar with marker, making both selected red
    //when user clicks a place in the sidebar, make the corresponding marker red
    self.setPlace = function(data, event) {
        self.markerReset(); //ensure all the markers and sidebar names are green (unselected)
        var selectedMarker,
            unselectedMarker,
            tagInstagram;
        var nameClicked = $(event.target).text();
        //Loop through placeList to find marker that matches the name that was clicked
        for (i = 0; i < self.placeList().length; i++){
            if (nameClicked === self.placeList()[i].name()) {
              selectedMarker = arrayOfMarkers[i]; //selectedMarker becomes the marker object corresponding to location clicked
              arrayOfMarkers[i].setIcon(selectedIcon);
              tagInstagram = self.placeList()[i].instagramTag();
              self.currentLocation(nameClicked);
            }
        } //end of loop through placeList

        //Changes color of clicked name in list
        $(event.target).css('color', selectedColor);
        //Display the infowindow for the clicked name
        google.maps.event.trigger(selectedMarker, 'click');

        //Load Instagram photos for this location in case user clicks Instagram button
        //self.loadInstagram(nameClicked);
    };


  //Instagram API
  self.closeInstagram = function(){
    $(".photos").css("visibility", instagramClosed);
    self.currentLocation(defaultName);
  };

  self.openInstagram = function(){
    $(".photos").css("visibility", instagramSelected);
  };

  self.getInstagram = function(){
    self.removePhotos();
    var tagName;
    var foundName = false; //instagram tagName is set to default

    for (var j = 0; j < places.length; j++){

        if (self.currentLocation() == self.placeList()[j].name()) {
            tagName = self.placeList()[j].instagramTag();
            foundName = true;
            break;
        }
  }

    if (foundName === false){
        tagName = defaultTag;
    }
    var accessToken = "1105136919.eb73d41.ba4caf5b3107446bb36aa14afdebb8a8";

   //get each instagram photo
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/tags/" + tagName + "/media/recent?access_token=" + accessToken +"&count=6",

        success: function(data) {
        for (var i = 0; i < 6; i++) {
            //console.log(url);
            var imgURL = data.data[i].images.low_resolution.url;
            //console.log(data.data[i]);
            $(".insta").append("<img src='" + imgURL +"'class = 'ImgInstagram'></img>");
        }
        }
    }).error(function(e){
            $(".photoPanel").text("Oops! Instagram's photos could not be loaded. Please try again later.");
        });

  };

  //Remove photos from photopanel, so new photos can take their place.
  self.removePhotos = function(){
       var instagramPhotos = document.getElementById("photos");
       while (instagramPhotos.hasChildNodes()){
           instagramPhotos.removeChild(instagramPhotos.firstChild);
       }
   };

//EXECUTE METHODS
  self.getInstagram();
  self.drawMap();

};  //end of viewModel

window.onload = loadScript;
