# Blog
使用react + tailwindCSS搭建的个人学习博客，主要用于尝试各种功能以及放置一些学习记录，设计方面较为粗糙
## 部署
以下介绍都是以免费额度为前提
- 前端：[vercel](https://vercel.com/vanessas-projects-f2daa48f)
- 后端：[render](https://render.com/) 
  - 512MB RAM + 0.1CPU
  - 上线时间可以保证不会耗尽
  - ⚠15分钟无流量自动休眠且再唤起加载时容易卡（理论上可以用一些神秘力量自动保持流量，自行定夺）
- 数据库：[neon](https://console.neon.tech/)
  - 每月100 CU hours（CU-hour = CU x active hours (compute usage), 1 CU ≈ 4 GB RAM）个人项目用不完的
  - 0.5GB存储
- 图床：Github + PicGo
  - 网上教程很多，注意点大概是要用**classic token**，以及并不局限于main，可以随意使用自建branch
## 功能TODO-List （🚧施工中）
- [x] 超级用户的文章增删改查
- [x] 用户登录
- [x] 明暗模式
- [x] 文章内外简易目录
- [x] 图床部署
- [ ] 翻译 （为精确度使用了deepl api，可以正常翻译，但是对markdown的格式处理有问题）
