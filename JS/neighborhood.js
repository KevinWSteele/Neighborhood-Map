var places = [
    {
        name: "The Elephant House",
        hours: "8:00 am to 10:00 pm",
        address: "21 George IV Bridge",
        postcode: "97212",
        url: "elephanthouse.biz",
        lat: "55.947617",
        lng: "-3.191880"
    },
    {
        name: "Camera Obscura & World of Illusions",
        hours: "9:30 am to 7pm",
        address: "549 Castlehill",
        postcode: "",
        url: "http://www.camera-obscura.co.uk/",
        lat: "55.948938",
        lng: "-3.195771"
    },
    {
        name: "Arthur's Seat",
        hours: "Open Year Round",
        address: "Holyrood Park",
        postcode: "",
        url: "http://www.historic-scotland.gov.uk/index/places/propertyresults/propertyoverview.htm?PropID=PL_125",
        lat: "55.944033",
        lng: "-3.161799"
    },
    {
        name: "National Museum of Scotland",
        hours:"10am - 5pm",
        address:"Chambers Street",
        postcode:"EH1 1JF",
        url:"http://www.nms.ac.uk/national-museum-of-scotland/",
        lat:"55.946965",
        lng:"-3.190852"
    },
    {
        name: "Princes Street Garden",
        hours: "7am - 7:15pm",
        address: "EH2 2HG",
        postcode: "",
        url: "http://www.edinburgh.gov.uk/directory_record/164144/princes_street_gardens",
        lat: "55.952251",
        lng: "-3.193255"
    }
    
    ];

var thePlace = function(data){
  this.hours = ko.observable(data.hours);
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.url = ko.observable(data.url);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  
  //var self = this;
 
 
        
   /*this.incLevel = ko.computed(function() {
    var level;
    var clicks = this.clickCount();
    if (clicks < 3) {
        level = "child";
    }
    else if (clicks < 8){
      level = "adult";
    }
    else level = "BADASS";
    return level;
    }, this);*/
  
  
  
}



var viewModel = function(){
  var self = this;
  var markersArray = [];
  this.placeList = ko.observableArray([]);
  var image = 'marker_green.png';
  //var map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
  self.drawMap = function() {
    //Use only one infowindow - neater and it closes as new marker is clicked; infowindow position is position of corresponding marker
    var infowindow = new google.maps.InfoWindow();
 
        //Draw the map
    var edinburgh = new google.maps.LatLng(55.952051, -3.175009);
    var mapOptions = {
        zoom: 13,
        center: edinburgh,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
        //loop through arrayOfLocations to change infoWindow and add marker for each location in arrayOfLocations.
    var i;
    for (i = 0; i < self.places().length; i++) {
        //Add content for infoWindow - this changes for each marker
        var contentString = '<div id="list">' +
            '<h3>' + self.places()[i].name() + '</h3>' +
            '<p>Address: ' + self.places()[i].address() + '</p>' +
            '<p>Zip: ' + self.places()[i].postcode() + '</p>' +
            '<p>Hours: ' + self.places()[i].hours() + '</p>' +
            '<p>' + self.places()[i].url() + '</p>' +
            '</div>';
 
            //Add markers to map
        var currentLatLng = new google.maps.LatLng(self.places()[i].lat(), self.places()[i].lng());
            //Create the marker
        var marker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            title: self.places()[i].name(),
            icon: image
        });
 
            //Push each marker into arrayOfMarkers
        markersArray.push(marker);
           
            //Draw the marker on the map
        marker.setMap(map);
  
  //places.forEach(function(placeItem){
    //self.placeList.push(new thePlace(placeItem));
    
    //var currentLatLng = new google.maps.LatLng(self.places()[i].lat(), self.places()[i].lng());   
    //var myLatLng = new google.maps.LatLng(55.947617, -3.191880);
    /*var greenMarker = new google.maps.Marker({
            position: currentLatLng,
            map: map,
            icon: image
  });*/
    
   
    /*self.drawMap = function() {
        //Use only one infowindow - neater and it closes as new marker is clicked; infowindow position is position of corresponding marker
        var infowindow = new google.maps.InfoWindow();
 
        //Draw the map
        //var portland = new google.maps.LatLng(45.522400, -122.654422);
        /*var mapOptions = {
            zoom: 13,
            center: portland,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };*/
        //var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        //loop through arrayOfLocations to change infoWindow and add marker for each location in arrayOfLocations.
        /*var i;
        for (i = 0; i < self.places().length; i++) {
            //Add content for infoWindow - this changes for each marker
            var contentString = '<div id="content">' +
                '<h3>' + self.arrayOfLocations()[i].name() + '</h3>' +
                '<p>Address: ' + self.arrayOfLocations()[i].address() + '</p>' +
                '<p>Zip: ' + self.arrayOfLocations()[i].zipcode() + '</p>' +
                '<p>Hours: ' + self.arrayOfLocations()[i].hours() + '</p>' +
                '<p>' + self.arrayOfLocations()[i].url() + '</p>' +
                '</div>';
 
            //Add markers to map
            var currentLatLng = new google.maps.LatLng(self.places()[i].lat(), self.places()[i].lng());
            //Create the marker
            var marker = new google.maps.Marker({
                position: currentLatLng,
                map: map,
                title: self.arrayOfLocations()[i].name(),
                icon: normalIcon
            });
 
            //Push each marker into arrayOfMarkers
            arrayOfMarkers.push(marker);
           
            //Draw the marker on the map
            marker.setMap(map); */
    
  };
  
  //this.currentplace = ko.observable(this.placeList()[0]);
  
  /*this.incrementCounter = function(){
    self.currentCat().clickCount(self.currentCat().clickCount() + 1);
  }
  
  this.setCat = function(clickedCat){
    self.currentCat(clickedCat);
  }*/

};
};
ko.applyBindings(new viewModel());