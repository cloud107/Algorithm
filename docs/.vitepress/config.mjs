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
          text: '0x50 动态规划',
          link: '/guide/0x50-dynamic-program',
          collapsed: true
        },
        {
          text: '0x60 图论',
          link: '/guide/0x60-graph',
          collapsed: true
        },
        {
          text: '习题笔记',
          link: '/guide/Exercise Notes',
          collapsed: true
        }
      ]
    },

    // ➕ 新增：标题导航相关配置
    outline: [1, 6],
    outlineLabel: '本页目录',
    
    // 可选：优化滚动体验（避免标题被导航栏遮挡）
    scrollOffset: 120,
    
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