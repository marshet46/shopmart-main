import { BsCurrencyDollar } from "react-icons/bs";
import { FaHandshake, FaShare } from "react-icons/fa";
import {
  FiHome,
  FiLayers,
  FiMail,
  FiMessageCircle,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

export const links = [
  {
    name: "Dashboard",
    icon: <FiHome />,
    url: "/",
  },
  {
    name: "Stock Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All Stocks",
        url: "/stocks",
      },
     
      
    ],
  },
  {
    name: "News Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All news",
        url: "/news",
      },
    
      
    ],
  },
  {
    name: "Deposits Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All Deposits",
        url: "/deposits",
      },
     
      
    ],
  },
  {
    name: "Order Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All Orders",
        url: "/orders",
      },
     
      
    ],
  },
  {
    name: "User Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All Users",
        url: "/users",
      },
     
      
    ],
  },
  {
    name: "Withdraw Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All withdraws",
        url: "/withdraws",
      },
     
      
    ],
  }, 

  {
    name: "Company Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "All Company ",
        url: "/companies",
      },  
      {
        name: "add Company ",
        url: "/add",
      },  
        
    ],
  },

  {
    name: "Stocks Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "Stock ",
        url: "/stocks",
      },      
    ],
  },
  {
    name: "Sell Stocks Management",
    icon: <FiShoppingBag />,
    subLinks: [
      {
        name: "Sell Stock Order ",
        url: "/sells",
      },      
    ],
  },
  // {
  //   name: "Orders",
  //   icon: <FiShoppingCart />,
  //   subLinks: [
  //     {
  //       name: "Add stocks",
  //       url: "/stocks/add",
  //     },
  //    ,
  //   ],
  // },
  // {
  //   name: "Suppliers",
  //   icon: <FaShare />,
  //   url: "/suppliers",
  // },
  // {
  //   name: "Transactions",
  //   icon: <FaHandshake />,
  //   url: "/transactions",
  // },
  // {
  //   name: "Brands",
  //   icon: <FiLayers />,
  //   url: "/brands",
  // },
  // {
  //   name: "Reviews",
  //   icon: <FiMessageCircle />,
  //   url: "/reviews",
  // },
  // {
  //   name: "Settings",
  //   icon: <FiSettings />,
  //   url: "/settings",
  // },
  // {
  //   name: "Inbox",
  //   icon: <FiMail />,
  //   url: "/inbox",
  // },
];
