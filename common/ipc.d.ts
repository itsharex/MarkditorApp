export interface IPlatformAPI {
  // 打开选择文件对话框
  openFile(): Promise<{ path: string, content: string } | undefined>;

  saveFile(path: string, content: string): Promise<boolean>;

  showSaveDialog(): Promise<string | undefined>;
  // 获取系统信息
  getSystemInfo(): Promise<string>;

  // 打开开发者调试工具
  openDevTools(): Promise<void>;
} 