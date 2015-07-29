var expect = require("chai").expect
var EventCapture = require("../public/eventCapture")

describe("EventCapture", function(){

  describe("constructor", function(){

    it("should be instantiable", function(){
      expect(EventCapture).to.be.a("function")
      expect(new EventCapture()).to.be.an("object")
    })

    it("should have a queue property", function(){
      expect(new EventCapture().queue).to.be.an("array")
      expect(new EventCapture().queue.length).to.equal(0)
    })

    it("should have a recording property", function(){
      expect(new EventCapture().recording).to.be.a("boolean")
      expect(new EventCapture().recording).to.equal(false)
    })

    it("should have a paused property", function(){
      expect(new EventCapture().paused).to.be.a("number")
      expect(new EventCapture().paused).to.equal(0)
    })

    it("should have a time property", function(){
      expect(new EventCapture().time).to.be.a("number")
      expect(new EventCapture().time).to.equal(0)
    })

    it("should have an options property", function(){
      expect(new EventCapture().options).to.be.an("object")
      expect(new EventCapture().options).to.deep.equal({})
      expect(new EventCapture({ foo: "bar" }).options).to.have.keys(["foo"])
    })

  })

  describe("reset", function(){

    it("should reset properties", function(){
      var ec = new EventCapture()
      ec.time = 99
      ec.queue = [ "a", "b", "c" ]
      ec.recording = true
      
      ec.reset()

      expect(ec.time).to.equal(0)
      expect(ec.queue.length).to.equal(0)
      expect(ec.recording).to.equal(false)
    })

  })

  describe("start", function(){

    var ec
    beforeEach(function(){
      ec = new EventCapture()
    })

    it("should start recording", function(){
      ec.start()
      expect(ec.recording).to.equal(true)
    })

    it("should set the time", function(){
      var timer = new Date().valueOf()
      ec.start()
      expect(ec.time).to.be.closeTo(timer, 2)
    })

    it("should set the modified time if paused", function(){
      var timer = new Date().valueOf()
      ec.paused = 500
      ec.start()
      expect(ec.time).to.be.closeTo(timer - 500, 2)
      expect(ec.paused).to.equal(0)
    })

  })

  describe("stop", function(){

    var ec
    beforeEach(function(){
      ec = new EventCapture()
    })

    it("should stop recording", function(){
      ec.start()
      ec.stop()
      expect(ec.recording).to.equal(false)
    })

    it("should clear time and paused", function(){
      ec.time = 99
      ec.paused = 50
      ec.queue = [ "a", "b", "c" ]
      
      ec.stop()
      expect(ec.time).to.be.equal(0)
      expect(ec.paused).to.equal(0)
      expect(ec.queue.length).to.equal(3)
    })

  })

  describe("pause", function(){

    var ec
    beforeEach(function(){
      ec = new EventCapture()
    })

    it("should stop recording", function(){
      ec.start()
      ec.pause()
      expect(ec.recording).to.equal(false)
    })

    it("should set the paused value", function(){
      var timer = new Date().valueOf()
      ec.time = timer - 100
      ec.pause()
      expect(ec.paused).to.be.closeTo(100, 2)
    })

  })

  describe("record", function(){

    var ec
    beforeEach(function(){
      ec = new EventCapture()
    })

    it("should return false when not recording", function(){
      var result = ec.record({ some: "event" })

      expect(result).to.equal(false)
      expect(ec.queue.length).to.equal(0)
    })

    it("should return true when recording", function(){
      ec.start()
      var result = ec.record({ some: "event" })

      expect(result).to.equal(true)
      expect(ec.queue.length).to.equal(1)
    })

    it("should timestamp data", function(){
      ec.recording = true
      ec.time = new Date().valueOf() - 500
      var result = ec.record({ some: "event" })

      expect(ec.queue[0].t).to.be.closeTo(500, 2)
      expect(ec.queue[0].e).to.deep.equal({ some: "event" })
    })

  })

  describe("flush", function(){

    var ec
    beforeEach(function(){
      ec = new EventCapture()
    })

    it("should always return an array", function(){
      expect(ec.flush()).to.be.an('array')
      expect(ec.flush().length).to.equal(0)
    })

    it("should return the existing queue", function(){
      ec.queue = [{ some: "thing" }, { another: "thang" }]
      var res = ec.flush()
      expect(res.length).to.equal(2)
    })

    it("should clear the existing queue", function(){
      ec.queue = [{ some: "thing" }, { another: "thang" }]
      ec.flush()
      expect(ec.queue.length).to.equal(0)
    })

  })

})