# Codex-Workflow.md

## 🧭 使用场景
本文档说明如何让 **Codex** 在 FormFlow Monorepo 中进行一次完整的任务迭代，并且在仓库中留下「记忆」，以便下次继续。  

---

## 🔮 调用咒语（标准指令）
在 **Issue 顶部**粘贴以下指令，Codex 会自动按步骤工作：

```text
请按以下步骤执行本 Issue：

1. 先阅读并遵守以下文件：
   - .codox/PRESET.md
   - .codox/CONTEXT.md
   - .codox/ROADMAP.md
   - .codox/GUARDRAILS.md
   - CONTRIBUTING.md

2. 使用模板：
   - .codox/PROMPTS/implement-task.md
   将 Issue 的正文内容替换到 {{issue_body}}。

3. 输出格式：
   1) 变更计划（文件、接口、风险点）
   2) 补丁（代码块或 PR 变更摘要）
   3) 运行/验证步骤
   4) 回滚方案

4. 会话记录：
   - 将本次关键信息写入 `.codox/SESSIONS/YYYY-MM-DD-session-XXX.md`
   - 更新对应 `packages/*/STATE.md`
   - 如有架构/约定变更，新增 `docs/decisions/ADR-*.md`

5. 提交 PR：
   - 在 PR 描述里粘贴会话摘要
   - 勾选 `.codox/CHECKLIST.md` 项目
   - CI 必须 lint/type/test/build 全绿才能合并
```

---

## 📝 Issue 示例
```md
title: "[renderer] 支持 visibleWhen 安全表达式"

## 任务描述
在 `renderer` 中，当前 `visibleWhen` 使用 `safeEval`，存在安全隐患。  
需要改造为一个安全表达式解析器：  
- 只允许访问 `data` 和 `context`  
- 仅支持基础逻辑运算符（`&&`, `||`, `===`, `!==`）

## 验收标准
- [ ] 替换现有 safeEval
- [ ] 新增安全表达式解析函数
- [ ] 在 examples/pc-elp 增加 visibleWhen 用例
- [ ] CI 全部通过

## 模块
- [x] core
- [x] renderer
```

---

## 📂 Codex 执行结果（预期产物）
1. 修改/新增代码文件（补丁）  
2. `.codox/SESSIONS/YYYY-MM-DD-session-001.md`  
   - 记录输入任务 / 关键决策 / 修改点 / 验收结果 / 下一步  
3. `packages/<module>/STATE.md` 更新  
4. 如涉及架构决策 → 新增 `docs/decisions/ADR-*.md`  
5. 在 PR 描述里粘贴会话摘要 & 勾选 Checklist  

---

## 🚦 一次完整任务流程
1. **新建 Issue** → 选择 Codex Task 模板 → 粘贴需求  
2. **Codex 执行** → 输出计划 / 补丁 / 验证 / 回滚  
3. **保存会话记录** → 写入 `.codox/SESSIONS/` + 更新 `STATE.md`  
4. **提交 PR** → 包含摘要 & 勾 Checklist  
5. **CI 守门** → 确认更新记忆文件 + lint/type/test/build 通过  
6. **合并** → 下一次 Codex 会基于 `.codox/*` 继续工作  

---

💡 **提示**：  
- `.codox/` 文件夹就是 Codex 的「记忆体」，每次任务必须写入。  
- 你只需在新聊天中给 Codex 看这份文档，它就能立刻接着上一次的节奏继续工作。  
