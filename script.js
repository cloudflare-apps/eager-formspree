(function(){
  if (!window.addEventListener || !document.documentElement.setAttribute || !document.querySelector) {
    return
  }

  var options, isPreview, style, form;

  options = INSTALL_OPTIONS;

  if (!options.email) {
    return;
  }

  isPreview = window.Eager && window.Eager.installs && window.Eager.installs.preview && window.Eager.installs.preview.appId === 'EBgHgduLB0Zn';

  style = document.createElement('style');
  style.innerHTML = (
  ' html .eager-formspree button {' +
  '   background: ' + options.color + ' !important' +
  ' }' +
  ' html .eager-formspree input:focus, .eager-formspree textarea:focus {' +
  '   box-shadow: 0 0 0 .0625em ' + options.color + ', 0 0 .1875em .0625em ' + options.color + ' !important' +
  ' }'
  );

  form = form = document.createElement('form');
  form.addEventListener('touchstart', function(){}, false); // iOS :hover CSS hack
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
    '<button type="submit">Submit</button>'
  );

  form.addEventListener('submit', function(event){
    event.preventDefault();

    var button, url, xhr, callback, params;

    button = form.querySelector('button[type="submit"]');
    url = form.action;
    xhr = new XMLHttpRequest();

    if (isPreview) {
      form.innerHTML = '<div class="eager-formspree-body-text">Form submissions are simulated during the Eager preview.</div>';
      return;
    }

    callback = function(xhr) {
      var jsonResponse = {};

      button.removeAttribute('disabled');

      if (xhr && xhr.target && xhr.target.status === 200) {
        if (xhr.target.response) {
          try {
            jsonResponse = JSON.parse(xhr.target.response);
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
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = callback.bind(xhr);
    xhr.send(params.join('&'));
  });

  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(style);

    var location = Eager.createElement(options.container);
    location.appendChild(form);
  });
})();
