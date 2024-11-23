import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";
import store from './Redux_Components/Store/store.mjs';
import { LoadingProvider } from './Context_API/LoadingContext.jsx';
import { ConfidentialProvider } from './Context_API/Confidential.jsx';
import { SideBarProvider } from './Context_API/SideBarActivation.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <LoadingProvider>
      <SideBarProvider>
        <ConfidentialProvider>
          <App />
        </ConfidentialProvider>
      </SideBarProvider>
    </LoadingProvider>
  </Provider>
)
