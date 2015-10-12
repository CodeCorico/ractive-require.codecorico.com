$(function() {
  'use strict';

  var _$el = {
        window: $(window),
        body: $('body'),
        container: $('#container'),
        navigation: $('#navigation')
      },
      _entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;'
      };

  function _escapeHtml(string) {
    return String($.trim(string)).replace(/[&<>"'\/]/g, function(s) {
      return _entityMap[s];
    });
  }

  function _scroll() {
    if (_$el.container.offset().top < _$el.window.scrollTop()) {
      _$el.navigation.addClass('fixed');
    }
    else {
      _$el.navigation.removeClass('fixed');
    }

    _$el.navigation.css('height', _$el.body.height());
  }

  function _updateExampleDOM($dom, content) {
    $dom.html(_escapeHtml(content));
    $dom.removeClass('prettyprinted');

    window.PR.prettyPrint();

    var $container = $dom.parents('.container-example');
    if (!$container.length) {
      return;
    }

    _resizeContainerExample($container);
  }

  function _resizeContainerExample($container) {
    var maxHeight = 0;

    $container.find('.content-example').each(function(i) {
      var $content = $(this);

      $content.css('height', '');

      var height = $content.height(),
          id = $content.attr('id');

      maxHeight = height > maxHeight ? height : maxHeight;

      $('[data-target=' + id + ']').click(function() {
        $container.find('.content-example').css('display', 'none');
        $content.css('display', 'block');
      });

      if (i > 0) {
        $content.css('display', 'none');
      }
    });

    $container.css('height', maxHeight);
    $container.find('.content-example').css('height', maxHeight);
  }

  $('.prettyprint:not(.escaped)').each(function() {
    var $this = $(this);

    $this.html(_escapeHtml($this.html()));
  });

  // Example Basics

  var BasicsPage = new window.Ractive({
        el: 'basics-page',
        template: $('#basics-page').html()
      }),
      $basicsPageDOM = $('#example-basics .example-dom'),
      basicsDOMTemplates = {
        initial: [
          '<div id="basics-page">\n\n',
          '  <h4>Here is a page</h4>\n',
          '  <button id="basics-help">Open the help</button>\n\n',
          '  <rv-require name="help" src="views/help"></rv-require>\n\n',
          '</div>'
        ].join(''),

        opened: [
          '<div id="basics-page">\n\n',
          '  <h4>Here is a page</h4>\n',
          '  <button id="basics-help">Close the help</button>\n\n',
          '  <rv-require name="help" src="views/help" class="rv-require-loaded" loaded="true">\n',
          '    <div class="help">\n',
          '      <h4>HELP</h4>\n',
          '      <p>Help content</p>\n',
          '    </div>\n',
          '  </rv-require>\n\n',
          '</div>'
        ].join('')
      };

  _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.initial);

  $('#basics-help').click(function() {
    var opened = $('#basics-help').data('opened') || false;

    if (opened) {
      BasicsPage.childrenRequire[0].teardown();
      $('#basics-help').html('Open the help');
      $('#basics-help').data('opened', false);

      _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.initial);
    }
    else {
      BasicsPage.require().then(function() {
        $('#basics-help').html('Close the help');
        $('#basics-help').data('opened', true);

        _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.opened);
      });
    }
  });

  // ----

  $('.container-example').each(function() {
    _resizeContainerExample($(this));
  });

  _$el.window.scroll(_scroll);
  _$el.window.resize(_scroll);

  _scroll();

});
