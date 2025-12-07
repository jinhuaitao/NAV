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
