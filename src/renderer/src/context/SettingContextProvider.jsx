import react, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContextProvider';
import { useQuery } from 'react-query';
import { getCategorys } from '../server/api';


const SettingDataContext = createContext();

const SettingDataProvider = ({ children }) => {

    const [settings, setSettings] = useState({
        language : 'mm',
        discount : 'percent',
        lessthan : 10,
        expireshow : 7,
        showimage: false,
        printerName : 'POS-58-Series',
        paperWidth : 300,
        footertext : 'Thank For You Shopping',
        printSilent : false,
    })


    //get settings data from localstorage
    useEffect(()=>{
        const settings = localStorage.getItem('settings');
        if(settings){
            setSettings(JSON.parse(settings));
            console.log("old settings", settings)
        }else{
            localStorage.setItem('settings', JSON.stringify(settings));
        }
    },[])

    const ChangeSettings = (value, name)=>{
        localStorage.setItem('settings', JSON.stringify({...settings, [name]: value}));
        console.log("new settings", settings, value, name)
        setSettings({...settings, [name]: value});

        
    }





    return (
        <SettingDataContext.Provider value={{ settings, ChangeSettings }}>
            {children}
        </SettingDataContext.Provider>
    )
}


export const useSetting = () => useContext(SettingDataContext);

export const IDToCategory = (id) => {
    const { data } = useSetting();
    if (data) {
        const category = data.find(item => item.id === id);
        return category?.title;
    }
}

export default SettingDataProvider;