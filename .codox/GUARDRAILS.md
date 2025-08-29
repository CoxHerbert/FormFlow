# Guardrails
- 安全：禁用任意执行，表达式引擎仅允许 data/context 白名单。
- 性能：Renderer/Widgets 大数据→虚拟滚动；避免 O(n^2) 热路径。
- DX：新增功能必须有最小示例或 e2e 测试。
- 兼容：不破坏已有 examples；如需破坏，PR 必须含迁移说明。
