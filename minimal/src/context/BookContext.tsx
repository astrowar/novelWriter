import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BookData, createEmptyBook } from '../types/book';

interface BookContextType {
  bookData: BookData;
  setBookData: (data: BookData) => void;
  currentFilePath: string | null;
  isDirty: boolean;
  saveBook: () => Promise<void>;
  loadBook: () => Promise<void>;
  newBook: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookData, setBookDataState] = useState<BookData>(createEmptyBook());
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Mark as dirty when data changes
  const setBookData = useCallback((data: BookData) => {
    setBookDataState(data);
    setIsDirty(true);
  }, []);

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (isDirty && currentFilePath && window.electronAPI) {
        try {
          const result = await window.electronAPI.autoSave(
            JSON.stringify(bookData, null, 2),
            currentFilePath
          );
          if (result.success) {
            setIsDirty(false);
            console.log('Auto-saved to:', result.path);
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [isDirty, currentFilePath, bookData]);

  const saveBook = async () => {
    if (!window.electronAPI) {
      // Fallback for browser mode
      const dataStr = JSON.stringify(bookData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'book-data.json';
      a.click();
      URL.revokeObjectURL(url);
      setIsDirty(false);
      console.log('Book saved (browser mode):', bookData.title);
      return;
    }

    try {
      const result = await window.electronAPI.saveBook(
        JSON.stringify(bookData, null, 2)
      );
      if (result.success && result.path) {
        setCurrentFilePath(result.path);
        setIsDirty(false);
        console.log('Book saved to:', result.path);
        alert('Book saved successfully!');
      } else if (result.error) {
        console.error('Save failed:', result.error);
        if (!result.error.includes('cancelled')) {
          alert('Failed to save book: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving the book.');
    }
  };

  const loadBook = async () => {
    if (!window.electronAPI) {
      // Fallback for browser mode
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target?.result as string);
              setBookDataState(data);
              setIsDirty(false);
              console.log('Book loaded (browser mode):', data.title);
            } catch (error) {
              console.error('Failed to parse file:', error);
              alert('Failed to load file. Please check the file format.');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
      return;
    }

    try {
      const result = await window.electronAPI.loadBook();
      if (result.success && result.data) {
        const data = JSON.parse(result.data);
        setBookDataState(data);
        setCurrentFilePath(result.path || null);
        setIsDirty(false);
        console.log('Book loaded (Electron):', data.title, 'from', result.path);
      } else if (result.error) {
        console.error('Load failed:', result.error);
        if (!result.error.includes('cancelled')) {
          alert('Failed to load book: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Load error:', error);
      alert('An error occurred while loading the book.');
    }
  };

  const newBook = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Create new book anyway?')) {
        const emptyBook = createEmptyBook();
        setBookDataState(emptyBook);
        setCurrentFilePath(null);
        setIsDirty(false);
        console.log('New book created');
      }
    } else {
      const emptyBook = createEmptyBook();
      setBookDataState(emptyBook);
      setCurrentFilePath(null);
      setIsDirty(false);
      console.log('New book created');
    }
  };

  return (
    <BookContext.Provider
      value={{
        bookData,
        setBookData,
        currentFilePath,
        isDirty,
        saveBook,
        loadBook,
        newBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
