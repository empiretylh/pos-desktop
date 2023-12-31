import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategoryData } from '../../context/CategoryDataProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
import { useAlertShow } from '../custom_components/AlertProvider';
import Loading from '../custom_components/Loading';
import Navigation from '../custom_components/Navigation';
import ProductTable from './ProductTable';
import SalesForm from './SalesForm';
import CategorySelect from './CategorySelect';
import { CartContextProvider, useCart } from './CartContextProvier';
import ProductCard from './ProductCard';

const Sales = () => {

    const [showtype, setShowtype] = useState('today');

    const { showConfirm, showInfo, showNoti } = useAlertShow();

    const [isImageView, setIsImageView] = useState(false);

    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState('Products');

    const [searchtext, setSearchtext] = useState('');
    const [sortby, setSortBy] = useState('none');

    const { t } = useTranslation();

    const { product_data, data } = useProductsData();
    const { category_data, data: category } = useCategoryData();

    const [selectedProduct, setSelectetProduct] = useState(null);
    const [selectedRow_category, setSelectedRow_category] = useState(null);


    const { addToCart, removeFromCart, clearCart, cart } = useCart();

    const inputRef = useRef();
    const salesForm = useRef();


    const productRowClick_Update = (item) => {
        salesForm.current.reset();
        setSelectedRow(item);
        inputRef.current.focus();
        //selectall text input
        inputRef.current.select();
    }


    const [selectedCategory, setSelectedCategory] = useState("All");
    const searchref = useRef();

    //if user press alt + f then focus on search input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === 'f') {
                searchref.current.focus();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <Loading show={loading} />
            <div className="bg-white font-sans h-full w-full p-3 overflow-auto">
                {/* <div className="flex flex-row items-center sticky bg-white " style={{
                    top: -10,
                }}>
                    <i className='bi bi-cart text-2xl mr-2'></i>
                    <h1 className='text-2xl font-bold'>{t('Sales')}</h1>
                </div> */}

                {/*Search Bar */}
                <div className='grid grid-cols-3 gap-3'>

                    <div className="col-span-2 border p-2">
                        <div className="flex flex-row items-center mt-3 w-full">
                            <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
                            <input
                                ref={searchref}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addToCart(selectedProduct);
                                    }

                                }}
                                type="text" className="border border-gray-300 rounded-md w-full p-2 mr-3" placeholder={t('Search Products')} onChange={(e) => setSearchtext(e.target.value)} />

                            <h1 className='mx-2 w-[150px]'>{t('Sort By :')}</h1>
                            <select
                                tabIndex={-1}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-md w-[200px] p-2 mr-3">
                                {
                                    selected == 'Products' ?
                                        <>
                                            <option value="name">{t('Name')}</option>
                                            <option value="price">{t('Price4')}</option>
                                            <option value="cost">{t('Price5')}</option>
                                            <option value="qty">{t('Quantity')}</option>
                                            <option value="expire">{t('Expire Date')}</option>
                                        </>
                                        :
                                        <>
                                            <option value="name">{t('Name')}</option>
                                            <option value="products">{t('Products')}</option>
                                        </>
                                }
                            </select>
                            <button
                                onClick={() => {
                                    setIsImageView(prev => !prev)
                                }
                                }
                                className="border border-gray-300 rounded-md w-[100px] p-2 mr-3">
                                {isImageView ?
                                    <i className="bi bi-list text-md"></i>
                                    : <i className="bi bi-image text-md"></i>}
                            </button>
                        </div>

                        <div>
                            <CategorySelect selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        </div>

                        {/* Table */}
                        {isImageView ?
                            <ProductCard
                                data={data}
                                searchtext={searchtext}
                                sortby={sortby}
                                selectedProduct={selectedProduct}
                                setSelectProduct={setSelectetProduct}
                                rowDoubleClick={productRowClick_Update}
                                selectedCategory={selectedCategory}
                            />
                            : <ProductTable
                                data={data}
                                searchtext={searchtext}
                                sortby={sortby}
                                selectedProduct={selectedProduct}
                                setSelectProduct={setSelectetProduct}
                                rowDoubleClick={productRowClick_Update}
                                selectedCategory={selectedCategory}
                            />}
                    </div>
                    <div className="col-span-1 border p-2">

                        <SalesForm />
                    </div>

                </div>

            </div>
        </div >
    )
}

export default Sales;