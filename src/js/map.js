// America
var am = {
    lat: 15,// 15
    lng: -85 // -85
};

// Europe
var eu = {
    lat: 56,
    lng: 40
};

// Africa
var af = {
    lat: 1,
    lng: 10
};

// Asia
var as = {
    lat: 51,
    lng: 125
};

// Oceania
var oc = {
    lat: -22,
    lng: 140
};

// Armazena o mapa
var map;

// Usado para testes no mapa
/*var locations = [
        {lat: alfenas.lat - 0.0002, lng: alfenas.lng - 0.0002},
        {lat: alfenas.lat - 0.0001, lng: alfenas.lng - 0.0001},
        {lat: alfenas.lat - 0.0003, lng: alfenas.lng + 0.0002},
        {lat: alfenas.lat + 0.0002, lng: alfenas.lng - 0.0005},
        {lat: alfenas.lat - 0.0005, lng: alfenas.lng - 0.0004},
        {lat: alfenas.lat + 0.0001, lng: alfenas.lng - 0.0002},
        {lat: alfenas.lat + 0.0003, lng: alfenas.lng - 0.0008},
        {lat: alfenas.lat - 0.0001, lng: alfenas.lng + 0.0004},
        {lat: alfenas.lat + 0.0005, lng: alfenas.lng - 0.0001},
        {lat: alfenas.lat - 0.0002, lng: alfenas.lng + 0.0008},
        {lat: alfenas.lat + 0.0006, lng: alfenas.lng - 0.0009},
        {lat: alfenas.lat - 0.0009, lng: alfenas.lng + 0.0004},
        {lat: alfenas.lat - 0.009, lng: alfenas.lng + 0.004}
      ]
*/
function addMarker(pos){
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });

    return marker;
}

function initMap() {
    // Cria o mapa
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: am,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: true,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#4a208e'}]},
            {
                featureType: "all",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#e1e5ed'}]
            }
        ]
    });
}
