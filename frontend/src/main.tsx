import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../../frontend/src/context/UserContext';
import './css/style.css';
import './css/additional-styles/custom-fonts.css';
import './css/additional-styles/theme.css';
import './css/additional-styles/utility-patterns.css';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>
);
