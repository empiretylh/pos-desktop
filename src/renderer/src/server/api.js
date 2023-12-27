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
    return axios.delete(`/api/products/`, {data : {id : data.id}});
}

export const deleteCategorys = (data) => {
    return axios.delete(`/api/categorys/?id=${data.id}`);
}

export const changePrice = (data)=>{
    return axios.put('/api/products/changewithperentage/', data);
}

export const getCustomer = (data)=>{
    return axios.get('/api/customer/', data);
}

export const postCustomer = (data)=>{
    return axios.post('/api/customer/', data);
}


export const postSales = (data) =>{
    return axios.post('/api/sales/', data,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      );
}