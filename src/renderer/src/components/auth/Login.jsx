import react, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { login } from '../../server/api';
import { useAuth } from '../../context/AuthContextProvider';
const { ipcRenderer } = window.electron
import axios from 'axios';
import Loading from '../custom_components/Loading';

const Login = () => {

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

            window.location.href = "/"
        },
        onError:err=>{
            console.log(err)
            setLoading(false);
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
        <div className='w-full h-screen grid grid-cols-3 font-mono'>
            <Loading show={loading} />
            <div className="bg-primary h-full col-span-2 text-white flex justify-center items-center">
                <div className='flex flex-col items-center justify-center'>
                    <img src={IMAGE.app_icon} style={{ width: 200, height: 200 }} />
                    <h1 className='text-4xl font-semibold'>{APPNAME}</h1>
                </div>
            </div>
            <div className="bg-white h-full col-span-1">
                <div className="flex flex-col  w-full h-full justify-center items-center">
                    <h1 className="text-3xl">
                        Login
                    </h1>
                    <form style={{ width: '80%', marginTop: 30 }} onSubmit={onSubmit}>
                        <label className="block text-gray-700 text-xl font-bold mb-2">Username</label>
                        <TextInput placeholder={'Username'} type="text" onChange={e => setUsername(e.target.value)} required />

                        <label className="block text-gray-700 text-xl font-bold mb-2">Password</label>
                        <TextInput placeholder={'Password'} type="password" onChange={e => setPassword(e.target.value)} required />

                        <button type="submit" className="bg-primary py-2 rounded-md w-full text-white font-bold hover:bg-cyan-600">Login</button>

                        <button type="button" className="bg-primary py-2 mt-2 rounded-md w-full text-white font-bold hover:bg-cyan-600">Register</button>

                    </form>

                    <div style={{ position: 'absolute', bottom: 2 }}>Copyright © 2022-{new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    )
}

export default Login;