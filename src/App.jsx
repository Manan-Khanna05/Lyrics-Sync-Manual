import React, { useReducer, useEffect } from 'react';
import AudioUpload from './components/AudioUpload';
import LyricsInput from './components/LyricsInput';
import SyncEditor from './components/SyncEditor';
import Player from './components/Player';
import { saveProject, loadProject } from './utils/storage';

const initialState = {
  audioFile: null,
  audioURL: null,
  lyrics: '',
  syncedLyrics: [],
  mode: 'upload',
  history: [],
  historyIndex: -1,
  settings: {
    theme: 'dark',
    autoScroll: true,
    karaoke: false,
    playbackSpeed: 1.0
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUDIO':
      return { 
        ...state, 
        audioFile: action.payload.file, 
        audioURL: action.payload.url 
      };
    
    case 'SET_LYRICS':
      return { ...state, lyrics: action.payload };
    
    case 'SET_SYNCED_LYRICS':
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1), 
        action.payload
      ];
      return { 
        ...state, 
        syncedLyrics: action.payload,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    
    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          syncedLyrics: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1
        };
      }
      return state;
    
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          syncedLyrics: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1
        };
      }
      return state;
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    case 'LOAD_PROJECT':
      return { ...state, ...action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const lastProject = loadProject();
    if (lastProject) {
      const autoLoad = window.confirm('Load last saved project?');
      if (autoLoad) {
        dispatch({ type: 'LOAD_PROJECT', payload: lastProject });
      }
    }
  }, []);

  const handleSaveProject = () => {
    const project = {
      lyrics: state.lyrics,
      syncedLyrics: state.syncedLyrics,
      settings: state.settings,
      mode: state.mode
    };
    saveProject(project);
    alert('✅ Project saved successfully!');
  };

  const handleLoadProject = () => {
    const project = loadProject();
    if (project) {
      dispatch({ type: 'LOAD_PROJECT', payload: project });
      alert('✅ Project loaded successfully!');
    } else {
      alert('❌ No saved project found!');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? All unsaved data will be lost.')) {
      dispatch({ type: 'RESET' });
      localStorage.removeItem('lyrics_sync_project');
    }
  };

  return (
    <div className={`app theme-${state.settings.theme}`}>
      <header className="app-header">
        <h1>🎵 Lyrics Sync Studio</h1>
        <div className="header-controls">
          <button onClick={handleSaveProject} className="btn-primary">
            💾 Save
          </button>
          <button onClick={handleLoadProject} className="btn-secondary">
            📂 Load
          </button>
          <button 
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex <= 0}
            className="btn-icon"
          >
            ↶ Undo
          </button>
          <button 
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex >= state.history.length - 1}
            className="btn-icon"
          >
            ↷ Redo
          </button>
          <button onClick={handleReset} className="btn-danger">
            🗑️ Reset
          </button>
        </div>
      </header>

      <nav className="mode-tabs">
        <button 
          className={state.mode === 'upload' ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'upload' })}
        >
          1. Upload Audio
        </button>
        <button 
          className={state.mode === 'input' ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'input' })}
          disabled={!state.audioFile}
        >
          2. Input Lyrics
        </button>
        <button 
          className={state.mode === 'sync' ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'sync' })}
          disabled={!state.audioFile || !state.lyrics}
        >
          3. Sync Lyrics
        </button>
        <button 
          className={state.mode === 'play' ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_MODE', payload: 'play' })}
          disabled={state.syncedLyrics.length === 0}
        >
          4. Play
        </button>
      </nav>

      <main className="app-main">
        {state.mode === 'upload' && (
          <AudioUpload 
            onUpload={(file, url) => {
              dispatch({ type: 'SET_AUDIO', payload: { file, url } });
              dispatch({ type: 'SET_MODE', payload: 'input' });
            }}
          />
        )}

        {state.mode === 'input' && (
          <LyricsInput 
            lyrics={state.lyrics}
            onLyricsChange={(lyrics) => dispatch({ type: 'SET_LYRICS', payload: lyrics })}
            onNext={() => dispatch({ type: 'SET_MODE', payload: 'sync' })}
            onBack={() => dispatch({ type: 'SET_MODE', payload: 'upload' })}
          />
        )}

        {state.mode === 'sync' && (
          <SyncEditor 
            audioURL={state.audioURL}
            lyrics={state.lyrics}
            syncedLyrics={state.syncedLyrics}
            onSyncUpdate={(synced) => dispatch({ type: 'SET_SYNCED_LYRICS', payload: synced })}
            onComplete={() => dispatch({ type: 'SET_MODE', payload: 'play' })}
            onBack={() => dispatch({ type: 'SET_MODE', payload: 'input' })}
          />
        )}

        {state.mode === 'play' && (
          <Player 
            audioURL={state.audioURL}
            syncedLyrics={state.syncedLyrics}
            settings={state.settings}
            onSettingsChange={(settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings })}
            onEdit={() => dispatch({ type: 'SET_MODE', payload: 'sync' })}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ | Lyrics Sync Studio v1.0</p>
      </footer>
    </div>
  );
}

export default App;