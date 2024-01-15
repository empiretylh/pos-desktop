import react, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { APPNAME } from '../../config/config';
import { IMAGE } from '../../config/image';
import TextInput from '../custom_components/TextInput';
import { login, register } from '../../server/api';
import { useAuth } from '../../context/AuthContextProvider';
const { ipcRenderer } = window.electron
import axios from 'axios';
import Loading from '../custom_components/Loading';

const Register = () => {

    const [username, setUsername] = useState('');
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const { setToken } = useAuth();

    const post_server = useMutation(register, {
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
        onError: err => {
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
            name: shopName,
            phoneno: phoneno,
            address: address,
            phoneno: phoneno,
            email: email,
            password: password,
            uid: result.uniqueId,
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
                        Register
                    </h1>
                    <form style={{ width: '80%', marginTop: 30 }} onSubmit={onSubmit}>
                        {/* username / shop name, address, phoneno, email input and password input */}
                        <label className="text-lg font-bold text-gray-700 tracking-wide">Username</label>
                        <TextInput
                            label='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Username'
                            required
                        />
                        <label className="text-lg font-bold text-gray-700 tracking-wide">Shop Name</label>

                        <TextInput
                            label='Shop Name'
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder='Shop Name'
                            required
                        />

                        <label className="text-lg font-bold text-gray-700 tracking-wide">Phone Number</label>

                        <TextInput
                            label='Phone Number'
                            value={phoneno}
                            onChange={(e) => setPhoneno(e.target.value)}
                            placeholder='Phone Number'
                            required
                        />
                        <label className="text-lg font-bold text-gray-700 tracking-wide">Email</label>

                        <TextInput
                            label='Email'
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            required
                        />
                        <label className="text-lg font-bold text-gray-700 tracking-wide">Address</label>

                        <TextInput
                            label='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='Address'
                            required
                        />
                        <label className="text-lg font-bold text-gray-700 tracking-wide">Password</label>

                        <TextInput
                            label='Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                        <button
                            type='submit'
                            className="bg-primary mt-2 text-white px-2 p-2 rounded-md w-full">Register</button>
                        <button
                            onClick={(e) => window.location.href = "/login"}
                            type='button'
                            className="bg-primary mt-2 text-white px-2 p-2 rounded-md w-full">Login</button>
                    </form>

                    <div style={{ position: 'absolute', bottom: 2 }}>Copyright © 2022-{new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    )
}

export default Register;