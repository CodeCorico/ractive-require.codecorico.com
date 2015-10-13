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
    $dom.html(_escapeHtml(content.html));
    $dom.removeClass('prettyprinted');

    window.PR.prettyPrint();

    $dom.html($.trim($dom.html()));

    var $containerExample = $dom.parents('.container-example');
    if (!$containerExample.length) {
      return;
    }

    var $contentExample = $dom.parents('.content-example');
    if (!$contentExample.length) {
      return;
    }

    $contentExample.find('.example-dom-comment').remove();

    if (content.comments && content.comments.length) {
      $.each(content.comments, function(i, comment) {
        var $content = $('<div />')
          .addClass('example-dom-comment')
          .css({
            top: comment.top,
            left: comment.left
          })
          .html([
            '<button class="example-dom-comment-button">' + comment.number + '</button>',
            '<div class="example-dom-comment-content">' + comment.html + '</div>'
          ]);

        $content.find('.example-dom-comment-button').click(function() {
          $content.toggleClass('opened');
        });

        $contentExample.append($content);
      });
    }

    _resizeContainerExample($containerExample);
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
        initial: {
          html: [
            '<head>\n',
            '  ...\n',
            '</head>\n',
            '<body>\n',
            '  <h4>Here is a page</h4>\n',
            '  <button id="basics-help">Open the help</button>\n',
            '  <button id="basics-reset">Reset the example</button>\n\n',
            '  <rv-require name="help" src="views/help"></rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 1,
            top: 467,
            left: 28,
            html: [
              'Use this tag to add content can be loaded on demand.'
            ].join('')
          }, {
            number: 2,
            top: 120,
            left: 184,
            html: [
              'Click to call the .require() method and<br />load all the rv-require elements.'
            ].join('')
          }]
        },

        opened: {
          html: [
            '<head>\n',
            '  <link rel="stylesheet" href="views/help.css">\n',
            '  <script type="text/javascript" src="views/help.js"></script>\n',
            '</head>\n',
            '<body>\n',
            '  <h4>Here is a page</h4>\n',
            '  <button id="basics-help">Close the help</button>\n',
            '  <button id="basics-reset">Reset the example</button>\n\n',
            '  <rv-require name="help" src="views/help" class="rv-require-loaded" loaded="true">\n',
            '    <div class="help">\n',
            '      <h4>HELP</h4>\n',
            '      <p>Help content</p>\n',
            '    </div>\n',
            '  </rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 3,
            top: 327,
            left: 167,
            html: [
              'The element assets and HTML are loaded<br />then the "help" controller is called.'
            ].join('')
          }, {
            number: 4,
            top: 492,
            left: 204,
            html: [
              'When the "help" controller is called,<br />it create its Ractive element.'
            ].join('')
          }, {
            number: 5,
            top: 120,
            left: 184,
            html: [
              'Click to call the .teardown() method and<br />destroy your Ractive element.'
            ].join('')
          }]
        },

        teardowned: {
          html: [
            '<head>\n',
            '  <link rel="stylesheet" href="views/help.css">\n',
            '  <script type="text/javascript" src="views/help.js"></script>\n',
            '</head>\n',
            '<body>\n',
            '  <h4>Here is a page</h4>\n',
            '  <button id="basics-help">Open the help</button>\n',
            '  <button id="basics-reset">Reset the example</button>\n\n',
            '  <rv-require name="help" src="views/help"></rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 6,
            top: 327,
            left: 167,
            html: [
              'The element assets and HTML are kept in memory.'
            ].join('')
          }, {
            number: 7,
            top: 490,
            left: 28,
            html: [
              'The content is deleted and the tag reseted.'
            ].join('')
          }, {
            number: 8,
            top: 120,
            left: 184,
            html: [
              'You can retry the process any times you want.'
            ].join('')
          }]
        }
      };

  _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.initial);

  $('#basics-reset').click(function() {
    var opened = $('#basics-help').data('opened') || false;

    if (opened) {
      BasicsPage.childrenRequire[0].teardown();
      $('#basics-help').html('Open the help');
      $('#basics-help').data('opened', false);
    }

    _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.initial);
  });

  $('#basics-help').click(function() {
    var opened = $('#basics-help').data('opened') || false;

    opened = !opened;

    $('#basics-help')
      .data('opened', opened)
      .html(opened ? 'Close the help' : 'Open the help');

    if (opened) {
      BasicsPage.require().then(function() {
        _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.opened);
      });
    }
    else {
      BasicsPage.childrenRequire[0].teardown();
      _updateExampleDOM($basicsPageDOM, basicsDOMTemplates.teardowned);
    }
  });

  // Example Partials

  var PartialsPage = new window.Ractive({
        el: 'partials-page',
        template: $('#partials-page').html()
      }),
      $partialsPageDOM = $('#example-partials .example-dom'),
      partialsDOMTemplates = {
        initial: {
          html: [
            '<head>\n',
            '  ...\n',
            '</head>\n',
            '<body>\n',
            '  <h4>Here is a page</h4>\n',
            '  <button id="partials-help">Open the help</button>\n',
            '  <button id="partials-reset">Reset the example</button>\n\n',
            '  <rv-require name="help" src="views/help">\n',
            '    <rv-partial target="title">\n',
            '      - Partials\n',
            '    </rv-partial>\n',
            '    <rv-partial target="content">\n',
            '      <strong>My awesome content</strong>\n',
            '    </rv-partial>\n',
            '  </rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 1,
            top: 468,
            left: 278,
            html: [
              'You can use rv-partial tags to include<br />contents in specific parts of the element required.'
            ].join('')
          }, {
            number: 2,
            top: 120,
            left: 184,
            html: [
              'Click to call the .require() method and<br />load all the rv-require elements<br />with its partials.'
            ].join('')
          }]
        },

        opened: {
          html: [
            '<head>\n',
            '  <link rel="stylesheet" href="views/help.css">\n',
            '  <script type="text/javascript" src="views/help.js"></script>\n',
            '</head>\n',
            '<body>\n',
            '  <h4>Here is a page</h4>\n',
            '  <button id="partials-help">Close the help</button>\n',
            '  <button id="partials-reset">Reset the example</button>\n\n',
            '  <rv-require name="help" src="views/help" class="rv-require-loaded" loaded="true">\n',
            '    <div class="help">\n',
            '      <h4>HELP - Partials</h4>\n',
            '      <p>\n',
            '        Help content:<br>\n',
            '        <strong>My awesome content</strong>\n',
            '      </p>\n',
            '    </div>\n',
            '  </rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 3,
            top: 492,
            left: 204,
            html: [
              'The partials are included in the element.'
            ].join('')
          }, {
            number: 4,
            top: 120,
            left: 184,
            html: [
              'Click to call the .teardown() method and<br />destroy your Ractive element.'
            ].join('')
          }]
        },

        teardowned: {
          html: [
            '<head>\n',
            '  <link rel="stylesheet" href="views/help.css">\n',
            '  <script type="text/javascript" src="views/help.js"></script>\n',
            '</head>\n',
            '<body>\n',
            '  <h4>Here is a page</h4>\n',
            '  <button id="partials-help">Open the help</button>\n',
            '  <button id="partials-reset">Reset the example</button>\n\n',
            '  <rv-require name="help" src="views/help">\n',
            '    <rv-partial target="title">\n',
            '      - Partials\n',
            '    </rv-partial>\n',
            '    <rv-partial target="content">\n',
            '      <strong>My awesome content</strong>\n',
            '    </rv-partial>\n',
            '  </rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 5,
            top: 492,
            left: 278,
            html: [
              'The rv-partial tags are restored.'
            ].join('')
          }, {
            number: 6,
            top: 120,
            left: 184,
            html: [
              'You can retry the process any times you want.'
            ].join('')
          }]
        }
      };

  _updateExampleDOM($partialsPageDOM, partialsDOMTemplates.initial);

  $('#partials-reset').click(function() {
    var opened = $('#partials-help').data('opened') || false;

    if (opened) {
      PartialsPage.childrenRequire[0].teardown();
      $('#partials-help').html('Open the help');
      $('#partials-help').data('opened', false);
    }

    _updateExampleDOM($partialsPageDOM, partialsDOMTemplates.initial);
  });

  $('#partials-help').click(function() {
    var opened = $('#partials-help').data('opened') || false;

    opened = !opened;

    $('#partials-help')
      .data('opened', opened)
      .html(opened ? 'Close the help' : 'Open the help');

    if (opened) {
      PartialsPage.require().then(function() {
        _updateExampleDOM($partialsPageDOM, partialsDOMTemplates.opened);
      });
    }
    else {
      PartialsPage.childrenRequire[0].teardown();
      _updateExampleDOM($partialsPageDOM, partialsDOMTemplates.teardowned);
    }
  });

  // Example Databinding

  var DatabindingPage = new window.Ractive({
        el: 'databinding-page',
        template: $('#databinding-page').html(),
        data: {
          title: 'Your title'
        }
      }),
      $databindingPageDOM = $('#example-databinding .example-dom'),
      databindingDOMTemplates = {
        initial: {
          html: [
            '<head>\n',
            '  ...\n',
            '</head>\n',
            '<body>\n',
            '  <h4>{{title}}</h4>\n',
            '  <button id="databinding-edit">Edit the title</button>\n',
            '  <button id="databinding-reset">Reset the example</button>\n\n',
            '    <rv-require\n',
            '      name="edition"\n',
            '      src="views/edition"\n\n',
            '      data-drink="beer"\n',
            '      data-bind-edittext="title"\n',
            '    ></rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 1,
            top: 538,
            left: 211,
            html: [
              'Use data-* to pass a direct value to<br />the required view.'
            ].join('')
          }, {
            number: 2,
            top: 563,
            left: 285,
            html: [
              'Use data-bind-* to link<br />a data property to a<br />required view data property<br />(double databinding).'
            ].join('')
          }, {
            number: 3,
            top: 120,
            left: 184,
            html: [
              'Click to call the .require() method and<br />load all the rv-require elements.'
            ].join('')
          }]
        },

        opened: {
          html: [
            '<head>\n',
            '  <link rel="stylesheet" href="views/edition.css">\n',
            '  <script type="text/javascript" src="views/edition.js"></script>\n',
            '</head>\n',
            '<body>\n',
            '  <h4>{{title}}</h4>\n',
            '  <button id="databinding-edit">Close the edition</button>\n',
            '  <button id="databinding-reset">Reset the example</button>\n\n',
            '    <rv-require\n',
            '      name="edition"\n',
            '      src="views/edition"\n\n',
            '      data-drink="beer"\n',
            '      data-bind-edittext="title"\n\n',
            '      loaded="true"\n',
            '      class="rv-require-loaded""\n',
            '    >\n',
            '      <div class="edition">\n',
            '        <h4>Edit the title</h4>\n',
            '        <p class="info">(and drink a {{drink}})</p>\n\n',
            '        <input type="text" value="{{edittext}}">\n',
            '       </div>\n',
            '    </rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 4,
            top: 97,
            left: 454,
            html: [
              'The "drink" variable is directly passed from the "data-drink" attribute.'
            ].join('')
          }, {
            number: 5,
            top: 192,
            left: 337,
            html: [
              'The "edittext" variable is linked<br />with the parent "title" variable.'
            ].join('')
          }, {
            number: 6,
            top: 88,
            left: 14,
            html: [
              'The title is updated from the child\'s input element.'
            ].join('')
          }, {
            number: 7,
            top: 120,
            left: 204,
            html: [
              'Click to call the .teardown() method and<br />destroy your Ractive element.'
            ].join('')
          }]
        },

        teardowned: {
          html: [
            '<head>\n',
            '  <link rel="stylesheet" href="views/edition.css">\n',
            '  <script type="text/javascript" src="views/edition.js"></script>\n',
            '</head>\n',
            '<body>\n',
            '  <h4>{{title}}</h4>\n',
            '  <button id="databinding-edit">Edit the title</button>\n',
            '  <button id="databinding-reset">Reset the example</button>\n\n',
            '    <rv-require\n',
            '      name="edition"\n',
            '      src="views/edition"\n\n',
            '      data-drink="beer"\n',
            '      data-bind-edittext="title"\n',
            '    ></rv-require>\n\n',
            '</body>'
          ].join(''),
          comments: [{
            number: 8,
            top: 88,
            left: 14,
            html: [
              'The title keeps its value although its variable<br />"title" isn\'t linked anymore with the teardowned child.'
            ].join('')
          }, {
            number: 9,
            top: 120,
            left: 184,
            html: [
              'You can retry the process any times you want.'
            ].join('')
          }]
        }
      };

  _updateExampleDOM($databindingPageDOM, databindingDOMTemplates.initial);

  $('#databinding-reset').click(function() {
    var opened = $('#databinding-edit').data('opened') || false;

    if (opened) {
      DatabindingPage.childrenRequire[0].teardown();
      $('#databinding-edit').html('Edit the title');
      $('#databinding-edit').data('opened', false);
    }

    _updateExampleDOM($databindingPageDOM, databindingDOMTemplates.initial);
  });

  $('#databinding-edit').click(function() {
    var opened = $('#databinding-edit').data('opened') || false;

    opened = !opened;

    $('#databinding-edit')
      .data('opened', opened)
      .html(opened ? 'Close the edition' : 'Edit the title');

    if (opened) {
      DatabindingPage.require().then(function() {
        _updateExampleDOM($databindingPageDOM, databindingDOMTemplates.opened);
      });
    }
    else {
      DatabindingPage.childrenRequire[0].teardown();
      _updateExampleDOM($databindingPageDOM, databindingDOMTemplates.teardowned);
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
