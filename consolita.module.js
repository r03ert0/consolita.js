/*
  Consolita.js
  Roberto Toro, April 2020

  Command-K will erase the console
  Arrow up and down navigate the console's history
*/

import CodeFlask from "https://unpkg.com/codeflask/build/codeflask.module.js"

let flask;
let res = "";
const history = [];
let historyCursor = 0;

/*
THIS VERSION DOES NOT WORK!!!
The problem is that a variable declared in one line, is not declared in the next one.
This fails in this version of the code:
    eval("var a=1");
    eval("console.log(a)");
It's also not possible to define a variable without using var, let or const.
This fails:
    eval("a=1");
*/

console.oldLog = console.log;
console.newLog = function() {
  const args = Array.from(arguments);
  for(let i=0;i<args.length;i++) {
    const arg = args[i];
    res += " " + arg;
    if(i<args.length-1) {
      res += " ";
    } else {
      res += "\n";
    }
  }
};

var displayHistory = function (dir) {
  const code = flask.getCode();
  const lines = code.split("\n");
  lines.pop();

  switch(dir) {
    case 'up':
      historyCursor = Math.max(historyCursor - 1, 0);
      lines.push(history[historyCursor]);
      flask.updateCode(lines.join("\n"));
      break;
    case 'down':
      historyCursor = Math.min(historyCursor + 1, history.length);
      if(historyCursor === history.length) {
        flask.updateCode(lines.join("\n") + "\n");
      } else {
        lines.push(history[historyCursor]);
        flask.updateCode(lines.join("\n"));
      }
      break;
  }
}

var getResult = function (lastLine) {
  res = "";
  let outputCode = "";
  let inputCode = lastLine;
  console.log = console.newLog;
  try {
    outputCode = eval(inputCode);
    if (outputCode !== undefined) {
      res += "> " + outputCode + "\n";
    } else {
      if (outputCode === "") {
        res += "> undefined" + "\n";
      }
    }
  } catch (ex) {
    ex = '# ' + ex; // display errors as "messages"
    console.log(ex);
  }
  console.log = console.oldLog;
  flask.updateCode(flask.getCode() + res);
}

export default function (sel) {
  // extend default javascript to include messages
  flask = new CodeFlask(sel, { language: 'js_messages'});
  flask.addLanguage('js_messages', Prism.languages.extend('javascript', {
    'message': {
      pattern: /(^|[^\\])#.*/,
      lookbehind: true
    }
  }));
  const textarea = document.querySelector("#editor textarea");

  flask.originalHandleNewLineIndentation = flask.handleNewLineIndentation;
  flask.handleNewLineIndentation = (e) => {
    if(e.keyCode === 13) {
      // prevent new line in the middle of a line
      textarea.selectionStart = textarea.textLength;

      // perform default new line handler
      flask.originalHandleNewLineIndentation(e);

      // execute last command
      const lines = flask.getCode().split("\n");
      const lastLine = lines[lines.length-2];
      getResult(lastLine);

      // add command to history
      history.push(lastLine);
      historyCursor = Math.max(0, history.length);

      // scroll to the bottom of the command window
      textarea.scrollTop = textarea.scrollHeight;
    }
  }

  textarea.addEventListener('keydown', (e) => {
    // console.oldLog(e);
    switch(e.code) {
      case 'ArrowUp':
        e.preventDefault();
        displayHistory('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        displayHistory('down');
        break;
      case 'KeyK':
        if(e.metaKey) {
          flask.updateCode("");
        }
        break;
    }
  });
}

/*
    References
    1. https://krasimirtsonev.com/blog/article/build-your-own-interactive-javascript-playground
    2. https://medium.com/javascript-in-plain-english/lets-extend-console-log-8641bda035c3
    3. https://github.com/kazzkiq/CodeFlask
    4. https://prismjs.com/extending.html#language-definitions
    5. https://github.com/PrismJS/prism/blob/master/components/prism-python.js
    6. https://github.com/JamesHuangUC/JS-Playground
    7. https://jsconsole.com/
    8. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
*/