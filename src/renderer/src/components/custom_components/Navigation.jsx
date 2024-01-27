import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IMAGE } from "../../config/image";
import { APPNAME } from "../../config/config";

//Create array contain name, img, link
//Dashboard, Course, Lesson, Request, User,

const nav = [
    {
        name: "Dashboard",
        icon: "bi bi-house",
        link: "/",
    },
    {
        name: "Products",
        icon: "bi bi-bag",
        link: "/products",
    },
    {
        name: "Sales",
        icon: "bi bi-cart",
        link: "/sales",
    },
  
    {
        name: "Other Income",
        icon: "bi bi-wallet",
        link: "/otherincome",
    },
   
    {
        name: "Expense",
        icon: "bi bi-stack",
        link: "/expense",
    },
   
    {
        name: "Customer",
        icon: "bi bi-person",
        link: "/customer",
    },
    {
        name: "Supplier",
        icon: "bi bi-box",
        link: "/supplier",
    },
    {
        name: "Sales Report",
        icon: "bi bi-file-ruled",
        link: "/salesreport",
    },
    {
        name: "Report",
        icon: "bi bi-file-bar-graph",
        link: "/report",
    },
];

//Naviagtion Top
const Navigation = () => {
    const [open, setOpen] = React.useState(false);
    var location = useLocation();
    let navigate = useNavigate();

    const [nav_select, set_nav_select] = React.useState(location.pathname);


    // change location if user press ctrl + tab
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "Tab") {
                nav.map((item, index) => {
                    if (item.link === location.pathname) {
                        if (index + 1 < nav.length) {
                            navigate(nav[index + 1].link);
                        } else {
                            navigate(nav[0].link);
                        }
                    }
                });
            }

            if (e.ctrlKey && e.key === "Shift" && e.key === "Tab") {
                nav.map((item, index) => {
                    if (item.link === location.pathname) {
                        if (index - 1 >= 0) {   
                            navigate(nav[index - 1].link);
                        } else {
                            navigate(nav[nav.length - 1].link);
                        }
                    }
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [location.pathname]);

    return (
        <div
            className={`h-screen bg-white font-mono text-black ${"w-20"} duration-300 relative border-r-2`}
        >
            <div className="flex flex-row items-center px-2 ">
                {/* <img
                    src={IMAGE.app_icon}
                    className="w-14 h-14 filter brightness-0"
                    alt={APPNAME}
                /> */}
                {/* <h1
                    className={`${!open && "scale-0"
                        } duration-200 origin-left ml-2 text-xl font-semibold`}
                >
                    {APPNAME}
                </h1> */}
            </div>
            {/* <div className="border-b-2 border-gray-800 w-full"></div> */}
            {/* Navgiation */}
            <ul className="px-2">
                {nav.map((item, index) => (
                    <Link
                        key={index}
                        className={`flex flex-col items-center py-2 px-2 my-2 rounded-lg hover:bg-indigo-100 cursor-pointer ${item.link === nav_select && "bg-indigo-100"
                            }`}
                        to={item.link}
                    >
                        <i className={`${item.icon} text-2xl`}></i>
                        <p className={"text-[11px] text-center"}>{item.name}</p>
                    </Link>
                ))}
            </ul>
            <ul className="mt-auto px-2">
                <Link
                    className={`flex flex-col items-center py-2 px-2 my-2 rounded-lg  hover:bg-indigo-100 cursor-pointer ${'/settings' === nav_select ? "bg-indigo-100" : ''}`}
                    to={"/settings"}
                >
                    <i className="bi bi-gear text-2xl"></i>
                    <p className={"text-[11px]"}>{"Settings"}</p>
                </Link>
            </ul>
        </div>
    );
};

export default Navigation;
