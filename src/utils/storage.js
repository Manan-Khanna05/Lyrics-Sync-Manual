const PROJECT_KEY = 'lyrics_sync_project';

// Save project to localStorage
export function saveProject(project) {
  try {
    const projectJSON = JSON.stringify(project);
    localStorage.setItem(PROJECT_KEY, projectJSON);
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
}

// Load project from localStorage
export function loadProject() {
  try {
    const projectJSON = localStorage.getItem(PROJECT_KEY);
    if (projectJSON) {
      return JSON.parse(projectJSON);
    }
    return null;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

// Clear saved project
export function clearProject() {
  try {
    localStorage.removeItem(PROJECT_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing project:', error);
    return false;
  }
}  

// Export project as JSON file
export function exportProjectFile(project) {
  try {
    const projectJSON = JSON.stringify(project, null, 2);
    const blob = new Blob([projectJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyrics-sync-project-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting project:', error);
    return false;
  }
}

// Import project from JSON file
export function importProjectFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const project = JSON.parse(event.target.result);
        resolve(project);
      } catch (error) {
        reject(new Error('Invalid project file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

// Check if project exists in storage
export function hasStoredProject() {
  return localStorage.getItem(PROJECT_KEY) !== null;
}

// Get storage size
export function getStorageSize() {
  const projectJSON = localStorage.getItem(PROJECT_KEY);
  if (projectJSON) {
    return new Blob([projectJSON]).size;
  }
  return 0;
}