const { createNewId } = require("../utils");

/**
@template MessageData

@typedef {
  (
    message: import('../shared/Message')<MessageData>,
    messages: import('./Messages')
  ) => void
} Observer
*/

class Observers {
  constructor() {
    /** @type {{ [observerId: string]: Observer<any> }} */
    this.observers = {};

    this.createNewId = this.createNewId.bind(this);
    this.addObserver = this.addObserver.bind(this);
    this.removeObserver = this.removeObserver.bind(this);
    this.runObservers = this.runObservers.bind(this);
  }

  createNewId() {
    let id = createNewId();
    while (this.observers[id]) id = createNewId();
    return id;
  }

  /**
   * @param {Observer<any>} observer
   *
   * @returns {string} the id of this observer. Use it to remove the observer.
   */
  addObserver(observer) {
    const id = this.createNewId();
    this.observers[id] = observer;
    return id;
  }

  /**
   * @param {string} id
   */
  removeObserver(id) {
    delete this.observers[id];
  }

  /**
   * @param {import('../shared/Message')} message
   * @param {import('./Messages')} messages
   */
  runObservers(message, messages) {
    for (const observer of Object.values(this.observers))
      observer(message, messages);
  }
}

module.exports = Observers;
