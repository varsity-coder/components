(function(scope, undefined){
  
  var extend = function(left, right) {
    var obj = {}

    for (var key in left) {
      obj[key] = left[key]
    }
    for (var key in right) {
      obj[key] = right[key]
    }

    return obj
  }

  var EventCapture = function(options){
    this.options = extend({}, options)

    this.stop = function() {
      this.recording = false
      this.time = 0
      this.paused = 0
    }
    
    this.reset = function() {
      this.stop()
      this.queue = []
    }

    this.start = function() {
      this.recording = true

      if (this.paused > 0) {
        this.time = (new Date().valueOf() - this.paused)
      }
      else {
        this.time = new Date().valueOf()
      }
      
      this.paused = 0
    }

    this.pause = function() {
      this.recording = false
      this.paused = new Date().valueOf() - this.time
    }

    this.record = function(data) {
      if (this.recording === false) { 
        return false 
      }

      this.queue.push({
        t: new Date().valueOf() - this.time,
        e: data
      })
      return true
    }

    this.flush = function() {
      var q = this.queue
      this.queue = []
      return q
    }

    this.reset()
  }

  scope.EventCapture = EventCapture

})(this);

if (typeof module !== "undefined") {
  module.exports = this.EventCapture
};