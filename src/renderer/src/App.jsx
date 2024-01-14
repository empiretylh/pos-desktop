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
import AlertShowProvider from './components/custom_components/AlertProvider';
import CustomerDataProvider from './context/CustomerProvider';
import { CartContextProvider } from './components/Sales/CartContextProvier';
import ExpenseDataProvider from './context/ExpenseDataProvider';
import OtherIncomeDataProvider from './context/OtherIncomeDataProvider';
import SupplierDataProvider from './context/SupplierProvider';
import SettingDataProvider from './context/SettingContextProvider';


axios.defaults.baseURL = domainURL

const client = new QueryClient();



function App() {
  return (
    <QueryClientProvider client={client}>
      <AlertShowProvider>
        <AuthProvider>
          <SettingDataProvider>

            <CategoryDataProvider>
              <SupplierDataProvider>
                <ProductsDataProvider>
                  <ExpenseDataProvider>
                    <OtherIncomeDataProvider>
                      <CustomerDataProvider>
                        <CartContextProvider>

                          <Routes />
                        </CartContextProvider>
                      </CustomerDataProvider>
                    </OtherIncomeDataProvider>
                  </ExpenseDataProvider>
                </ProductsDataProvider>
              </SupplierDataProvider>
            </CategoryDataProvider>

          </SettingDataProvider>
        </AuthProvider>
      </AlertShowProvider>
    </QueryClientProvider>
  )
}

export default App
