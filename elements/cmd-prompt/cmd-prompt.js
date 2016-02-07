var path = require('path');
var pty = null;

(() => {
  Polymer({
    is: 'cmd-prompt',

    _onExecute(evt) {
      if (evt.keyCode !== 13)
        return;

      if (!pty) {
        pty = require('ptyw.js');
      }

      var term = pty.fork(this.cmdPath, ['/s', '/c', this.$.input.value], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: this.homePath,
        env: process.env
      });

      term.on('data', (data) => {
        document.querySelector('cmd-content').$.content.innerHTML += data.toString();
      });

      this.$.input.value = '';
    },

    get cmdPath() {
      return process.platform === 'win32' ? process.env.COMSPEC || path.join(process.env.SystemRoot, 'System32', 'cmd.exe') || 'cmd.exe' : process.env.SHELL || 'bash';
    },

    get homePath() {
      return process.env.HOME || process.env.USERPROFILE;
    }
  });
})();
