declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
      saveBook: (data: string) => Promise<{ success: boolean; path?: string; error?: string }>;
      loadBook: () => Promise<{ success: boolean; data?: string; path?: string; error?: string }>;
      autoSave: (data: string, filePath?: string) => Promise<{ success: boolean; path?: string; error?: string }>;
    };
  }
}

export {};
