import react, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { login } from '../../server/api';
import { useAuth } from '../../context/AuthContextProvider';
const { ipcRenderer } = window.electron
import axios from 'axios';
import Navigation from '../custom_components/Navigation';

const Dashboard = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const { setToken } = useAuth();

    const post_server = useMutation(login, {
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: res => {
            setLoading(false);

            setToken(res.data.token)
            axios.defaults.headers.common = {
                Authorization: `Token ${res.data.token}`,
            };
        },
        onError: err => {
            console.log(err)
            alert(err)
        }
    })


    //device-info



    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await ipcRenderer.invoke('device-info');

        post_server.mutate({
            username: username,
            password: password,
            unique_id: result.uniqueId,
            device_name: result.username,
            acc_type: 'Admin',

        })
    }


    return (
        <div className='flex flex-row h-screen'>
            <Navigation />
            <div className="bg-white font-sans h-full w-full px-3">
                <div className='grid grid-cols-3'>
                 <div style={{width:100, height:100}}>
                    <img src={IMAGE.d1} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                    <div style={{position:'absolute', top:0}}>
                        <h1>Sales</h1>
                    </div>
                 </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;