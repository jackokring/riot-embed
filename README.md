# riot-embed

Looking at riot.js as a useful web technology, I decided to investigate the option to embed it within wordpress using the header and footer scripts plugin. Adding some script tags to the footer, allows both less.js and riot.js to work within the page and post bodies. This might be useful to improve the basic wordpress theme, and even of use in the more expressive Divi theme.

```
<script type="riot/tag" src="https://rawgit.com/riot/examples/gh-pages/if-else-elseif/if.tag"></script>
<script src="https://rawgit.com/less/less.js/master/dist/less.min.js"></script>
<script src="https://rawgit.com/riot/riot/master/riot%2Bcompiler.min.js"></script>
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

In order to support AJAX and a DB, a method of site specific access control is required. As the server receives the full URL request, then this could be used as a part key, along with an optional script embedded part key, to control access. But this would have the unfortunate hack of just requesting using the correct domain, from another domain. It has to be login specific to protect private data.

An end point token can be issued as a cookie, and activated using a password, generating a endpoint user token. Pay subscribed or higher qualification of the user tokens can be issued for higher features. A username can be added to allow end point user transfers.

#Compression

I'm building in compression to check out some new ideas on data backends. I decided to not go for jQuery as it's basically tart over function, where as underscore.js is quite functional, and reduces code size. It might not be the most efficient time execution wise, but it often has a time writing wise, and a definite space reduction in the long run.

The aim is to make the client the data processing centre, and to only load the server with essentials (such as sanity checking). This is encouraged by moving to a ajax script model, where the server issues scripts, and not static json. The fat clients which are comming won't have a problem with this arrangement, and the observation that processing is quite cheap compared to transmission is mass service paradigms makes this a good look see.
