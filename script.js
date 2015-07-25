var opts = INSTALL_OPTIONS
var form = '<form id="formspree-eager" method="POST" action="//formspree.io/' + opts.email + '">'
   + (opts.elements.name ? '<input type="text" name="name" placeholder="Your name" required>' : '')
   + (opts.elements.email ? '<input type="email" name="_replyto" placeholder="Your email" required>' : '')
   + (opts.elements.message ? '<textarea name="message" rows="5" placeholder="Your message" required></textarea>' : '')
   + '<input type="text" name="_gotcha" style="display:none">'
   + '<button type="submit">Send</button>'
+'</form>'
var formnode = document.createElement('div')
formnode.innerHTML = form

var node = document.querySelector(opts.container.selector)

var handlers = {
  'before': function (node) {
    node.parentNode.insertBefore(formnode, node)
  },
  'prepend': function (node) {
    if (node.firstChild) {
      node.insertBefore(formnode, node.firstChild)
    } else { this.append(node) }
  },
  'append': function (node) {
    node.appendChild(formnode)
  },
  'after': function (node) {
    if (node.nextSibling) {
      node.parentNode.insertBefore(formnode, node.nextSibling)
    } else { this.append(node) }
  },
  'replace': function (node) {
    node.innerHTML = form
  },
}

var handle = handlers[opts.container.method]
handle(node)
