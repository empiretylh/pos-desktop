import Versions from './components/Versions'
import icons from './assets/icons.svg'
import { QueryClient, QueryClientProvider } from 'react-query'
import AuthProvider from './context/AuthContextProvider';
import Routes from './route/route';
import axios from 'axios';
import { domainURL } from './config/config';
import './assets/i18n/i18n';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProductsDataProvider from './context/ProductsDataProvider';
import CategoryDataProvider from './context/CategoryDataProvider';


axios.defaults.baseURL = domainURL

const client = new QueryClient();



function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <CategoryDataProvider>
          <ProductsDataProvider>
            <Routes />
          </ProductsDataProvider>
        </CategoryDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
