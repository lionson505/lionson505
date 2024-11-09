import React from "react";
import { Link } from "react-router-dom";

function PcdMenu() {
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    
    // Define the menu items and their corresponding roles
    const menuItems = [
        {
            name: "Dashboard",
            path: "/",
            roles: ["pd", "burser", "auditor"],
            icon: require("../assets/dashboard-icon.png")
        },
        {
            name: "Stockin",
            path: "/stockin",
            roles: ["burser"],
            icon: require("../assets/inventory-icon.png")
        },
        {
            name: "Inventory",
            path: "/inventory",
            roles: ["burser",],
            icon: require("../assets/inventory-icon.png")
        },
        {
            name: "Stock",
            path: "/stockreport",
            roles: ["pd","auditor"],
            icon: require("../assets/inventory-icon.png")
        },
        {
            name: "Sales",
            path: "/sales",
            roles: ["burser"],
            icon: require("../assets/product-sale.png")
        },
        
        {
          name: "Messages",
          path: "/messages",
          roles: ["pd", "pcd", "burser", "auditor"],
          icon: require("../assets/supplier-icon.png")
      },
        {
            name: "Youths",
            path: "/manage-youth",
            roles: ["pd", "pcd"],
            icon: require("../assets/Lovepik_com-401555333-cheering-jumping-youth.png")
        },
        {
            name: "List Of Youth Attendance",
            path: "/teacherattendance",
            roles: ["teacher"],
            icon: require("../assets/attendance.png")
        },
        {
            name: "Make Attendance",
            path: "/tyouthaddattendance",
            roles: ["teacher"],
            icon: require("../assets/checking-attendance.png")
        },
        {
            name: "Make Attendance",
            path: "/addattendance",
            roles: ["pcd"],
            icon: require("../assets/checking-attendance.png")
        },
        {
            name: "Attendance List",
            path: "/attendancelist",
            roles: ["pcd","pd","auditor"],
            icon: require("../assets/attendance.png")
        },
        
        {
            name: "Teachers",
            path: "/teacher",
            roles: ["pcd"],
            icon: require("../assets/attendance.png")
        },
        {
            name: "School Fees",
            path: "/schoolfees",
            roles: ["burser"],
            icon: require("../assets/order-icon.png")
        },
        {
            name: "Compassion",
            path: "/Compassion",
            roles: ["auditor"],
            icon: require("../assets/order-icon.png")
        },
        {
            name: "Users",
            path: "/users",
            roles: ["auditor"],
            icon: require("../assets/order-icon.png")
        }
    ];

    return (
        <div className="h-full flex-col justify-between bg-white hidden lg:flex">
            <div className="px-4 py-6">
                <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
                     {menuItems.map((item) => 
                        item.roles.includes(localStorageData.role) && (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-gray-700"
                            >
                                <img
                                 width={20}
                                 alt={`${item.name}-icon`} src={item.icon} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        )
                    )}
                </nav>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <img
                        alt="Profile"
                        src={localStorageData.imageUrl}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-xs">
                            <strong className="block font-medium">
                                {localStorageData.firstName + " " + localStorageData.lastName}
                            </strong>
                            <span>{localStorageData.email}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PcdMenu;
