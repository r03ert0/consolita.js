# Consolita.js

A tiny, simple Web console for running javascript code.

# Usage

This will turn the `div` element with `id="editor"` into a consolita!

```
<!DOCTYPE html>
<html>
  <style>
    .token.message {
      color: red;
    }
  </style>

  <div id="editor"></div>

  <script src="https://unpkg.com/codeflask/build/codeflask.min.js"></script>
  <script src="./consolita.js"></script>
  <script>
    Consolita.init("#editor");
  </script>
</html>
```

# References

The following web pages were of use and inspiration during the writting of consolita:

1. https://krasimirtsonev.com/blog/article/build-your-own-interactive-javascript-playground
2. https://medium.com/javascript-in-plain-english/lets-extend-console-log-8641bda035c3
3. https://github.com/kazzkiq/CodeFlask
4. https://prismjs.com/extending.html#language-definitions
5. https://github.com/PrismJS/prism/blob/master/components/prism-python.js
6. https://github.com/JamesHuangUC/JS-Playground
7. https://jsconsole.com/
8. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
