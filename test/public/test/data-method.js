(function(){

module('data-method', {
  setup: function() {
    $('#qunit-fixture').append($('<a />', {
      href: '/echo', 'data-method': 'delete', text: 'destroy!'
    }));
  },
  teardown: function() {
    $(document).off('iframe:loaded');
  }
});

function submit(fn, options) {
  $(document).on('iframe:loaded', function(e, data) {
    fn(data);
    start();
  });

  $('#qunit-fixture').find('a')
    .trigger('click');
}

asyncTest('link with "data-method" set to "delete"', 3, function() {
  submit(function(data) {
    equal(data.REQUEST_METHOD, 'DELETE');
    strictEqual(data.params.authenticity_token, undefined);
    strictEqual(data.HTTP_X_CSRF_TOKEN, undefined);
  });
});

asyncTest('do not interact with contenteditable elements', 0, function() {
  $('#qunit-fixture')
    .replaceWith(`
      <div id="qunit-fixture">
        <div contenteditable>
          <a href="/echo" data-method="delete">link</a>
        </div>
      </div>`
    )
  
  $(document).on('iframe:loaded', function(e, data) {
    ok(false, 'Should not trigger a request because of contenteditable parent')
  });

  $('#qunit-fixture').find('a').trigger('click');

  setTimeout(function(){ start(); }, 50);
})

asyncTest('link with "data-method" and CSRF', 1, function() {
  $('#qunit-fixture')
    .append('<meta name="csrf-param" content="authenticity_token"/>')
    .append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae"/>');

  submit(function(data) {
    equal(data.params.authenticity_token, 'cf50faa3fe97702ca1ae');
  });
});

asyncTest('link "target" should be carried over to generated form', 1, function() {
  $('a[data-method]').attr('target', 'super-special-frame');
  submit(function(data) {
    equal(data.params._target, 'super-special-frame');
  });
});

asyncTest('link with "data-method" and cross origin', 1, function() {
  var data = {};

  $('#qunit-fixture')
    .append('<meta name="csrf-param" content="authenticity_token"/>')
    .append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae"/>');

  $(document).on('submit', 'form', function(e) {
    $(e.currentTarget).serializeArray().map(function(item) {
      data[item.name] = item.value;
    });

    return false;
  });

  var link = $('#qunit-fixture').find('a');

  link.attr('href', 'http://www.alfajango.com');

  link.trigger('click');

  start();

  notEqual(data.authenticity_token, 'cf50faa3fe97702ca1ae');
});

})();
