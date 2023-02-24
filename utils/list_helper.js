const dummy = () => 1

const totalLikes = (blogs) => {
  return blogs.reduce(function(sum, likes) {
    return sum + likes.likes
  }, 0)

}

const favoriteBlog = (blogs) => {
  let max = 0
  for (let i = 0; i < blogs.length; i++) {
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
  let name = ''
  let max = 0
  for (let i = 0; i < blogs.length; i++) {
    let temp = 0
    for (let j = i; j < blogs.length; j++) {
      if (blogs[i].author === blogs[j].author) {
        if (n === 1) {
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
  return ({ "name": name, "max": max })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}