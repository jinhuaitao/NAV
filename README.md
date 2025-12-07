# 通过 Cloudflare Workers 导航网站

本指南将教如何完全通过网页界面部署记账应用，无需使用命令行工具。

## 🚀 部署步骤

### 第一步：创建 Worker
登录 Cloudflare Dashboard。

在左侧菜单点击 Workers & Pages。

点击 Create Application (创建应用) -> Create Worker (创建 Worker)。

可以随便起个名字（比如 my-nav），然后点击 Deploy (部署)。

此时你会看到一个默认的 "Hello World" 页面，不用管它。

点击 Edit code (编辑代码)。

清空 左侧编辑器里的所有默认代码，把上一条回复中的 完整 JS 代码 粘贴进去。

点击右上角的 Deploy 保存。

### 第二步：创建 KV 数据库 (存数据的地方)
回到 Cloudflare 的 Workers & Pages 主界面。

在左侧菜单点击 KV。

点击 Create a Namespace。

输入名字 NAV_DB (名字其实随意，但建议用这个方便记忆)，点击 Add。

### 第三步：绑定 KV 到 Worker (关键步骤！)
如果不做这一步，网站会报错 Internal Error。

回到你刚才创建的 Worker (比如 my-nav) 的设置页面。

点击顶部的 Settings (设置) 标签。

点击左侧子菜单的 Variables (变量)。

找到 KV Namespace Bindings (KV 命名空间绑定) 区域，点击 Add binding。

填写配置（必须严格一致）：

Variable name (变量名): 必须填 NAV_DB (因为代码里写死了 env.NAV_DB)。

KV Namespace: 选择你刚才在第二步创建的那个数据库。

点击 Save and deploy。
大功告成！ 点击 Worker 概览页面的 URL（通常是 https://你的名字.workers.dev）即可访问。
## 第一次打开网站提示设置账号和密码

### 🔍 搜索沉浸模式 (Auto Zen)

当您点击搜索框并停留（聚焦）超过 3 秒时，系统会自动判断您正在进行深度搜索，随后自动进入“禅模式”，隐藏所有图标干扰。
如果 3 秒内鼠标离开（失焦），计时取消。
进入禅模式后，点击背景空白处依然可以一键退出。 

### 🤔 常见问题
Q: 背景图怎么不显示？

A: 确保在“全局设置”里选择了正确的壁纸类型。如果是自定义 URL，确保链接是直链（以 .jpg 或 .png 结尾）。

Q: 我想改分类顺序怎么办？

A: 目前为了保证稳定性，分类顺序是按创建时间排的。你可以通过修改 JSON 备份文件（备份 -> 调整 JSON 里的数组顺序 -> 恢复）来调整。
