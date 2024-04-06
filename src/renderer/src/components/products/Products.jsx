import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useCategoryData } from '../../context/CategoryDataProvider'
import { useProductsData } from '../../context/ProductsDataProvider'
import {
  deleteCategorys,
  deleteProducts,
  postCategorys,
  postProducts,
  putCategorys,
  putProducts
} from '../../server/api'
import { useAlertShow } from '../custom_components/AlertProvider'
import CustomButton from '../custom_components/CustomButton'
import Loading from '../custom_components/Loading'
import Navigation from '../custom_components/Navigation'
import numberWithCommas from '../custom_components/NumberWithCommas'
import CategoryTable from './CategoryTable'
import ChangePriceModal from './ChangePriceModal'
import ExcelImportExport from './ExcelImportExport'
import ProductTable from './ProductTable'
import ProductsByCategoryView from './ProductsByCategoryView'
import { useUserType } from '../../context/UserTypeProvider'
import { isImageServer } from '../../config/config'
const { ipcRenderer } = window.electron

const Products = () => {
  const [showtype, setShowtype] = useState('today')

  const { showConfirm, showInfo, showNoti } = useAlertShow()

  const [loading, setLoading] = useState(false)

  const [selected, setSelected] = useState('Products')

  const [searchtext, setSearchtext] = useState('')
  const [sortby, setSortBy] = useState('none')

  const { t } = useTranslation()

  const { product_data, data } = useProductsData()
  const { category_data, data: category } = useCategoryData()

  const { isAdmin } = useUserType()

  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedRow_category, setSelectedRow_category] = useState(null)

  const inputRef = useRef()
  const searchRef = useRef()
  const productform = useRef()
  const categoryform = useRef()

  const PostProduct = useMutation(postProducts, {
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      setLoading(false)
      showNoti('Product Added Successfully')
      product_data.refetch()
      clearProductForm();
    },
    onError: () => {
      setLoading(false)
      showNoti('Error Occured', 'bi bi-x-circle-fill text-red-500')
    }
  })

  const PostCategory = useMutation(postCategorys, {
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      setLoading(false)
      showNoti('Category Added Successfully')
      category_data.refetch()
      clearCategoryForm();
    },
    onError: () => {
      setLoading(false)
      showNoti('Error Occured', 'bi bi-x-circle-fill text-red-500')
    }
  })

  const DeleteProduct = useMutation(deleteProducts, {
    onMutate: () => {
      setLoading(true)
      clearProductForm()
    },
    onSuccess: () => {
      setLoading(false)
      product_data.refetch()
      showNoti('Product Deleted Successfully')
    },
    onError: () => {
      setLoading(false)
      showNoti('Error Occured', 'bi bi-x-circle-fill text-red-500')
    }
  })

  const DeleteCategory = useMutation(deleteCategorys, {
    onMutate: () => {
      setLoading(true)
      clearCategoryForm()
    },
    onSuccess: () => {
      setLoading(false)
      category_data.refetch()
      showNoti('Category Deleted Successfully')
    },
    onError: () => {
      setLoading(false)
      showNoti('Error Occured', 'bi bi-x-circle-fill text-red-500')
    }
  })

  const PutProduct = useMutation(putProducts, {
    onMutate: () => {
      setLoading(true)
      clearProductForm()
    },
    onSuccess: () => {
      setLoading(false)
      product_data.refetch()
      showNoti('Product Updated Successfully')
    },
    onError: () => {
      setLoading(false)
      showNoti('Error Occured', 'bi bi-x-circle-fill text-red-500')
    }
  })

  const PutCategory = useMutation(putCategorys, {
    onMutate: () => {
      setLoading(true)
      clearCategoryForm()
    },
    onSuccess: () => {
      setLoading(false)
      category_data.refetch()
      showNoti('Category Updated Successfully')
    },
    onError: () => {
      setLoading(false)
      showNoti('Error Occured', 'bi bi-x-circle-fill text-red-500')
    }
  })

  const ProductSubmit = (e) => {
    e.preventDefault()

    //if selectedRow is not null putproduct else postproduct
    if (selectedRow?.id) {
      //selectedRow remove pic
      if(!isImageServer) delete selectedRow.pic

      if(selectedRow.price && selectedRow.price.includes(',')){

        let price = selectedRow.price.slice(0, selectedRow.price.indexOf(','));
        let extraprice = selectedRow.price.slice(selectedRow.price.indexOf(',') + 1, selectedRow.price.length);

        selectedRow.price = price;
        selectedRow.extraprice = extraprice;
      }


      return PutProduct.mutate(selectedRow)
    }

    const form = e.target

    let formData = {
      name: form.name.value,
      category: form.category.value,
      barcode: form.barcode.value,
      price: form.price.value,
      cost: isAdmin ? form.cost.value : 0,
      qty: form.qty.value,
      supplier_name: form.supplier.value,
      expiry_date: form.expire.value,
      description: form.description.value,
      pic: form.pic.files[0],
      extraprice:0
    }

    if(!isAdmin){
        formData.cost = 0;
        formData.description = '#cashier \n' + formData.description; 
    }

    if(form.price.value.includes(',')){
  
      let price = form.price.value.slice(0, form.price.value.indexOf(','));
      let extraprice = form.price.value.slice(form.price.value.indexOf(',') + 1, form.price.value.length);
      
      formData.price = price;
      formData.extraprice = extraprice;      
    
    }else{
      formData.price = form.price.value;
      formData.extraprice = [];
    }


    let data = {}

    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data[key] = formData[key]
      }
    }

    
    PostProduct.mutate(data)

    clearProductForm();

    form.reset()
  }

  const CategorySubmit = (e) => {
    e.preventDefault()

    if (selectedRow_category?.id) {
      return PutCategory.mutate(selectedRow_category)
    }

    const form = e.target

    let formData = {
      title: form.title.value
    }

    let data = {}

    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data[key] = formData[key]
      }
    }

    PostCategory.mutate(data)

    form.reset()
  }

  const productRowClick_Update = (item) => {
    if (!isAdmin) return
    productform.current.reset()
    let newitem = { ...item }
    if(item.price && item.extraprice.length > 0){
      newitem.price =  item.price + ','+ item?.extraprice.map(e => e.extraprice)
    }
    setSelectedRow(newitem)
    inputRef.current.focus()
    //selectall text input
    inputRef.current.select()
  }

  const categoryRowClick_Update = (item) => {
    setSelectedRow_category(item)
    inputRef.current.select()
  }

  const handleChange = (value, name) => {
    setSelectedRow({ ...selectedRow, [name]: value })
  }

  const clearProductForm = () => {
    setSelectedRow(null)
    productform.current.reset()
  }

  const clearCategoryForm = () => {
    setSelectedRow_category(null)
    categoryform.current.reset()
  }

  const computeProductBalance = useMemo(() => {
    if (data.length) {
      const total = data.reduce((a, b) => a + b.cost * b.qty, 0)
      return total
    }
  }, [data])

  const handleCategoryChange = (value, name) => {
    setSelectedRow_category({ ...selectedRow_category, [name]: value })
  }

  const [showExcelImport, setShowExcelImport] = useState(false)
  const [showChangePirce, setShowChangePrice] = useState(false)

  const DeleteProductButton = () => {
    if (!isAdmin) return
    if (selectedRow?.id) {
      showConfirm('Delete Product', 'Are you sure to delete this product ? ', () => {
        DeleteProduct.mutate({
          id: selectedRow?.id
        })
      })
    }
  }

  const DeleteCategoryButton = () => {
    if (!isAdmin) {
      return
    }
    if (selectedRow_category?.id) {
      showConfirm(
        'Delete Category',
        'Are you sure to delete this category ? if you delete this their related products will also deleted. ',
        () => {
          DeleteCategory.mutate({
            id: selectedRow_category?.id
          })
        }
      )
    }
  }

  //pres ctrl delete to call deleteproductbutton
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Delete') {
        DeleteProductButton()
        DeleteCategoryButton()
      }
      if (e.altKey && e.key === 'Delete') {
        clearProductForm()
        clearCategoryForm()
      }

      if (e.altKey && e.key === 'p') {
        setSelected('Products')
        inputRef.current.focus()
      }

      if (e.altKey && e.key === 'c') {
        setSelected('Category')
        inputRef.current.focus()
      }

      if (e.altKey && e.key === 'e') {
        setShowExcelImport(true)
      }

      if (e.altKey && e.key === 'r') {
        setShowChangePrice(true)
      }

      if (e.altKey && e.key === 'f') {
        searchRef.current.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedRow])

  return (
    <div className="flex flex-row h-screen">
      <Navigation />
      <Loading show={loading} />
      <div className="bg-white font-sans h-full w-full p-3 overflow-auto">
        <div
          className="flex flex-row items-center sticky bg-white "
          style={{
            top: -10
          }}
        >
          <i className="bi bi-bag text-2xl mr-2"></i>
          <h1 className="text-2xl font-bold">{t('Products')}</h1>

          <div className="flex flex-row w-full justify-center items-center">
            <CustomButton
              onClick={() => {
                setSelected('Products')
                inputRef.current.focus()
              }}
              text={t('Add_Product')}
              icon={'bi bi-bag-plus mr-3 text-2xl'}
              textcolor="text-white mr-3"
            />
            <CustomButton
              onClick={() => {
                setSelected('Category')
                inputRef.current.focus()
              }}
              text={t('Add_Category')}
              icon={'bi bi-bookmark-plus mr-3 text-2xl'}
              textcolor="text-white mr-3"
            />
            <CustomButton
              onClick={() => {
                setShowExcelImport(true)
              }}
              text={t('Excel Export/Import')}
              icon={'bi bi-table mr-3 text-2xl'}
              textcolor="text-white mr-3"
            />
            {isAdmin && (
              <CustomButton
                onClick={() => {
                  setShowChangePrice(true)
                }}
                text={t('Change Price')}
                icon={'bi bi-percent mr-3 text-2xl'}
                textcolor="text-white mr-3"
              />
            )}
          </div>
          <h1 className="text-lg font-bold text-right" style={{ width: 180 }}>
            {numberWithCommas(computeProductBalance)} MMK
          </h1>
        </div>

        {/*Search Bar */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="col-span-1 border p-2">
            {selected == 'Products' ? (
              <form
                ref={productform}
                className="flex flex-col overflow-x-hidden overflow-y-auto"
                onSubmit={ProductSubmit}
              >
                <div className="flex flex-row">
                  <label className="text-xl text-black font-bold ">{t('Products')}</label>

                  {/* Clear icon */}
                  <div
                    onClick={clearProductForm}
                    className="select-none ml-auto cursor-pointer bg-red-500 rounded-md px-2 text-white flex flex-row items-center"
                  >
                    <i
                      onClick={clearProductForm}
                      className="bi bi-x text-2xl text-white cursor-pointer"
                    ></i>
                    <label>Clear</label>
                  </div>
                </div>
                <label className="text-sm text-black font-bold mt-3">{t('ProductName')}</label>
                <input
                  value={selectedRow?.name}
                  onChange={(e) => handleChange(e.target.value, e.target.id)}
                  ref={inputRef}
                  type="text"
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('ProductName')}
                  required
                  id="name"
                />

                <label className="text-sm text-black font-bold mt-1">{t('Barcode')}</label>
                <input
                  value={selectedRow?.barcode}
                  onChange={(e) => handleChange(e.target.value, e.target.id)}
                  type="number"
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('Barcode')}
                  id="barcode"
                />

                <label className="text-sm text-black font-bold mt-1">{t('Category')}</label>
                <select
                  value={selectedRow?.category}
                  onChange={(e) => handleChange(e.target.value, e.target.id)}
                  className="border border-gray-300 rounded-md w-full p-2 mr-3 my-1"
                  required
                  id="category"
                >
                  {category.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>

                {/* qty, price , cost , supplier name*/}
                <label className="text-sm text-black font-bold mt-1">{t('Quantity')}</label>
                <input
                  value={selectedRow?.qty}
                  onChange={(e) => handleChange(e.target.value, e.target.id)}
                  type="number"
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('Quantity')}
                  required
                  id="qty"
                />

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="text-sm text-black font-bold mt-1">{t('Price4')}</label>
                    <input
                      value={selectedRow?.price}
                      onChange={(e) => handleChange(e.target.value, e.target.id)}
                      type="text"
                      className="border border-gray-300 rounded-md w-full p-2 my-1"
                      placeholder={t('Price4')}
                      required
                      id="price"
                    />
                  </div>

                  {isAdmin && (
                    <div className="flex-1">
                      <label className="text-sm text-black font-bold mt-1">{t('Price5')}</label>
                      <input
                        value={selectedRow?.cost}
                        onChange={(e) => handleChange(e.target.value, e.target.id)}
                        type="number"
                        className="border border-gray-300 rounded-md w-full p-2 my-1"
                        placeholder={t('Price5')}
                        required
                        id="cost"
                      />
                    </div>
                  )}
                </div>
                {selectedRow?.id ? null : (
                  <>
                    <label className="text-sm text-black font-bold mt-1">
                      {t('Supplier_Name')}
                    </label>
                    <input
                      type="text"
                      value={selectedRow?.supplier}
                      onChange={(e) => handleChange(e.target.value, e.target.id)}
                      className="border border-gray-300 rounded-md w-full p-2  my-1"
                      placeholder={t('Supplier_Name')}
                      id="supplier"
                    />
                  </>
                )}
                {/*Expire Date */}
                <label className="text-sm text-black font-bold mt-1">{t('Expire_Date')}</label>
                <input
                  type="date"
                  value={selectedRow?.expiry_date}
                  onChange={(e) => handleChange(e.target.value, 'expiry_date')}
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('Expire_Date')}
                  id="expire"
                />

                {/* Description */}
                <label className="text-sm text-black font-bold mt-1">{t('Description')}</label>
                <input
                  type="text"
                  value={selectedRow?.description == 'undefined' ? '' : selectedRow?.description}
                  onChange={(e) => handleChange(e.target.value, e.target.id)}
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('Description')}
                  id="description"
                />

                {isImageServer ?
                <>
                <label className="text-sm text-black font-bold mt-1">{t('Image')}</label>
                <input
                  type="file"
                  onChange={(e) => {
                    handleChange(e.target.files[0], e.target.id)
                  }
                  }
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('Image')}
                  id="pic"
                />
                </>
                
              :null}

                <button
                  type="submit"
                  className={`${
                    selectedRow?.id
                      ? 'bg-green-800 hover:bg-green-900'
                      : 'bg-primary hover:bg-cyan-800   '
                  } text-white font-bold rounded-md w-full p-2 mr-3 mt-1 flex flex-row items-center justify-center`}
                >
                  {/* add icon and edit icon  */}
                  <i
                    className={`bi ${
                      selectedRow?.id ? 'bi-pencil-square' : 'bi-plus-square'
                    } text-white mr-2`}
                  ></i>

                  {t(selectedRow?.id ? 'Edit_Product' : 'Add_Product')}
                </button>

                {selectedRow?.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      DeleteProductButton()
                    }}
                    className="bg-red-500  hover:bg-red-700 text-white font-bold rounded-md w-full p-2 mr-3 mt-1 flex flex-row items-center justify-center"
                  >
                    {/* trash icon */}
                    <i className="bi bi-trash text-white mr-2"></i>
                    {t('Delete_Product')}
                  </button>
                ) : null}
              </form>
            ) : (
              <form
                ref={categoryform}
                onSubmit={CategorySubmit}
                className="flex flex-col overflow-x-hidden overflow-y-auto"
              >
                <div className="flex flex-row">
                  <label className="text-xl text-black font-bold ">{t('Category')}</label>

                  {/* Clear icon */}
                  <div
                    onClick={clearCategoryForm}
                    className="select-none ml-auto cursor-pointer bg-red-500 rounded-md px-2 text-white flex flex-row items-center"
                  >
                    <i
                      onClick={clearCategoryForm}
                      className="bi bi-x text-2xl text-white cursor-pointer"
                    ></i>
                    <label>Clear</label>
                  </div>
                </div>
                <label className="text-sm text-black font-bold">{t('Category')}</label>
                <input
                  id="title"
                  value={selectedRow_category?.title}
                  onChange={(e) => handleCategoryChange(e.target.value, e.target.id)}
                  type="text"
                  ref={inputRef}
                  className="border border-gray-300 rounded-md w-full p-2  my-1"
                  placeholder={t('Category')}
                  required
                />

                <button
                  type="submit"
                  className={`${
                    selectedRow_category?.id && isAdmin
                      ? 'bg-green-800 hover:bg-green-900'
                      : 'bg-primary hover:bg-cyan-800   '
                  } text-white font-bold rounded-md w-full p-2 mr-3 mt-1 flex flex-row items-center justify-center`}
                >
                  {/* add icon and edit icon  */}
                  <i
                    className={`bi ${
                      selectedRow_category?.id && isAdmin ? 'bi-pencil-square' : 'bi-plus-square'
                    } text-white mr-2`}
                  ></i>

                  {t(selectedRow_category?.id && isAdmin ? 'Update' : 'Add_Category')}
                </button>

                {selectedRow_category?.id && isAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      DeleteCategoryButton()
                    }}
                    className="bg-red-500  hover:bg-red-700 text-white font-bold rounded-md w-full p-2 mr-3 mt-1 flex flex-row items-center justify-center"
                  >
                    {/* trash icon */}
                    <i className="bi bi-trash text-white mr-2"></i>
                    {t('Delete_Product')}
                  </button>
                ) : null}

                {selectedRow_category?.id ? (
                  <ProductsByCategoryView category_id={selectedRow_category?.id} />
                ) : null}
              </form>
            )}
          </div>
          <div className="col-span-2 border p-2">
            <div className="flex flex-row items-center mt-3 w-full">
              <icon className="bi bi-search text-2xl text-gray-400 mr-2"></icon>
              <input
                type="text"
                ref={searchRef}
                className="border border-gray-300 rounded-md w-full p-2 mr-3"
                placeholder={t('Search Products')}
                onChange={(e) => setSearchtext(e.target.value)}
              />
            </div>

            <div>
              {/* 2 tab Sales and Category if selected fill color */}
              <div className="flex flex-row items-center mt-3">
                <button
                  className={`border border-gray-300 ${
                    selected == 'Products' ? 'bg-primary text-white font-bold' : ''
                  } rounded-md w-1/2 p-2 mr-3`}
                  onClick={() => {
                    setSelected('Products')
                  }}
                >
                  {t('Products')}
                </button>
                <button
                  onClick={() => {
                    setSelected('Category')
                  }}
                  className={`border border-gray-300 ${
                    selected == 'Category' ? 'bg-primary text-white font-bold' : ''
                  } rounded-md w-1/2 p-2 mr-3`}
                >
                  {t('Category')}
                </button>
                {/* Sort with select -option */}
                <h1 className="mx-2 w-[100px]">{t('Sort By :')}</h1>
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md w-[200px] p-2 mr-3"
                >
                  {selected == 'Products' ? (
                    <>
                      <option value="name">{t('Name')}</option>
                      <option value="price">{t('Price4')}</option>
                      <option value="cost">{t('Price5')}</option>
                      <option value="qty">{t('Quantity')}</option>
                      <option value="expire">{t('Expire Date')}</option>
                    </>
                  ) : (
                    <>
                      <option value="name">{t('Name')}</option>
                      <option value="products">{t('Products')}</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Table */}
            {selected == 'Products' ? (
              <ProductTable
                data={data}
                searchtext={searchtext}
                sortby={sortby}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                rowDoubleClick={productRowClick_Update}
              />
            ) : (
              <CategoryTable
                data={category}
                searchtext={searchtext}
                sortby={sortby}
                selectedRow={selectedRow_category}
                setSelectedRow={setSelectedRow_category}
                rowDoubleClick={categoryRowClick_Update}
              />
            )}
          </div>
        </div>
      </div>
      <ExcelImportExport show={showExcelImport} setShow={setShowExcelImport} />
      <ChangePriceModal show={showChangePirce} setShow={setShowChangePrice} />
    </div>
  )
}

export default Products
