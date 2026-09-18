# 白袍之间

一个中文医学伦理抉择游戏。玩家会处理三份独立会诊单，在有限信息中练习资源分配、青少年保密与研究知情同意。

## 游戏机制

- 每案 4 次抉择；选择后必须再次确认，避免触屏误操作。
- 答错会显示针对该选项的解释，并允许重新判断。
- 首次独立答对计 100 分，纠错后计 60 分，查看提示后计 30 分。
- 本机保存个人成绩；玩家可以自愿把一轮成绩、星级与建议带到 GitHub Issue 草稿页，核对后亲自发布。
- GitHub Actions 读取公开 Issues，重新校验逐题计分，并生成 `community.json` 供游戏展示排行榜与评论。

## 社区数据与隐私

游戏不会代玩家发布 Issue，也不读取或保存 GitHub 登录凭据。公开投稿会显示 GitHub 账号、玩家填写的昵称、成绩或留言及来源链接。关闭自己的 Issue 后，该记录会在下一次同步时从榜单和留言中撤回。

成绩是玩家自报学习记录，不用于正式考核。请勿在 Issues 中提交真实患者资料、联系方式或其他敏感信息。

## 本地运行与验证

直接打开 `dist/index.html` 即可游玩。社区解析测试：

```sh
node --test community/community.test.mjs
```

## 参考

- [GitHub Pages 发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [通过 URL 预填 GitHub Issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue)
- [GitHub Actions 的 Issues 事件](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GITHUB_TOKEN 权限](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)

本项目用于伦理讨论教学，不提供个案医疗或法律意见。
