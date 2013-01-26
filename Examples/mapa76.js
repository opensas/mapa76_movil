var mapa76 = mapa76 || {};

/*
// https://www.googleapis.com/fusiontables/v1/query?sql=
SELECT%20*%20FROM%201KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs%20
ORDER%20BY%20ST_DISTANCE(geo,%20LATLNG(-34.58174,-58.4322))&key=AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc
*/

mapa76.ftUrl = 'https://www.googleapis.com/fusiontables/v1/query';

mapa76.tableId = '1KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs';

mapa76.apiKey = 'AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc';

mapa76.geoField = 'geo';

mapa76.getNearbyCCDS = function(options) {

  if (!options.tableId)     throw new Error('tableId not specified!');
  if (!options.geoField)    throw new Error('geoField not specified!');
  if (!options.currentLat)  throw new Error('currentLat not specified!');
  if (!options.currentLng)  throw new Error('currentLng not specified!');
  if (!options.apiKey)      throw new Error('apiKey not specified!');
  if (!options.success)     throw new Error('success not specified!');

  options.ftUrl = options.ftUrl || mapa76.ftUrl;

  if (!options.error) {
    options.error = function(jqXHR, textStatus, errorThrown) {
      console.log('error fetching nearest CCDS');
      console.log(errorThrown);
    }
  }

  if (!options.tableId) throw new Error('tableId not specified!');

  var sql =
    'SELECT * FROM ' + options.tableId + ' ' +
    'ORDER BY ST_DISTANCE(' + options.geoField + ', ' +
      'LATLNG(' + options.currentLat.toString() + ',' + options.currentLng.toString() + ')' +
    ')';

  url = options.ftUrl +
    '?sql=' + encodeURIComponent(sql) +
    '&key=' + options.apiKey;

  $.ajax({
    url: url,
    success: options.success,
    error: options.error
  });

}





