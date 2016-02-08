var path = require('path');
var pty = null;
var child_process = require('child_process');

(() => {
  Polymer({
    is: 'cmd-prompt',

    properties: {
      status: {
        type: String,
        value: 'success',
        observer: '_statusChanged'
      }
    },

    ready() {
      if (this.disabled) {
        this.$.input.classList.add('disabled');
      } else {
        setTimeout(() => this.$.input.focus(), 0);
      }
    },

    _onExecute(evt) {
      if (evt.keyCode !== 13) {
        this._handleKey(evt.keyCode);
        return;
      } else if (this.$.input.value.length < 1) {
        return;
      }

      /*if (!pty) {
        pty = require('ptyw.js');
      }*/

      const args = ['/s', '/c', '"' + this.$.input.value + '"'];

      /*const term = pty.spawn(this.cmdPath, args, {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: this.homePath,
        env: process.env
      });*/

      const term = child_process.spawn(this.cmdPath, args, {
        cwd: process.cwd,
        env: process.env,
        windowsVerbatimArguments: true
      });

      // Empty prompt input
      this.$.input.value = '';

      term.stdout.on('data', this._handleOutput.bind(this));
      term.stderr.on('data', this._handleError.bind(this));

      term.on('close', this._handleClose.bind(this));
    },

    _handleOutput(data) {
      document.querySelector('cmd-content').appendOutput(window.escape(window.parse(data)));
    },

    _handleError(data) {
      console.log('error', data.toString('utf8'));
    },

    _handleClose(code) {
      console.debug('Command closed with', code);

      this.status = code === 1 ? 'error' : 'success';
    },

    _statusChanged(newValue, oldValue) {
      var el = this.$['status-icon'];

      if (newValue === 'success') {
        el.classList.remove('error');
      } else {
        el.classList.add('error');
      }
    },

    _handleKey(code) {
      switch (code) {
        case 38:
          console.log('History back');
          break;
        case 40:
          console.log('History forward');
          break;
      }
    },

    get cmdPath() {
      return process.platform === 'win32' ? process.env.COMSPEC || path.join(process.env.SystemRoot, 'System32', 'cmd.exe') || 'cmd.exe' : process.env.SHELL || 'bash';
    },

    get homePath() {
      return process.env.HOME || process.env.USERPROFILE;
    }
  });
})();
