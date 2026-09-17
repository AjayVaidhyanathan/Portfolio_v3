import '@fontsource-variable/schibsted-grotesk';
import './shared/base.css';
import './shared/work.css';
import './shared/capabilities.css';
import './shared/chat.css';
import './shared/faq.css';
import './main/main.css';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
