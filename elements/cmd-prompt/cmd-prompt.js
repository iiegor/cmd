(() => {
  Polymer({
    is: 'cmd-prompt',

    _onExecute(evt) {
      if (evt.keyCode !== 13)
        return;

      console.log('execute')
    }
  });
})();
