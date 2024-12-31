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
  { path: "walletA", name: "walletA", title: "Wallet A Scanner", address: "0x123...A", icon: <IoMdContacts /> },
  { path: "walletB", name: "walletB", title: "Wallet B Scanner", address: "0x123...B", icon: <IoMdContacts /> },
  { path: "walletC", name: "walletC", title: "Wallet C Scanner", address: "0x123...C", icon: <IoMdContacts /> },
  { path: "walletD", name: "walletD", title: "Wallet D Scanner", address: "0x123...D", icon: <IoMdContacts /> },
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
];
