(function () {
  var options = INSTALL_OPTIONS
  var Node = window.Node
  var ineligibleTags = [
    'a',
    'script',
    'br',
    'col',
    'command',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    'video',
    'iframe'
  ]

  var autolinker = new window.Autolinker({
    urls: {
      schemeMatches: true,
      wwwMatches: true,
      tldMatches: true
    },
    email: options.email,
    phone: options.phone,
    mention: options.mention === 'none' ? false : options.mention,
    hashtag: options.hashtag === 'none' ? false : options.hashtag,
    stripPrefix: options.stripPrefix,
    newWindow: options.newWindow,
    truncate: {
      length: 0,
      location: 'end'
    },
    stripTrailingSlash: false,
    className: ''
  })

  function parse (node) {
    if (node.nodeType === Node.ELEMENT_NODE && ineligibleTags.indexOf(node.tagName.toLowerCase()) !== -1) {
      return
    }

    for (var i = 0; i < node.childNodes.length; i++) {
      parse(node.childNodes[i])
    }

    if (node.nodeType === Node.TEXT_NODE) {
      var serializer = document.createElement('div')
      var fragment = document.createDocumentFragment()

      serializer.innerHTML = autolinker.link(node.textContent)

      var serialChild
      while (serialChild = serializer.firstChild) { // eslint-disable-line no-cond-assign
        fragment.appendChild(serialChild)
      }

      node.parentNode.replaceChild(fragment, node)
    }
  }
  function bootstrap () {
    var parentNode

    try {
      parentNode = document.querySelector(options.advanced.location)
    } catch (e) {
      parentNode = document.body
    }

    parse(parentNode)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
  } else {
    bootstrap()
  }
}())
