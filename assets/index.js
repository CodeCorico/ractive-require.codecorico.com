$(function() {
  'use strict';

  var _$el = {
    window: $(window),
    body: $('body'),
    container: $('#container'),
    navigation: $('#navigation')
  };

  function _scroll() {
    if (_$el.container.offset().top < _$el.window.scrollTop()) {
      _$el.navigation.addClass('fixed');
    }
    else {
      _$el.navigation.removeClass('fixed');
    }

    _$el.navigation.css('height', _$el.body.height());
  }

  _$el.window.scroll(_scroll);
  _$el.window.resize(_scroll);

  _scroll();

});
