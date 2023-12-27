import React, { useState } from 'react'
import axios from 'axios';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useProductsData } from '../../context/ProductsDataProvider';
const ExcelImportExport = ({ show, setShow }) => {

    const [excelFile, setExcelFile] = useState(null);

    const { showNoti } = useAlertShow();
    const { product_data, data } = useProductsData();

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        setExcelFile(file);
    }


    const handleExcelImport = async () => {


        let data = new FormData();

        data.append('file', excelFile);

        axios
            .post('/api/excelproductreport/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(res => {
                showNoti("Successfully Uploaded Excel File");
                product_data.refetch();
                setShow(false);
            })
            .catch(err => {
                showNoti("Failed to Upload Excel File", 'bi bi-x-circle-fill text-red-500')
                setShow(false);
            });

    };

    const handleExcelDownload = async () => {
        axios
            .get('/api/excelproductreport/', {
                responseType: 'blob',
            })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'products.xlsx');
                document.body.appendChild(link);
                link.click();
                showNoti("Successfully Downloaded Excel File");
            })
            .catch(err => {
                showNoti("Failed to Download Excel File", 'bi bi-x-circle-fill text-red-500')
                setShow(false);
            });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setShow(false);
        }
    })


    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center scale-0 duration-300 ${show ? 'scale-100' : ''}`}>
            <div className="bg-white rounded-lg w-1/2">
                <div className="flex justify-between items-center p-2">
                    <h1 className="text-xl font-bold">Excel Import/Export</h1>
                    <button className="text-red-500 p-3" onClick={() => setShow(false)}>X</button>
                </div>
                <div className="grid grid-cols-2 h-full p-2">
                    <div className="p-2 flex flex-col">
                        <h1 className="text-xl font-bold">Import Products With Excel</h1>
                        <p className="text-gray-500">Select excel file that contains products' information.</p>
                        <input
                            type="file"
                            onChange={handleImportExcel}
                            style={{ display: 'none' }}
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <i className="bi bi-folder"></i>
                            <span>Choose Excel File</span>
                        </label>
                        {excelFile && (
                            <button
                                className="bg-green-700 text-white font-bold p-2 rounded-lg mt-2"
                                onClick={handleExcelImport}
                            >
                                <i className="bi bi-file-earmark-arrow-up"></i>
                                <span>Upload{' '}<em>{excelFile.name}</em></span>
                            </button>
                        )}
                    </div>
                    <div className="p-2 flex flex-col">
                        <h1 className="text-xl font-bold">Export Products With Excel</h1>
                        <p className="text-gray-500">Export exisiting products with spreadsheet excel format.</p>
                        <div
                           onClick={handleExcelDownload}
                            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <i className="bi bi-file-earmark-arrow-down"></i>
                            <span>Download Excel File</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExcelImportExport;