<template>
  <router-view />
</template>

<style lang="scss">
:root {
  --apple-bg: #f4f6fb;
  --apple-bg-secondary: #eef2f8;
  --apple-card: rgba(255, 255, 255, 0.78);
  --apple-card-solid: #ffffff;
  --apple-text-primary: #111827;
  --apple-text-secondary: #5b6475;
  --apple-border: rgba(15, 23, 42, 0.08);
  --apple-accent: #0071e3;
  --apple-accent-soft: rgba(0, 113, 227, 0.12);
  --apple-danger: #ff453a;
  --apple-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  --apple-radius-xl: 22px;
  --apple-radius-lg: 16px;
  --apple-radius-md: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  font-family: "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--apple-text-primary);
  background: radial-gradient(circle at 8% 8%, #ffffff 0%, var(--apple-bg) 45%, var(--apple-bg-secondary) 100%);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(122, 138, 163, 0.68);
  border-radius: 999px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

.el-card {
  border: 1px solid var(--apple-border) !important;
  box-shadow: var(--apple-shadow) !important;
  border-radius: var(--apple-radius-xl) !important;
  background: var(--apple-card) !important;
  backdrop-filter: blur(16px);
}

.el-page-header {
  margin-bottom: 18px;
}

.el-page-header__title {
  font-weight: 600;
  color: var(--apple-text-primary);
}

.el-page-header__content {
  color: var(--apple-text-secondary);
}

.el-table {
  border-radius: var(--apple-radius-lg);
  overflow: hidden;
}

.el-table th.el-table__cell {
  background: #f8faff;
  color: #5d6677;
  font-weight: 600;
}

.el-table td.el-table__cell {
  background: rgba(255, 255, 255, 0.8);
}

.el-button {
  border-radius: 999px !important;
  font-weight: 500;
}

.el-button--primary {
  background: linear-gradient(135deg, #1d7ff0, var(--apple-accent)) !important;
  border-color: transparent !important;
}

.el-input__wrapper,
.el-textarea__inner,
.el-select__wrapper,
.el-range-editor {
  border-radius: var(--apple-radius-md) !important;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.08) inset !important;
}

.el-dialog {
  border-radius: var(--apple-radius-xl) !important;
  overflow: hidden;
}

.el-dialog__header {
  border-bottom: 1px solid var(--apple-border);
  margin-right: 0 !important;
}

.apple-page {
  padding: 24px;
}
</style>
