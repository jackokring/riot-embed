# riot-embed

Looking at *riot.js* as a useful web technology, I decided to investigate the option to embed it within *wordpress* using a header and footer scripts plugin. Adding some script tags to the footer (my Google Analytics tags went in the header), allows both *less.js* and *riot.js* to work within all page and post bodies. This might be useful to improve the basic wordpress theme, and even of use in the more expressive Divi theme. Just include the `<my-custom>` tags and the `<script type="riot/tag" src="somewhere.on.github/my-custom.tag">` tags for the things you want to use, on the pages you want to use them on.

```
<script>
function __loading(script) {
  var site = 'https://rawgit.com/jackokring/riot-embed/master/';
  var s = document.createElement("script");
  s.src = site + script;
  var s0 = document.getElementsByTagName('script')[0];
  s0.parentNode.insertBefore(s, s0);
}
__loading('less.min.js');
__loading('riot%2Bcompiler.min.js');
__loading('underscore.min.js');
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

I'm building in compression to check out some new ideas on data backends. I decided to not go for *jQuery* (even though wordpress does include it in pages) as it's basically tart over function, where as *underscore.js* is quite functional, and reduces code size. It might not be the most efficient time execution wise, but it often has a time writing wise, and a definite space reduction in the long run. Some people prefer *lodash.js*, but it's almost the same, except the utility of `_.reduce(y, function() { (var z = _(x)).filter(...) ...}, []);` to save bytes (?), has been mangled for chaining calls. 

The aim is to make the client the data processing centre, and to only load the server with essentials (such as sanity checking of database consistency). This is encouraged by moving to an ajax script model, where the server issues scripts, and not just static json. The fat clients (thin clients plus Moore's Law) which are coming won't have a problem with this arrangement, and the observation that processing is quite cheap compared to transmission in mass service paradigms makes this a good look see.

#QUnit Testing

I have made QUnit testing be available. To assist in stability the dependant js libraries have been copied to this repository. This can be located [here](https://rawgit.com/jackokring/riot-embed/master/tests.html "QUnit Testing") for the whole project. The tests of the server side use [K Ring Technologies Ltd.](https://www.kring.co.uk "Enquire") so don't run the tests without reason (they can generate server traffic), as they have been run already in development.

When you want to start developing your own tags, and you have no access to your *wordpress* server's file space except for the *worpress* administration interface, you have few options. The `dbase.php` file has to be placed in your wordpress install folder to access server side features. This could eventually be done via a *wordpress* plugin, but that is for later. As placing this file is a one off task, just ask an admin for help.

The client side JavaScript can be hosted on *GitHub*. It has a very nice code editor, and the site is easy to use without much of the hastle of command line tools. The suggest process is to join *GitHub* and clone this repository. You can then add more scripts or tags, and then also submit pull requests when you get to know how. *rawgit.com* can then serve files while in development, as the RAW option for viewing files using *github.com* will not work correctly. If your web traffic goes up to high levels, this service is not suitable. If you get to this point it then becomes possible to clone the git repository and 
