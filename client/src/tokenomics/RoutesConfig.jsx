// RoutesConfig.jsx

import { Summary, Transactions, AdminProgram, Holders, Contents, Kanban, Editor} from './pages';

import Wallets from './pages/Wallets';
import { FiShoppingBag } from 'react-icons/fi';
import { AiOutlineShoppingCart, AiOutlineCalendar } from 'react-icons/ai';
import { RiContactsLine } from 'react-icons/ri';
import { IoMdContacts } from 'react-icons/io';
import { BsKanban } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';

const wallets = [
  { path: "main", name: "main", title: "Main Wallet Scanner", address: "3USSkLM9YLobdoej5W4KXtCgVMfLHr668b4kWpLMXbQR", icon: <IoMdContacts /> },
  { path: "advisor", name: "advisor", title: "Advisor Wallet Scanner", address: "9NGgZrYTjdi8zLaDJns9SR3Kpudd4koLX7UCsYX1a5rH", icon: <IoMdContacts /> },
  { path: "team", name: "team", title: "Team Wallet Scanner", address: "qwd3DLtAp6oaPCV2ztYH2B7sZPbimLq91vm34GfTZGf", icon: <IoMdContacts /> },
  { path: "community", name: "community", title: "Community Wallet Scanner", address: "6vksENmjsWnSL2Z32muHTEbJ3yAPQ6gi3FWVg4Q9bprU", icon: <IoMdContacts /> },
  { path: "reserve", name: "reserve", title: "Reserve Wallet Scanner", address: "GmYa6d694FU8LYJk1JhyeYbEyKLf2oxRi3qGLTtBjLt8", icon: <IoMdContacts /> },
  { path: "sales_seed", name: "sales_seed", title: "Sales(Seed) Wallet Scanner", address: "Audw4PkrCzetNbVrLNzfyhHmQNWtDd4DwmERLrY7qJMx", icon: <IoMdContacts /> },
  { path: "sales_strg", name: "sales_strg", title: "Sales(Strategy) Wallet Scanner", address: "34ate9CyKGbgAoCCXG3Bq3s7x9Wurvnq1BFarhQXhUZY", icon: <IoMdContacts /> },
  { path: "eco", name: "eco", title: "Eco Wallet Scanner", address: "UPxh5mDyrQ5nw1y2mjzaYLyPt4T2EUo3BF3hvMz63LP", icon: <IoMdContacts /> },
];

export const routes = [
  {
    category: "Dashboard",
    links: [
      {
        path: "summary",
        name: "summary",
        component: <Summary />,
        icon: <FiShoppingBag />,
      },
    ],
  },
  {
    category: "Category",
    links: [
      {
        path: "transactions",
        name: "transactions",
        component: <Transactions />,
        icon: <AiOutlineShoppingCart />,
      },
      {
        path: "holders",
        name: "holders",
        component: <Holders />,
        icon: <RiContactsLine />,
      },
      {
        path: "contents",
        name: "contents",
        component: <Contents />,
        icon: <RiContactsLine />,
      },
      ...wallets.map((wallet) => ({
        path: wallet.path,
        name: wallet.name,
        component: <Wallets title={wallet.title} walletAddress={wallet.address} />,
        icon: wallet.icon,
      })),
    ],
  },
  /*
  {
    category: "Apps",
    links: [
      {
        path: "adminprogram",
        name: "adminprogram",
        component: <AdminProgram />,
        icon: <AiOutlineCalendar />,
      },
      {
        path: "kanban",
        name: "kanban",
        component: <Kanban />,
        icon: <BsKanban />,
      },
      {
        path: "editor",
        name: "editor",
        component: <Editor />,
        icon: <FiEdit />,
      },
    ],
  },
  */
];
