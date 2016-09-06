# riot-embed

Looking at riot.js as a useful web technology, I decided to investigate the option to embed it within wordpress using the header and footer scripts plugin. Adding some script tags to the footer, allows both less.js and riot.js to work within the page and post bodies. This might be useful to improve the basic wordpress theme, and even of use in the more expressive Divi theme.

```
<script type="riot/tag" src="https://raw.githubusercontent.com/riot/examples/gh-pages/if-else-elseif/if.tag"></script>
<script src="https://raw.githubusercontent.com/less/less.js/master/dist/less.min.js"></script>
<script src="https://raw.githubusercontent.com/riot/riot/master/riot%2Bcompiler.min.js"></script>
  <!-- mount this app -->
  <script>
    riot.parsers.css.less = function(tagName, style) {
      var css = ''
      less.render(style, {}, function(error, output) {
        css = output.css
      })
      return css
    }
    riot.mount('*')
  </script>
```
