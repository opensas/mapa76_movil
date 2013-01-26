var mapa76 = mapa76 || {};

// https://www.googleapis.com/fusiontables/v1/query?sql=
SELECT%20*%20FROM%201KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs%20
ORDER%20BY%20ST_DISTANCE(geo,%20LATLNG(-34.58174,-58.4322))&key=AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc

mapa76.tableId = '1KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs';

mapa76.apiKey = 'AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc';

mapa76.geoField = 'geo';

mapa76.getNearbyCCDS(currentLat, currentLng, limit, success, error) {

  var url =
    'sql=SELECT * FROM ' + mapa76.tableId +
    'ORDER BY ST_DISTANCE(' + mapa76.geo + ', ' +
      'LATLNG(' + currentLat.toString() + ',' + currentLng.toString() + ')' +
    ')&' +
    'key=' + mapa76.apiKey;

  url = encodeURIComponent(uri);

  $.ajax({
    url: url,
    success: success,
    error: err
  });

}





