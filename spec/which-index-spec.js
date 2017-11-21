'use babel';

import { relabel } from '../lib/which-index';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('.relabel', () => {
  it('returns pretty label', () => {
    expect(relabel('/path/to/my/index.js')).toEqual('my/index.js');
  });

  it('ignores non index files', () =>  {
    expect(relabel('/path/to/my/test.js')).toBeUndefined();
  });
});
