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

  var quickMatch = function (word, query) {
    var remaining = word.split("").reduce(function(mem, letter){
      if (letter === mem[0]) {
        mem = mem.substr(1)
      }
      return mem
    }, query)

    if (remaining.length) {
      return 0
    }
    return 1
  }

  var findDirectory = function(path, data) {
    return path.split("/").reduce(function(mem, segment){
      if (mem === false || segment === "") { 
        return mem 
      }
      
      if (mem[segment] && typeof mem[segment] === "object") {
        return mem[segment]
      }
      
      return false
    }, data)
  }

  var DirectoryStructure = function(fileData, options) {

    this.data = fileData || {}
    this.options = extend({ 
      matchWith: quickMatch 
    }, options)

    this.listFiles = function (path, folder) {
      folder = folder || this.data
      path = path || ""

      if (path && path[path.length - 1] !== "/") {
        path = path + "/"
      }

      var list = []

      for (var key in folder) {
        if (typeof folder[key] === "string") {
          list.push(path + key)
        }
        else {
          this.listFiles(path + key + "/", folder[key]).forEach(function(item){
            list.push(item)
          })
        }
      }

      return list
    }

    this.find = function(query) {
      var list = this.listFiles()
      var matchFn = this.options.matchWith

      return list.map(function(fileName){
        return { 
          score: matchFn(fileName, query),
          file: fileName
        }
      }).filter(function(fileName){
        return fileName.score > 0
      }).sort(function(a, b){ return b.score - a.score})
    }

    this.touch = function(fileName) {
      var path, data = this.data

      if (fileName.indexOf("/") > -1) {
        var path = fileName.split("/")
        fileName = path.pop()

        data = findDirectory(path.join("/"), data)
      }

      if (data === false) {
        return false
      }
      data[fileName] = ""

      return true
    }

    this.mkdir = function(folderName) {
      var path, data = this.data

      if (folderName.indexOf("/") > -1) {
        var path = folderName.split("/")
        folderName = path.pop()

        data = findDirectory(path.join("/"), data)
      }

      if (data === false) {
        return false
      }
      data[folderName] = {}

      return true
    }

    this.rm = function(fileName) {
      var data = this.data

      if (fileName.indexOf("/") > -1) {
        var path = fileName.split("/")
        fileName = path.pop()

        data = findDirectory(path.join("/"), data)
      }

      if (data === false || !data[fileName]) {
        return false
      }
      delete data[fileName]

      return true
    }

    this.export = function() {
      return this.data
    }

    this.read = function(fileName) {
      var data = this.data

      if (fileName.indexOf("/") > -1) {
        var path = fileName.split("/")
        fileName = path.pop()

        data = findDirectory(path.join("/"), data)
      }

      if (data === false || !data[fileName]) {
        return false
      }
      return data[fileName]
    }

    this.save = function(fileName, newContent) {
      var data = this.data

      if (fileName.indexOf("/") > -1) {
        var path = fileName.split("/")
        fileName = path.pop()

        data = findDirectory(path.join("/"), data)
      }

      if (data === false || !data[fileName]) {
        return false
      }
      
      data[fileName] = newContent
      return true
    }

  }

  scope.DirectoryStructure = DirectoryStructure

})(this);

if (typeof module !== "undefined") {
  module.exports = this.DirectoryStructure
};