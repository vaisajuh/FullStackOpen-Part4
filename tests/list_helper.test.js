const listHelper = require('../utils/list_helper')
const testBlogs = require('../utils/blogs')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testBlogs.blogs)
    expect(result).toBe(36)
  })
})

describe('blog with most likes', () => {

  test('is calculated right', () => {
    const result = listHelper.favoriteBlog(testBlogs.blogs)
    expect(result).toEqual(12)
  })
})

describe('author with most blogs', () => {

  test('is calculated right', () => {
    const result = listHelper.mostBlogs(testBlogs.blogs)
    expect(result.name).toBe('Robert C. Martin')
    expect(result.max).toBe(3)
  })
})

describe('author with most likes', () => {

  test('is calculated right', () => {
    const result = listHelper.mostLikes(testBlogs.blogs)
    expect(result.name).toBe('Edsger W. Dijkstra')
    expect(result.max).toBe(17)
  })
})



