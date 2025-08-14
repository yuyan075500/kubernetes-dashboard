# IDSphere Kubernetes 管理平台介绍
Kubernetes 多集群管理（持续开发中...）
## 架构设计
项目采用前后端分离架构设计，项目地址如下：
| 项目   | 项目地址 |
|:------|:-----|
| 前端   | https://github.com/yuyan075500/kubernetes-dashboard    |                                                                                                              |
| 后端   | https://github.com/yuyan075500/idsphere    |

# 配置文件说明
```shell
# 环境名称
ENV = 'development'

# 后端服务器地址
VUE_APP_BASE_API = '/'

# 应用名称
VUE_APP_TITLE = 'Kubernetes 管理平台'
```
* [x] **ENV**：环境名称，开发环境名称为 `development`，对应配置文件名为 `.env.development`，生产环境名称为 `production`，对应配置文件名为 `.env.production`。
* [x] **VUE_APP_BASE_API**：默认，统一设置为 `/` 。
* [x] **VUE_APP_TITLE**：自定义系统名称，影响浏览器页面标题和进系统后左上角名称。
>   
> 注意：由于项目使用前后端分离架构，为实现 `SSO` 自动跳转功能，因此 `VUE_APP_BASE_API` 默认为 `/`。在开发和生产环境都需要增加一个代理层（`Nginx`、`Traefix` 等）实现动静分离，具体可以参考 [搭建开发环境](https://github.com/yuyan075500/idsphere/blob/main/deploy/dev.md) 和 [项目部署](https://github.com/yuyan075500/idsphere?tab=readme-ov-file#%E9%A1%B9%E7%9B%AE%E9%83%A8%E7%BD%B2) 相关文档。
>   
# 开发调试
开发环境建议使用 `VS Code` 工具，配置文件位于项目根目录，配置文件名为 `.env.development`。
1. 安装项目依赖。
```shell
npm install
```
2. 运行项目
```shell
npm run dev
```
项目运行成功后默认监听 `9257` 端口，如果想变更端口可以通过 `vue.config.js` 配置文件修改，端口相关变量为 `port`。
# 生产环境部署
生产环境配置文件位于项目根目录，配置文件名为 `.env.production`。
1. 安装项目依赖。
```shell
npm install
```
2. 项目编译。  
```shell
npm run build:prod
```
3. 打包容器镜像  
打包容器镜像参考项目根目录的 `Dockerfile` 文件，个性化打包需求可按需修改相关配置。

