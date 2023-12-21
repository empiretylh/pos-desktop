import react from 'react';

const CustomButton = ({ text, bgcolor = 'bg-primary', textcolor = 'text-white', icon , onClick}) => {
    return (
        <div onClick={onClick} className={`p-3 ${bgcolor} ${textcolor} rounded items-center flex flex-row cursor-pointer hover:bg-cyan-950`}>
            {icon && <i className={icon}></i>}
            <h2 className='text-md font-bold'>{text}</h2>
        </div>
    )
}

export default CustomButton;