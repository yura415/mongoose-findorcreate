/*eslint-env node, mocha */

(function () {
  "use strict";

  /**
   * @list dependencies
   **/

  var mongoose = require("mongoose");
  var Schema = mongoose.Schema;
  var findOrCreate = require("../");

  var should = require("should");

  mongoose.connect("mongodb://localhost/findOrCreate");
  mongoose.connection.on("error", function (err) {
    console.error("MongoDB error: " + err.message);
    console.error("Make sure a mongoDB server is running and accessible by this application");
  });

  var ClickSchema = new Schema({
    ip: {
      type: String,
      required: true
    }
  });

  ClickSchema.plugin(findOrCreate);

  var Click = mongoose.model("Click", ClickSchema);

  after(function (done) {
    mongoose.connection.db.dropDatabase();
    done();
  });

  describe("findOrCreate", function () {
    it("should create the object if it doesn't exist ", function (done) {
      Click.findOrCreate({
        ip: "127.0.0.1"
      }, function (err, click) {
        should.not.exist(err);
        click.ip.should.eql("127.0.0.1");
        Click.count({}, function (_err, num) {
          should.not.exist(_err);
          should.exist(num);
          num.should.equal(1);
          done();
        });
      });
    });

    it("returns the object if it already exists", function (done) {
      Click.create({
        ip: "127.0.0.2"
      }, function () {
        Click.findOrCreate({
          ip: "127.0.0.2"
        }, function (err, click) {
          should.not.exist(err);
          should.exist(click);
          click.ip.should.eql("127.0.0.2");
          Click.count({
            ip: "127.0.0.2"
          }, function (_err, num) {
            should.not.exist(_err);
            should.exist(num);
            num.should.equal(1);
            done();
          });
        });
      });
    });

    it("should work with promises", function (done) {
      Click.findOrCreate({
        ip: "127.0.0.102"
      }).exec().then(function (click) {
        should.exist(click);
        click.ip.should.eql("127.0.0.102");
        done();
      }, done);
    });
  });
}());
