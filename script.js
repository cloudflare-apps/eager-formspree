(function(){
  if (!window.addEventListener || !document.documentElement.setAttribute || !document.querySelector) {
    return
  }

  var options, isPreview, style, form, render, el, updateStyle, updateForm;

  options = INSTALL_OPTIONS;

  isPreview = INSTALL_ID === 'preview';

  style = document.createElement('style');
  document.head.appendChild(style);

  updateStyle = function(){
    style.innerHTML = (
    ' html .eager-formspree button {' +
    '   background: ' + options.color + ' !important' +
    ' }' +
    ' html .eager-formspree input:focus, .eager-formspree textarea:focus {' +
    '   box-shadow: 0 0 0 .0625em ' + options.color + ', 0 0 .1875em .0625em ' + options.color + ' !important' +
    ' }'
    );
  };

  form = document.createElement('form');
  form.addEventListener('touchstart', function(){}, false); // iOS :hover CSS hack

  updateForm = function(){
    form.className = 'eager-formspree' + (options.darkTheme ? ' eager-formspree-dark-theme' : '');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '//formspree.io/' + options.email);
    form.innerHTML = (
      (options.headerText ? '<div class="eager-formspree-header-text">' + options.headerText + '</div>' : '') +
      (options.bodyText ? '<div class="eager-formspree-body-text">' + options.bodyText + '</div>' : '') +
      (options.fields.name ? '<input type="text" name="name" spellcheck="false" placeholder="' + (options.fields.namePlaceholderText || '') + '" required>' : '') +
      (options.fields.email ? '<input type="email" name="_replyto" spellcheck="false" placeholder="' + (options.fields.emailPlaceholderText || '') + '" required>' : '') +
      (options.fields.message ? '<textarea name="message" rows="5" spellcheck="false" placeholder="' + (options.fields.messagePlaceholderText || '') + '" required></textarea>' : '') +
      '<input type="text" name="_gotcha" style="display: none">' +
      '<button type="submit">' + (options.buttonText || '') + '</button>'
    );
  };

  form.addEventListener('submit', function(event){
    event.preventDefault();

    var button, url, xhr, callback, params;

    if (isPreview) {
      form.innerHTML = '<div class="eager-formspree-body-text">Form submissions are simulated during the Eager preview. Reload the preview to see the form again.</div>';
      return;
    }

    button = form.querySelector('button[type="submit"]');
    url = form.action;
    xhr = new XMLHttpRequest();

    callback = function() {
      var jsonResponse = {};

      button.removeAttribute('disabled');

      if (xhr && xhr.status === 200) {
        if (xhr.response) {
          try {
            jsonResponse = JSON.parse(xhr.response);
          } catch (err) {}
        }
        if (jsonResponse && jsonResponse.success === 'confirmation email sent') {
          form.innerHTML = '<div class="eager-formspree-header-text">Success!</div><div class="eager-formspree-body-text">Formspree has sent an email to ' + options.email + ' for verification.</div>';
        } else {
          form.innerHTML = '<div class="eager-formspree-body-text">' + options.successText + '</div>';
        }
      }
    };

    params = [];
    if (options.fields.name) {
      params.push('name=' + encodeURIComponent(form.querySelector('input[name="name"]').value));
    }
    if (options.fields.email) {
      params.push('email=' + encodeURIComponent(form.querySelector('input[type="email"]').value));
    }
    if (options.fields.message) {
      params.push('message=' + encodeURIComponent(form.querySelector('textarea[name="message"]').value));
    }

    if (!url) {
      return;
    }

    button.setAttribute('disabled', 'disabled');
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = callback;
    xhr.send(params.join('&'));
  });

  render = function(){
    el = Eager.createElement(options.container, el);
    el.appendChild(form);

    updateStyle();
    updateForm();
  };

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', render);
  else
    render();

  INSTALL_SCOPE = {
    setOptions: function(opts){
      options = opts;

      render();
    }
  };

})();
