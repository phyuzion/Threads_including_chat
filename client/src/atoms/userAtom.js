import { atom } from 'recoil';


const userAtom = atom({
  key: 'userAtom',
  default: (localStorage.getItem('user') != 'undefined') ? JSON.parse(localStorage.getItem('user')) : null,
});

export default userAtom;
