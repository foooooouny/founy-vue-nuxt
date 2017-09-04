import Mock from 'mockjs'
let Random = Mock.Random

const List = []
const count = 20
const chainT1 = {
  id: '@id',
  type: 1,
  defaultOutId: '@id',
  nodeContent: {
    desc: '<hr/><h3>@ctitle(8, 12)</h3><p>@ctitle(20, 30)</p><hr/>'
  }
}
const chainT2 = {
  id: '@id',
  type: 2,
  defaultOutId: '@id',
  nodeContent: {
    desc: `<h3 class="chain-select-title">${Random.ctitle(3, 5)}@title(1, 3)</h3><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"/>`,
    options: [
      {
        _id: '@id',
        content: Random.ctitle(3, 5),
        destInputId: '@id'
      },
      {
        _id: '@id',
        content: Random.ctitle(3, 5),
        destInputId: '@id'
      }
    ]
  }
}
const cList = []
for (let i = 0; i < 10; i++) {
  let a = Math.floor(Math.random() * 2) + 1
  if (a === 1) {
    cList.push(Mock.mock(chainT1))
  } else {
    cList.push(Mock.mock(chainT2))
  }
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    title: '@ctitle(10, 20)',
    'status|1': ['published', 'draft'],
    author: '@cname',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }))
}

export default {
  getList: () => List,
  getArticle: () => ({
    id: 120000000001,
    author: { key: 'mockPan' },
    source_name: '原创作者',
    category_item: [{ key: 'global', name: '全球' }],
    comment_disabled: false,
    content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
    content_short: '我是测试数据',
    display_time: +new Date(),
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    platforms: ['a-platform'],
    source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
    status: 'published',
    tags: [],
    title: ''
  }),
  chainList: () => cList
}
