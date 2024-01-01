import react, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AlertShowContext = createContext(null);

const AlertShowProvider = ({ children }) => {

    const [informshow, setInformShow] = useState(false);
    const [infotitle, setInfoTitle] = useState('Information')
    const [infotext, setInfotext] = useState('Information');
    const [infochildren, setinfoChildren] = useState(null);


    const [yesnodialogshow, setYesNoDialogShow] = useState(false);
    const [yesnodialogtitle, setYesNoDialogTitle] = useState('Yes or No');
    const [yesnodialogtext, setYesNoDialogText] = useState('Yes or No');
    const [yesnodialogchildren, setYesNoDialogChildren] = useState(null);
    const [onYes, setOnYes] = useState(null);

    // press esc close the opened dialogs
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setInformShow(false);
                setYesNoDialogShow(false);
            }

            //enter key press on yes no dialog
            if (e.key === 'Enter') {
                handleYes();
                // setYesNoDialogShow(false);
            }

        }

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        }
    }, [onYes])



    const handleYes = () => {
        if (onYes) {
            onYes();
        }
        setYesNoDialogShow(false);
        setOnYes(null)
    }


    const showInfo = (title, text, children = null) => {
        setInfoTitle(title);
        setInfotext(text);
        setInformShow(true);
        setinfoChildren(children)
    }


    const showConfirm = (title, text, onYes, children = null) => {
        setYesNoDialogTitle(title);
        setYesNoDialogText(text);
        setYesNoDialogShow(true);
        setYesNoDialogChildren(children);
        setOnYes(() => onYes);
    }

   

    const [showBottomNoti, setShowBottomNoti] = useState(false);
    const [bottomNotiTitle, setBottomNotiTitle] = useState('Successfully Update the Products');
    const [bottomNotiIcon , setBottomNotiIcon] = useState('bi bi-check-circle-fill text-green-500');

    const showNoti = (title, icon="bi bi-check-circle-fill text-green-500'") => {
        setBottomNotiTitle(title);
        setBottomNotiIcon(icon);
        setShowBottomNoti(true);
    }

    //if showBottomNoti is true then set it to false after 3 seconds
    useEffect(() => {
        let time;
        if (showBottomNoti) {
           time = setTimeout(() => {
                setShowBottomNoti(false);
            }, 3000);
        }

        return () => {
            clearTimeout(time);
        }
    }, [showBottomNoti])


    return (
        <AlertShowContext.Provider value={{
            showInfo, showConfirm, showNoti
        }}>
            {children}

            {/* */}

            {informshow && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50  flex items-center justify-center z-10 rounded">
                    <div className="bg-white rounded shadow-lg w-64">
                        <div className="px-6 py-4">
                            <h2 className="text-xl">{infotitle}</h2>
                            <p className="mt-4 text-gray-600">{infotext}</p>
                            {infochildren}
                        </div>
                        <div className="px-6 py-4 flex justify-end">
                            <button
                                className="px-4 py-2 text-white bg-primary rounded"
                                onClick={() => setInformShow(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {yesnodialogshow && (
                <div className="fixed inset-0 flex bg-gray-500 bg-opacity-50 items-center justify-center z-10 rounded">
                    <div className="bg-white rounded shadow-lg max-w-90">
                        <div className="px-6 py-4">
                            <h2 className="text-xl">{yesnodialogtitle}</h2>
                            <p className="mt-4 text-gray-600">{yesnodialogtext}</p>
                            {infochildren}
                        </div>
                        <div className="px-6 py-4 flex justify-end">
                            <form>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-primary rounded mr-2"
                                onClick={handleYes}
                            >
                                Yes
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-gray-500 rounded"
                                onClick={() => setYesNoDialogShow(false)}
                            >
                                No
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
         
                <div className={`absolute bottom-5 right-5 duration-300 scale-0 ${showBottomNoti ? "scale-100": ""}`}>
                    <div className="bg-gray-200 rounded shadow-lg max-w-90">
                        <div className="px-6 py-4">
                            <div className="flex items-center">
                                <i className={`${bottomNotiIcon} text-xl mr-2`}></i>
                                <h2 className="text-md">{bottomNotiTitle}</h2>
                            </div>
                        </div>
                    </div>
                </div>
           

        </AlertShowContext.Provider>
    )
}

export const useAlertShow = () => useContext(AlertShowContext);



export default AlertShowProvider;