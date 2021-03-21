export const getLocalList = () => {
  let loadedList = localStorage.getItem('list');
  if(loadedList) {
    return (loadedList = JSON.parse(localStorage.getItem('list')));
  }
  else {
    return {
      id:null,
      title:'',
      items:[]
    }
  }
};

export const getLocalLists = () => {
  let loadedLists = localStorage.getItem('lists');
  if(loadedLists) {
    return (loadedLists = JSON.parse(localStorage.getItem('lists')));
  }
  else return [];
};
