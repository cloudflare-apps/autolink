;(function(){
  if (!window.Autolinker) {
    console.error('Autolinker.js is required for AutoLink to work');
  }

  maxLinksPerNode = 9999;
  doNotTraverseTheseElements = ['script', 'br', 'col', 'command', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'video', 'iframe'];

  var AutoLink = {
    init: function(selector) {
      var node;

      try {
        node = document.querySelector('');
      } catch (e) {
        node = document.body;
      }

      AutoLink.process(node);
    },
    process: function(node) {
      if (node.nodeType === 3) {
        console.log('node', node.textContent);

        var text = node.textContent;
        var linkedText = Autolinker.link(text);

        if (linkedText !== text) {
          var fragment = document.createDocumentFragment();
          var dummyElement = document.createElement('div');

          dummyElement.innerHTML = linkedText;

          var loops = 0;
          while (dummyElement.childNodes.length) {
            loops += 1;
            if (loops > maxLinksPerNode) {
              break;
            }

            try {
              fragment.appendChild(dummyElement.childNodes[0]);
            } catch (e) {}
          }

          node.parentNode.replaceChild(fragment, node);
        }
      } else {
        for (var i = 0; i < node.childNodes.length; i++) {
          var child = node.childNodes[i];

          if (!child.tagName || doNotTraverseTheseElements.indexOf(child.tagName.toLowerCase()) === -1) {
            AutoLink.process(child);
          }
        }
      }
    }
  };

  window.AutoLink = AutoLink;
})();
