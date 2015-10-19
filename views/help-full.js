(function() {
  'use strict';

  window.Ractive.controller('help-full', function(component, data, el, config, done) {

    var HelpFull = component({
      data: data
    });

    HelpFull.require().then(function() {
      done();
    });

  });

})();
