(() => {
  const package = require('./package.json');
  const electron = require('electron');
  const ipc = electron.ipcRenderer;
  const shell = electron.shell;
  const escapeHTML = require('escape-html');

  window.onload = function() {
    document.body.classList.add(process.platform);
  }

  window.parse = function(buff) {
    if (buff instanceof Buffer) {
      for (var i = 0; i < buff.length; i++) {
        var char = buff[i];
        
        switch (char) {
          case 12:
            buff = "";
            break;
        }
      }
    }

    buff = escapeHTML(buff.toString()).split('\n');

    return buff.join('<br>');
  }

  window.escape = function(str) {
    var urlRegex = /(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*/g;

    str = str.replace(urlRegex, function (url) {
      return '<a onclick="openExternal(\'' + url + '\'); return false;" href="">' + url + '</a>';
    });

    return str;
  }

  window.openExternal = shell.openExternal;

  function init() {
    process.versions.app = package.version;

    ipc.on('blur', function() {
      document.body.classList.add('blur');
    });

    ipc.on('focus', function() {
      document.body.classList.remove('blur');
    });
  }

  init();
})();