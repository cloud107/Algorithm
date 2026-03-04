import mathjax3 from 'markdown-it-mathjax3'
import katex from '@iktakahiro/markdown-it-katex'


export default {
  // 站点标题
  title: '算法竞赛进阶指南 · 题解笔记',
  description: '李煜东《算法竞赛进阶指南》学习记录',


  markdown: {
    config: (md) => {
      md.use(mathjax3, {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          packages: ['base', 'ams', 'noerrors']
        }
      })
    }
  },
  
  // 添加数学公式 CSS 样式
  // head: [
  //   [
  //     'link',
  //     {
  //       rel: 'stylesheet',
  //       href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
  //     }
  //   ]
  // ],
  
  // 部署到 GitHub Pages 时需要配置（仓库名为 Algorithm）
  base: '/Algorithm/',
  
  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '章节导航', link: '/guide/0x00-basic' },
      { text: '小 Tips', link: '/tips' },
      { text: 'GitHub', link: 'https://github.com/cloud107/Algorithm' }
    ],
    
    // 侧边栏 - 按章节组织
    sidebar: {
      '/guide/': [
        {
          text: '0x00 基本算法',
          link: '/guide/0x00-basic',
          collapsed: false
        },
        {
          text: '0x10 基本数据结构',
          link: '/guide/0x10-data-structure',
          collapsed: true
        },
        {
          text: '0x20 搜索',
          link: '/guide/0x20-search',
          collapsed: true
        },
        {
          text: '0x30 数学知识',
          link: '/guide/0x30-math',
          collapsed: true
        },
        {
          text: '0x40 数据结构进阶',
          link: '/guide/0x40-advanced-ds',
          collapsed: true
        },
        {
          text: '0x60 图论',
          link: '/guide/0x60-graph',
          collapsed: true
        }
      ]
    },
    
    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present cloud107'
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cloud107/Algorithm' }
    ],
    
    // 搜索配置（可选）
    search: {
      provider: 'local'
    }
  }
}