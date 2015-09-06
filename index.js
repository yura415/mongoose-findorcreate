/*!
 * Mongoose findOrCreate Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

/*eslint-env node, es6 */

(function () {
  "use strict";

  function findOrCreatePlugin(schema) {
    schema.statics.findOrCreate = function findOrCreate(conditions, doc, options, callback) {
      if (arguments.length < 4) {
        if (typeof options === "function") {
          // Scenario: findOrCreate(conditions, doc, callback)
          callback = options;
          options = {};
        } else if (typeof doc === "function") {
          // Scenario: findOrCreate(conditions, callback);
          callback = doc;
          doc = {};
          options = {};
        }
      }

      var opts = {
        new: true, // return new doc if one is upserted
        upsert: true // insert the document if it does not exist
      };

      for (var k in options) {
        opts[k] = options[k];
      }

      return this.findOneAndUpdate(conditions, {
        $setOnInsert: doc
      }, opts, callback);
    };
  }

  /**
   * Export `findOrCreatePlugin`.
   */

  module.exports = findOrCreatePlugin;
}());
