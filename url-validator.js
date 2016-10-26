//var jsdom = require('jsdom');

var validUrl = require('valid-url');
//var validate = require('url-validator')
  

function validURL(suspect) {
  /*var regexp = /(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(url);*/
    
    if (validUrl.isUri(suspect)){
        return true;
    } else {
        return false;
    }
    
    return false;
}

module.exports = validURL;