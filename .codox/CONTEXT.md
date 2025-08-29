# Context
- Monorepo 包含 schema/core/renderer/kit-elp/kit-vant/designer/widgets/server。
- 目标：先覆盖 MVP，逐步补齐 Designer/Widgets/Workflow。
- 约定：npm workspaces + turbo；CI 必须 lint/type/test/build 通过。
- 端：PC=Element Plus；Mobile=Vant。Renderer 中立，Adapter 兼容。
