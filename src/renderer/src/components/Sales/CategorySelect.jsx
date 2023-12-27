import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAlertShow } from '../custom_components/AlertProvider';
import { useCategoryData } from '../../context/CategoryDataProvider';

const CategorySelect = ({ selectedCategory = "All", setSelectedCategory }) => {

    //show all category in horizontal and scrollbar is hidden and move with button > and <
    const { category_data, data } = useCategoryData();
    const scrollContainer = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);

    const checkScrollable = () => {
        setIsScrollable(scrollContainer.current.scrollWidth > scrollContainer.current.clientWidth);
    };

    useEffect(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, []);

    const scroll = (scrollOffset) => {
        scrollContainer.current.scrollLeft += scrollOffset;
    };

    return (
        <div className="flex items-center p-2">
            {isScrollable && <button onClick={() => scroll(-100)} className="bg-primary font-bold select-none rounded text-white p-2" tabIndex={-1}>&lt;</button>
            }   <div ref={scrollContainer} className="flex overflow-x-hidden scrollbar-hide mx-2">
                <div
                    onClick={() => setSelectedCategory("All")}
                    className={`inline-block p-2 whitespace-nowrap mx-2 ${selectedCategory == 'All' ? " bg-gray-800 text-white font-bold" : "bg-slate-300 text-black"} select-none rounded-md cursor-pointer`}>All</div>
                {data.map((item, index) => (
                    <div
                        onClick={() => setSelectedCategory(item.id)}
                        key={index} className={`inline-block p-2 whitespace-nowrap mx-2 ${selectedCategory == item.id ? " bg-gray-800 text-white font-bold" : "bg-slate-300 text-black"} select-none rounded-md cursor-pointer`}>{item.title}</div>
                ))}
            </div>
            {isScrollable && <button onClick={() => scroll(100)} tabIndex={-1} className="bg-primary font-bold select-none rounded text-white p-2">&gt;</button>
            } </div>
    );
}

export default CategorySelect;