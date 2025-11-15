import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  saveBook: (data: string) => ipcRenderer.invoke('save-book', data),
  loadBook: () => ipcRenderer.invoke('load-book'),
  autoSave: (data: string, filePath?: string) => ipcRenderer.invoke('auto-save', data, filePath),
});
