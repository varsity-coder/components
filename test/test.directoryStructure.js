var expect = require("chai").expect
var DirectoryStructure = require("../public/directoryStructure")

describe("DirectoryStructure", function(){

  describe("constructor", function(){

    it("should be instantiable", function(){
      expect(DirectoryStructure).to.be.a("function")
      expect(new DirectoryStructure()).to.be.an("object")
    })

    it("should create fileData property", function(){
      var pv = new DirectoryStructure()
      expect(pv.data).to.be.an("object")
      expect(pv.data).to.deep.equal({})

      pv = new DirectoryStructure({ 
        "file.js": "something", 
        "another_file.js": "something else" 
      })
      expect(pv.data).to.be.an("object")
      expect(pv.data).to.deep.equal({
        "file.js": "something", 
        "another_file.js": "something else" 
      })
    })

    it("should create options property", function(){
      var pv = new DirectoryStructure()
      expect(pv.options).to.be.an("object")
      expect(pv.options).to.have.keys(["matchWith"])

      pv = new DirectoryStructure({
        "file.js": "something", 
        "another_file.js": "something else" 
      })
      expect(pv.options).to.be.an("object")
      expect(pv.options).to.have.keys(["matchWith"])

      pv = new DirectoryStructure({
        "file.js": "something", 
        "another_file.js": "something else" 
      }, {
        "foo": "bar"
      })
      expect(pv.options).to.be.an("object")
      expect(pv.options).to.have.keys(["matchWith", "foo"])
    })

  })

  describe("listFiles", function(){

    it("should work when empty", function(){

      var pv = new DirectoryStructure()

      expect(pv.listFiles()).to.be.an("array")
      expect(pv.listFiles().length).to.equal(0)

    })

    it("should work with a flat structure", function(){

      var pv = new DirectoryStructure({ 
        "filename.js": "some content", 
        "filename.css": "different content" 
      })

      expect(pv.listFiles()).to.be.an("array")
      expect(pv.listFiles().length).to.equal(2)
      expect(pv.listFiles()).to.have.members([
        "filename.js",
        "filename.css"
      ])

    })

    it("should work with a nested structure", function(){

      var pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })

      expect(pv.listFiles()).to.be.an("array")
      expect(pv.listFiles().length).to.equal(4)
      expect(pv.listFiles()).to.have.members([
        "somefile.html",
        "libs/somefile.js",
        "libs/otherfile.js",
        "libs/plugins/jquery.addNumbers.js"
      ])

    })

    it("should accept a leading path with trailing slash", function(){

      var pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })

      var list = pv.listFiles("leading_path/")

      expect(list).to.be.an("array")
      expect(list.length).to.equal(4)
      expect(list).to.have.members([
        "leading_path/somefile.html",
        "leading_path/libs/somefile.js",
        "leading_path/libs/otherfile.js",
        "leading_path/libs/plugins/jquery.addNumbers.js"
      ])

    })

    it("should accept a leading path without trailing slash", function(){

      var pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })

      var list = pv.listFiles("leading_path")

      expect(list).to.be.an("array")
      expect(list.length).to.equal(4)
      expect(list).to.have.members([
        "leading_path/somefile.html",
        "leading_path/libs/somefile.js",
        "leading_path/libs/otherfile.js",
        "leading_path/libs/plugins/jquery.addNumbers.js"
      ])

    })

  })

  describe("find", function(){

    it("should find files correctly", function(){

      var pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })

      expect(pv.find("").length).to.equal(4)
      expect(pv.find("som").length).to.equal(2)
      expect(pv.find("lsom").length).to.equal(1)
      expect(pv.find("sfasdfsdasfg").length).to.equal(0)

    })

  })

  describe("touch", function(){

    var pv
    beforeEach(function(){
      pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })
    })

    it("should create a file in root correctly", function(){

      var result = pv.touch("newfile.js")

      expect(result).to.equal(true)
      expect(pv.listFiles().length).to.equal(5)
      expect(pv.listFiles()).to.have.members([
        "newfile.js",
        "somefile.html",
        "libs/somefile.js",
        "libs/otherfile.js",
        "libs/plugins/jquery.addNumbers.js"
      ])

    })

    it("should create a file in a directory correctly", function(){

      var result = pv.touch("libs/plugins/newfile.js")

      expect(result).to.equal(true)
      expect(pv.listFiles().length).to.equal(5)
      expect(pv.listFiles()).to.have.members([
        "libs/plugins/newfile.js",
        "somefile.html",
        "libs/somefile.js",
        "libs/otherfile.js",
        "libs/plugins/jquery.addNumbers.js"
      ])

    })

    it("should not create a file in a non-existent directory", function(){

      var pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })

      var result = pv.touch("libs/incorrect/newfile.js")

      expect(result).to.equal(false)
      expect(pv.listFiles().length).to.equal(4)

    })

  })

  describe("mkdir", function(){

    var pv
    beforeEach(function(){
      pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })
    })

    it("should create a folder in root correctly", function(){

      var mkdirResult = pv.mkdir("test")
      var touchResult = pv.touch("test/testfile.js")

      expect(mkdirResult).to.equal(true)
      expect(touchResult).to.equal(true)
      expect(pv.listFiles().length).to.equal(5)
      expect(pv.listFiles()).to.have.members([
        "test/testfile.js",
        "somefile.html",
        "libs/somefile.js",
        "libs/otherfile.js",
        "libs/plugins/jquery.addNumbers.js"
      ])

    })

    it("should create a folder in a directory correctly", function(){

      var mkdirResult = pv.mkdir("libs/plugins/test")
      var touchResult = pv.touch("libs/plugins/test/testfile.js")

      expect(mkdirResult).to.equal(true)
      expect(touchResult).to.equal(true)
      expect(pv.listFiles().length).to.equal(5)
      expect(pv.listFiles()).to.have.members([
        "libs/plugins/test/testfile.js",
        "somefile.html",
        "libs/somefile.js",
        "libs/otherfile.js",
        "libs/plugins/jquery.addNumbers.js"
      ])

    })

    it("should not create a folder in a non-existent directory", function(){

      var mkdirResult = pv.mkdir("libs/incorrect/test")
      
      expect(mkdirResult).to.equal(false)
      expect(pv.listFiles().length).to.equal(4)

    })

  })

  describe("rm", function(){

    var pv
    beforeEach(function(){
      pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })
    })

    it("should remove files in root", function(){
      var result = pv.rm("somefile.html")
      expect(result).to.equal(true)
      expect(pv.listFiles().length).to.equal(3)
      expect(pv.listFiles()).to.have.members([
        "libs/somefile.js",
        "libs/otherfile.js",
        "libs/plugins/jquery.addNumbers.js"
      ])
    })

    it("should remove files in folders", function(){
      var result = pv.rm("libs/plugins/jquery.addNumbers.js")
      expect(result).to.equal(true)
      expect(pv.listFiles().length).to.equal(3)
      expect(pv.listFiles()).to.have.members([
        "libs/somefile.js",
        "libs/otherfile.js",
        "somefile.html"
      ])
    })

    it("should remove folders in root", function(){
      var result = pv.rm("libs")
      expect(result).to.equal(true)
      expect(pv.listFiles().length).to.equal(1)
      expect(pv.listFiles()).to.have.members([
        "somefile.html"
      ])
    })

    it("should remove folders in folders", function(){
      var result = pv.rm("libs/plugins")
      expect(result).to.equal(true)
      expect(pv.listFiles().length).to.equal(3)
      expect(pv.listFiles()).to.have.members([
        "libs/somefile.js",
        "libs/otherfile.js",
        "somefile.html"
      ])
    })

    it("should not remove things that don't exist", function(){
      var result = pv.rm("libs/incorrect")
      expect(result).to.equal(false)
      expect(pv.listFiles().length).to.equal(4)
      expect(pv.listFiles()).to.have.members([
        "libs/somefile.js",
        "libs/otherfile.js",
        "somefile.html",
        "libs/plugins/jquery.addNumbers.js"
      ])
    })

  })

  describe("read", function(){

    var pv
    beforeEach(function(){
      pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })
    })

    it("should read existing files in root", function(){

      expect(pv.read("somefile.html")).to.equal("file content")

    })

    it("should read existing files in a folder", function(){

      expect(pv.read("libs/plugins/jquery.addNumbers.js")).to.equal("here is a file")

    })

    it("should not read non-existent files", function(){

      expect(pv.read("doesnt_exist.html")).to.equal(false)
      expect(pv.read("libs/doesnt_exist.html")).to.equal(false)
      expect(pv.read("this_either/doesnt_exist.html")).to.equal(false)

    })

  })

  describe("save", function(){

    var pv
    beforeEach(function(){
      pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })
    })

    it("should save existing files in root", function(){

      expect(pv.save("somefile.html", "different content")).to.equal(true)
      expect(pv.read("somefile.html")).to.equal("different content")

    })

    it("should save existing files in a folder", function(){

      expect(pv.save("libs/plugins/jquery.addNumbers.js", "different content")).to.equal(true)
      expect(pv.read("libs/plugins/jquery.addNumbers.js")).to.equal("different content")

    })

    it("should not save non-existent files", function(){

      expect(pv.save("doesnt_exist.html", "different content")).to.equal(false)
      expect(pv.save("libs/doesnt_exist.html", "different content")).to.equal(false)
      expect(pv.save("this_either/doesnt_exist.html", "different content")).to.equal(false)

    })

  })

  describe("export", function(){
    
    it("should export files", function(){
      var pv = new DirectoryStructure({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })

      expect(pv.export()).to.deep.equal({
        "somefile.html": "file content",
        "libs": {
          "somefile.js": "javacrisps",
          "otherfile.js": "undefined = true",
          "plugins": {
            "jquery.addNumbers.js": "here is a file"
          }
        }
      })
    })
    
  })

})