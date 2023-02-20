const { blogs } = require("./blogs")

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
  return blogs.reduce(function(sum, likes) {
    return sum + likes.likes
  }, 0)

}

const favoriteBlog = (blogs) => {
  var max = 0
  for (var i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes
    }
  }
  return max
}
const mostBlogs = (blogs) => {
  return helperFunction(blogs, 0)
}

const mostLikes = (blogs) => {
  return helperFunction(blogs, 1)
}

const helperFunction = (blogs, n) => {
  var name = ''
  var max = 0
  for (var i = 0; i < blogs.length; i++) {
    var temp = 0
    for (var j = i; j < blogs.length; j++) {
      if (blogs[i].author === blogs[j].author) {
        if (n == 1) {
          temp += blogs[j].likes
        } else {
          temp += 1
        }
      } 
    }
    if (temp > max) {
      max = temp
      name = blogs[i].author
    }
    temp = 0
  }
  return ({"name": name, "max": max})
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }