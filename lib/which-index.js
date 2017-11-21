'use babel';

import { CompositeDisposable, TextEditor } from 'atom';

export default {
  subscriptions: null,

  activate() {
    const delayedGetAndRelabelTabs = () => {
      setTimeout(() => { this.getAndRelabelTabs(); }, 1);
    };

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.workspace.observePanes((pane) => {
      // Only need to listen to text editor panes
      if (!pane.activeItem instanceof TextEditor) return;

      // Atom renames tab titles when two open files have the same name
      this.subscriptions.add(pane.onDidAddItem(delayedGetAndRelabelTabs));
      this.subscriptions.add(pane.onDidMoveItem(delayedGetAndRelabelTabs));
      this.subscriptions.add(pane.onDidRemoveItem(delayedGetAndRelabelTabs));
    }));

    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      // Handles changes to the filesystem (i.e. new file is saved, file is moved, etc.)
      this.subscriptions.add(editor.onDidChangePath(delayedGetAndRelabelTabs));
    }));

    delayedGetAndRelabelTabs();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  getAndRelabelTabs() {
    // Ignore temporary and system tabs (like settings) that won't have a data-name
    document.querySelectorAll('.tab-bar li.tab .title[data-name]').forEach((tab) => {
      const path = tab.getAttribute('data-path');
      const nextTitle = this.relabel(path);

      // Only set next title if changed
      if (nextTitle) tab.innerText = nextTitle;
    });
  },

  relabel(path) {
    const [filename, directory] = path.split('/').reverse();

    if (/^index\./i.test(filename)) {
      return `${directory}/${filename}`;
    }
  }

};
