import axios from 'axios';

const getTokenLocalStorage = () => {
    const token = localStorage.getItem('token');
    if (token === null) {
        return null;
    }else{
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    }

    return token;
}


export const login = (data) => {
    getTokenLocalStorage();
    return axios.post('/auth/login/', data);
}

export const register = (data) => {
    getTokenLocalStorage();
    return axios.post('/auth/register/', data);
}

export const getUser = (data) => {
    getTokenLocalStorage();
    return axios.get('/api/profile/', data);
}


export const getProducts = (data) => {
    getTokenLocalStorage();
    return axios.get('/api/products/', data);
}

export const getCategorys = (data) => {
    getTokenLocalStorage();
    return axios.get('/api/categorys/', data);
}


export const postProducts = (data) => {
    getTokenLocalStorage();
    return axios
        .post('/api/products/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
};

export const postCategorys = (data) => {
    getTokenLocalStorage();
    return axios
        .post('/api/categorys/', data)
}

export const putProducts = (data) => {
    getTokenLocalStorage();
    return axios
        .put(`/api/products/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
}


export const putCategorys = (data) => {
    getTokenLocalStorage();
    return axios.put(`/api/categorys/`, data);
}

export const deleteProducts = (data) => {
    getTokenLocalStorage();
    return axios.delete(`/api/products/`, { data: { id: data.id } });
}

export const deleteCategorys = (data) => {
    getTokenLocalStorage();
    return axios.delete(`/api/categorys/?id=${data.id}`);
}

export const changePrice = (data) => {
    getTokenLocalStorage();
    return axios.put('/api/products/changewithperentage/', data);
}

export const getCustomer = (data) => {
    getTokenLocalStorage();
    return axios.get('/api/customer/', data);
}

export const postCustomer = (data) => {
    getTokenLocalStorage();
    return axios.post('/api/customer/', data);

}


export const postSales = (data) => {
    getTokenLocalStorage();
    return axios.post('/api/sales/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
}

export const postExpense = (data) => {
    getTokenLocalStorage();
    return axios.post('/api/expenses/', data);
}

export const getExpense = ({ queryKey }) => {
    getTokenLocalStorage();
    const [_, type, time, startd, endd] = queryKey;
    return axios.get(`/api/expenses/?type=${type}&time=${time}&startd=${startd}&endd=${endd}`);

}

export const putExpense = (data) => {
    getTokenLocalStorage();
    return axios.put('/api/expenses/', data);
}

export const deleteExpense = (data) => {
    getTokenLocalStorage();
    return axios.delete('/api/expenses/?id=' + data.id);
}

export const postOtherIncome = (data)=>{
    getTokenLocalStorage();
    return axios.post('/api/otherincome/', data);   
}

export const getOtherIncome = ({ queryKey }) => {
    const [_, type, time, startd, endd] = queryKey;
    getTokenLocalStorage();
    return axios.get(`/api/otherincome/?type=${type}&time=${time}&startd=${startd}&endd=${endd}`);

}

export const putOtherIncome = (data) => {
    getTokenLocalStorage();
    return axios.put('/api/otherincome/', data);
}


export const deleteOtherIncome = (data) => {
    getTokenLocalStorage();
    return axios.delete('/api/otherincome/?id=' + data.id);
}


export const salesSetPayment = (data) => {
    getTokenLocalStorage();
    return axios.put('/api/customer/', data);
}

export const putCustomer = (data) => {
    getTokenLocalStorage();
    return axios.put('/api/customer/', data);
}

export const deleteCustomer =  (data)=>{
    getTokenLocalStorage();
    return axios.delete('/api/customer/?customerid='+data.id);
}

export const deleteVoucherfromCustomer = (data)=>{
    getTokenLocalStorage();
    return axios.delete('/api/customer/?customerid='+data.customerid+'&sales='+data.sales);
}

export const getSales = ({ queryKey }) => {
    const [_, type, time, startd, endd] = queryKey;
    getTokenLocalStorage();
    return axios.get(`/api/sales/?type=${type}&time=${time}&startd=${startd}&endd=${endd}`);
}

export const putSales = (data) => {
    getTokenLocalStorage();
    return axios.put('/api/sales/', data);
}


export const postSupplier = (data)=>{
    getTokenLocalStorage();
    return axios.post('/api/supplier/', data);
}

export const getSupplier = (data)=>{
    getTokenLocalStorage();
    return axios.get('/api/supplier/', data);
}

export const putSupplier = (data)=>{
    getTokenLocalStorage();
    return axios.put('/api/supplier/', data);
}

export const deleteSupplier = (data)=>{
    getTokenLocalStorage();
    return axios.delete('/api/supplier/?supplier_id='+data.id);
}

export const deleteProductsFromSupplier = (data)=>{getTokenLocalStorage();
    return axios.delete('/api/supplier/?supplier_id='+data.supplier_id+'&products='+data.products);
}

export const getProfit = (data) =>{getTokenLocalStorage();
    return axios.get('/api/profitnloss/', data);

}

export const deleteSales = (data) =>{getTokenLocalStorage();
    return axios.delete('/api/sales/?id='+data.id);
}

export const getTopProduct = ({queryKey}) =>{getTokenLocalStorage();
    const [_, time] = queryKey;
    return axios.get('/api/toproduct/?time='+time);
}

export const profileupdate = (data) =>{
    getTokenLocalStorage();
    return axios.put('/api/profileupdate/', data);
}

export const profileimageupload = (data) =>{
    getTokenLocalStorage();
    return axios.post('/api/profile/', data,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}