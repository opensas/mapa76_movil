/*globals console, $, stringHelper*/

(function(global) {
  'use strict';

  var previousFusionTableHelper = global.fusionTableHelper;

  var fusionTableHelper = fusionTableHelper || {};

  fusionTableHelper.sourceUrl = 'https://www.googleapis.com/fusiontables/v1/query';
  fusionTableHelper.limit = 10;

/**
 * Devuelve los n puntos de una tabla fusionTable
 * mas cercanos a un punto en particular
 *
 * La función construye la sentencia sql para fusion tables y retorna la información
 *
 * Ejemplo de consulta a fusion tables:
 *
 * Url completa: https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%201KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs%20ORDER%20BY%20ST_DISTANCE(geo%2C%20LATLNG(-34.58174%2C%20-58.4322))%20limit%202&key=AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc
 *
 * https://www.googleapis.com/fusiontables/v1/query?sql=      // sourceUrl
 * SELECT * FROM 1KiW-7fK2u-wjSLmDafvTqhrdtqzN2bTT89qTELs      // from
 * ORDER BY ST_DISTANCE(geo, LATLNG(-34.58174, -58.4322))      // select, currentLat, currentLng
 * limit 2&                                                    // limit
 * key=AIzaSyAHn8YAHgeY5tIhCEsEWW7e-ND2hBc0HOc                 // apiKey
 *
 * @param  {Object}   options             Parámetros para realizar la consulta en la tabla fusionTable
 *
 * @param  {string}   options.from        id de la tabla fusionTable
 * @param  {string}   options.select      Campo de la tabla que contiene la dirección geolocalizada
 * @param  {string}   options.currentLat  Latitud del punto a tomar como referencia
 * @param  {string}   options.currentLng  Longitud del punto a tomar como referencia
 * @param  {string}   options.apiKey      Clave de desarrollador de fusionTable para poder realizar la consulta
 * @param  {string}   options.limit       Cantidad de puntos a retorna. (por defecto 10)
 * @param  {string}   options.sourceUrl   Endpoint del web service de fusion tables
 *                                        (por defecto 'https://www.googleapis.com/fusiontables/v1/query')
 * @param  {string}   options.apiKey      Clave de desarrollador de fusionTable para poder realizar la consulta
 *
 * @param  {function(data: Object, ?string: textStatus, ?Object: jqXHR)} options.success
 *                                        Funcion a ejecutar luego de realizar la consulta.
 * @param  {function} options.error       Funcion a ejecutar si hubo un error al consultar
 *                                        el web servide de fustion tables.
 *
 * @return {null}                         La función no retorna nada, simplemente ejecuta options.success
 */
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

/**
 * Convierte un json del formato fusiontable#sqlresponse a un objeto json
 * @param  {Object|string} data   objeto json o cadena de texto en formato fusiontable#sqlresponse
 * @return {Object}               objeto json
 *
 * @example
 * var fusionData = {
 *   columns: ['name', 'age'],
 *   rows: [
 *     ['John', 23],
 *     ['Jim', 4],
 *     ['Jules', 45]
 *   ]
 * };
 *
 * fusionTableHelper(fusionData) -> [
 *   { name: 'John',  age: 23 },
 *   { name: 'Jim',   age: 4 },
 *   { name: 'Jules', age: 45 },
 * ]
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

/**
 * Implementación de función similar a printf, con remplazo de variables
 * @param  {string}       text            Cadena de texto en la cual remplazar los valore {1}, {2} .. {n}
 * @param  {...string}    replace_values  Valores a ser remplazados por {1}, {2}, ... {n}
 * @return {string}       the text with the values replaced
 *
 * @example
 *
 * fusionTableHelper.format('valores {1}, {2}, {3} y de vuelta {1}', 'uno', 'dos') ->
 *   'valores uno, dos, {3} y de vuelta uno'
 */
  fusionTableHelper.format = function(text) {
    var args = arguments;
    return text.replace(/\{(\d+)\}/g, function(match, number) {
      var pos = parseInt(number, 10);
      return typeof args[pos] === 'undefined' ? match : args[pos];
    });
  };

/**
 * Método para evitar conflictos con otra librería llamada fusionTableHelper
 * para más información ver https://github.com/airbnb/javascript#modules
 * @return {Object}   retorna el objeto fusionTableHelper
 */
  fusionTableHelper.noConflict = function noConflict() {
    global.fusionTableHelper = previousFusionTableHelper;
    return fusionTableHelper;
  };

  global.fusionTableHelper = fusionTableHelper;
}(this));
