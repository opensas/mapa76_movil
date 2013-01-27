/*globals console, $, stringHelper*/

'use strict';

var fusionTableHelper = fusionTableHelper || {};

/*
https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%201KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs%20ORDER%20BY%20ST_DISTANCE(geo%2C%20LATLNG(-34.58174%2C%20-58.4322))%20limit%202&key=AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc

https://www.googleapis.com/fusiontables/v1/query?sql=
SELECT * FROM 1KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs
ORDER BY ST_DISTANCE(geo, LATLNG(-34.58174, -58.4322))
limit 2&
key=AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc

*/

fusionTableHelper.sourceUrl = 'https://www.googleapis.com/fusiontables/v1/query';
fusionTableHelper.limit = 10;

fusionTableHelper.getNearestLocations = function(options) {
  var sql,
      url;

  if (!options.from)        throw new Error('from not specified!');
  if (!options.select)      throw new Error('select not specified!');
  if (!options.currentLat)  throw new Error('currentLat not specified!');
  if (!options.currentLng)  throw new Error('currentLng not specified!');
  if (!options.apiKey)      throw new Error('apiKey not specified!');
  if (!options.success)     throw new Error('success not specified!');

  options.sourceUrl = options.sourceUrl || fusionTableHelper.sourceUrl;
  options.limit = options.limit || fusionTableHelper.limit;

  if (!options.error) {
    options.error = function(jqXHR, textStatus, errorThrown) {
      console.log('error fetching nearest locations');
      console.log(errorThrown);
    };
  }

  sql = fusionTableHelper.format(
    'SELECT * FROM {1} ORDER BY ST_DISTANCE({2}, LATLNG({3}, {4})) LIMIT {5}',
    options.from, options.select,
    options.currentLat, options.currentLng, options.limit
  );

  url = options.sourceUrl +
    '?sql=' + encodeURIComponent(sql) +
    '&key=' + options.apiKey;

  $.ajax({
    url: url,
    success: function(data, textStatus, jqXHR) {
      var jsonData = fusionTableHelper.dataToJson(data);
      options.success(jsonData, textStatus, jqXHR);
    },
    error: options.error
  });

};

/*
{
kind: "fusiontable#sqlresponse",
columns: [
"ccd",
"ccd_otras_denom",
"geo",
"tipo_estab_ccd",
"ubic",
"nom_loc",
"nom_depto",
"nom_prov",
"País",
"latitud",
"longitud"
],
rows: [
[
"COMISARIA 23ª DE CAPITAL FEDERAL",
"",
"Av SANTA FE 4000 CAPITAL FEDERAL Argentina",
"DEPENDENCIA POLICIA FEDERAL",
"Av SANTA FE 4000",
"",
"",
"CAPITAL FEDERAL",
"Argentina",
"",
""
],
[
"COMISARIA 29ª DE CAPITAL FEDERAL",
"",
"LOYOLA 1441 CAPITAL FEDERAL Argentina",
"DEPENDENCIA POLICIA FEDERAL",
"LOYOLA 1441",
"",
"",
"CAPITAL FEDERAL",
"Argentina",
"",
""
]
]
}
 */

fusionTableHelper.dataToJson = function(data) {
  var source    = (typeof(data) === 'string' ? JSON.parse(data) : data),
      jsonData  = [],
      columns   = source.columns;

  source.rows.forEach(function(row) {
    jsonData.push(fusionTableHelper.rowToJson(row, columns));
  });

  return jsonData;
};

fusionTableHelper.rowToJson = function(row, columns) {
  var json = {};

  row.forEach(function(field, index) {
    json[columns[index]] = field;
  });

  return json;
};

// helper function to format sql string
fusionTableHelper.format = function(text) {
  var args = arguments;
  return text.replace(/\{(\d+)\}/g, function(match, number) {
    var pos = parseInt(number, 10);
    return typeof args[pos] === 'undefined' ? match : args[pos];
  });
};
