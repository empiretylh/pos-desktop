import axios from 'axios';


export const login = (data)=>{
    return axios.post('/auth/login/', data);
}

export const register =(data)=>{
    return axios.post('/auth/register/', data);
}

export const getUser = (data)=>{
    return axios.get('/api/profile/', data);
}