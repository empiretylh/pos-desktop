import Versions from './components/Versions'
import icons from './assets/icons.svg'
import { QueryClient, QueryClientProvider } from 'react-query'
import AuthProvider from './context/AuthContextProvider';
import Routes from './route/route';
import axios from 'axios';
import { domainURL } from './config/config';

import 'bootstrap-icons/font/bootstrap-icons.css';


axios.defaults.baseURL = domainURL

const client = new  QueryClient();



function App() {
  return (
   <QueryClientProvider client={client}>
    <AuthProvider>
      <Routes/>
    </AuthProvider>
   </QueryClientProvider>
  )
}

export default App
