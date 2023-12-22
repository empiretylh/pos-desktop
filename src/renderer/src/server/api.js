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