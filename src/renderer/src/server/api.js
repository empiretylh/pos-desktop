import axios from 'axios';


export const login = (data) => {
    return axios.post('/auth/login/', data);
}

export const register = (data) => {
    return axios.post('/auth/register/', data);
}

export const getUser = (data) => {
    return axios.get('/api/profile/', data);
}


export const getProducts = (data) => {
    return axios.get('/api/products/', data);
}

export const getCategorys = (data) => {
    return axios.get('/api/categorys/', data);
}


export const postProducts = (data) => {

    return axios
        .post('/api/products/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
};

export const postCategorys = (data) => {

    return axios
        .post('/api/categorys/', data)
}

export const putProducts = (data) => {

    return axios
        .put(`/api/products/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
}


export const putCategorys = (data) => {
    return axios.put(`/api/categorys/`, data);
}

export const deleteProducts = (data) => {
    return axios.delete(`/api/products/`, { data: { id: data.id } });
}

export const deleteCategorys = (data) => {
    return axios.delete(`/api/categorys/?id=${data.id}`);
}

export const changePrice = (data) => {
    return axios.put('/api/products/changewithperentage/', data);
}

export const getCustomer = (data) => {
    return axios.get('/api/customer/', data);
}

export const postCustomer = (data) => {
    return axios.post('/api/customer/', data);
}


export const postSales = (data) => {
    return axios.post('/api/sales/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
}

export const postExpense = (data) => {
    return axios.post('/api/expenses/', data);
}

export const getExpense = ({ queryKey }) => {
    const [_, type, time, startd, endd] = queryKey;
    return axios.get(`/api/expenses/?type=${type}&time=${time}&startd=${startd}&endd=${endd}`);

}

export const putExpense = (data) => {
    return axios.put('/api/expenses/', data);
}

export const deleteExpense = (data) => {
    return axios.delete('/api/expenses/?id=' + data.id);
}

export const postOtherIncome = (data)=>{
    return axios.post('/api/otherincome/', data);   
}

export const getOtherIncome = ({ queryKey }) => {
    const [_, type, time, startd, endd] = queryKey;
    return axios.get(`/api/otherincome/?type=${type}&time=${time}&startd=${startd}&endd=${endd}`);

}

export const putOtherIncome = (data) => {
    return axios.put('/api/otherincome/', data);
}


export const deleteOtherIncome = (data) => {
    return axios.delete('/api/otherincome/?id=' + data.id);
}


export const salesSetPayment = (data) => {
    return axios.put('/api/customer/', data);
}

export const putCustomer = (data) => {
    return axios.put('/api/customer/', data);
}

export const deleteCustomer =  (data)=>{
    return axios.delete('/api/customer/?customerid='+data.id);
}

export const deleteVoucherfromCustomer = (data)=>{
    return axios.delete('/api/customer/?customerid='+data.customerid+'&sales='+data.sales);
}

export const getSales = ({ queryKey }) => {
    const [_, type, time, startd, endd] = queryKey;
    return axios.get(`/api/sales/?type=${type}&time=${time}&startd=${startd}&endd=${endd}`);
}

export const putSales = (data) => {
    return axios.put('/api/sales/', data);
}


export const postSupplier = (data)=>{
    return axios.post('/api/supplier/', data);
}

export const getSupplier = (data)=>{
    return axios.get('/api/supplier/', data);
}

export const putSupplier = (data)=>{
    return axios.put('/api/supplier/', data);
}

export const deleteSupplier = (data)=>{
    return axios.delete('/api/supplier/?supplier_id='+data.id);
}

export const deleteProductsFromSupplier = (data)=>{
    return axios.delete('/api/supplier/?supplier_id='+data.supplier_id+'&products='+data.products);
}

export const getProfit = (data) =>{
    return axios.get('/api/profitnloss/', data);

}

export const deleteSales = (data) =>{
    return axios.delete('/api/sales/?id='+data.id);
}