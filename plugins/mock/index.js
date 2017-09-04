import Mock from 'mockjs'
import article from './article'

Mock.mock('http://icanhazip.com', 'get', article.getList)
Mock.mock('http://icanhazip.com?id=1000', 'get', article.chainList)

export default Mock
