google.load('jquery', '1');
google.load('maps', '3', {'other_params': 'key=your-api-key-here'});

// Create the Trendy Lights app.
google.setOnLoadCallback(function() {
  $.get('https://trendy-lights-dot-ee-demos.appspot.com/');
  var mapType = getEeMapType(eeMapId, eeToken);
  createMap(mapType);
});

/**
 * Creates a Google Map with a black background the given map type rendered.
 * The map is anchored to the DOM element with the CSS class 'map'.
 * @param {google.maps.ImageMapType} mapType The map type to include on the map.
 * @return {google.maps.Map} A map instance with the map type rendered.
 */
var createMap = function(mapType) {
  var mapOptions = {
    backgroundColor: '#000000',
    center: trendy.App.DEFAULT_CENTER,
    disableDefaultUI: true,
    zoom: trendy.App.DEFAULT_ZOOM
  };
  var mapEl = $('.map').get(0);
  var map = new google.maps.Map(mapEl, mapOptions);
  map.setOptions({styles: trendy.App.BLACK_BASE_MAP_STYLES});
  map.overlayMapTypes.push(mapType);
  return map;
}

/**
 * Generates a Google Maps map type (or layer) for the passed-in EE map id. See:
 * https://developers.google.com/maps/documentation/javascript/maptypes#ImageMapTypes
 * @param {string} eeMapId The Earth Engine map ID.
 * @param {string} eeToken The Earth Engine map token.
 * @return {google.maps.ImageMapType} A Google Maps ImageMapType object for the
 *     EE map with the given ID and token.
 */
var getEeMapType = function(eeMapId, eeToken) {
  var eeMapOptions = {
    getTileUrl: function(tile, zoom) {
      var url = trendy.App.EE_URL + '/map/';
      url += [eeMapId, zoom, tile.x, tile.y].join('/');
      url += '?token=' + eeToken;
      return url;
    },
    tileSize: new google.maps.Size(256, 256)
  };
  return new google.maps.ImageMapType(eeMapOptions);
};


/** @type {string} The Earth Engine API URL. */
trendy.App.EE_URL = 'https://earthengine.googleapis.com';


/** @type {number} The default zoom level for the map. */
trendy.App.DEFAULT_ZOOM = 4;


/** @type {Object} The default center of the map. */
trendy.App.DEFAULT_CENTER = {lng: 5, lat: 50};

/**
 * @type {Array} An array of Google Map styles. See:
 *     https://developers.google.com/maps/documentation/javascript/styling
 */
trendy.App.BLACK_BASE_MAP_STYLES = [
  {stylers: [{lightness: -100}]},
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  }
];
