/*globals */

'use strict';

var stringHelper = stringHelper || {};

// helper function to format sql string
stringHelper.format = function(text) {
  var args = arguments;
  return text.replace(/\{(\d+)\}/g, function(match, number) {
    var pos = parseInt(number, 10);
    return typeof args[pos] === 'undefined' ? match : args[pos];
  });
};
