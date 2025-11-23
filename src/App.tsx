import { useEffect } from 'react';
import { useStore } from './store';
import ToolGrid from './components/ToolGrid';
import FileDropZone from './components/FileDropZone';
import ToolView from './components/ToolView';
import PrivacyNotice from './components/PrivacyNotice';

function App() {
  console.log('App component rendering...');
  
  const { selectedTool } = useStore();
  console.log('Store accessed, selectedTool:', selectedTool);

  useEffect(() => {
    console.log('App mounted, selectedTool:', selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({
          immediate: true,
          onRegistered: (r: ServiceWorkerRegistration | undefined) => {
            if (r) console.log('SW Registered: ', r);
          },
          onRegisterError: (error: Error) => {
            console.log('SW registration error', error);
          },
        });
      }).catch(() => {
        // PWA plugin not available in dev mode, that's okay
      });
    }
  }, []);

  try {

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '0' }}>
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              PDF Toolkit
            </h1>
          </div>
        </div>
        
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              PDF Toolkit
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '42rem', margin: '0 auto' }}>
              100% client-side PDF tools. Your files never leave your device.
              No uploads, no tracking, no ads.
            </p>
          </div>
          
          <PrivacyNotice />
          
          {!selectedTool ? (
            <>
              <FileDropZone />
              <ToolGrid />
            </>
          ) : (
            <ToolView />
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in App render:', error);
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'red' }}>Error Loading App</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Check the browser console for more details.</p>
      </div>
    );
  }
}

export default App;
