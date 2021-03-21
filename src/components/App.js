import React, { useState, useEffect, useRef } from 'react';
import List from './List';
import Alert from './Alert';
import Navbar from './Navbar';
import { getLocalList, getLocalLists } from './LocalStorage';
import uniquid from 'uniquid';
import { FaEdit } from 'react-icons/fa';

function App() {
  const [listName, setListName] = useState('');
  const [itemName, setItemName] = useState('');
  const [lists,setLists] = useState(getLocalLists);
  const [list, setList] = useState(getLocalList);
  const [showLists, setShowLists] = useState(false);
  const listsRef = useRef(null);
  const listsContainerRef = useRef(null);
  const [isItemEditing, setIsItemEditing] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(true);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: ''
  });

  const handleListName = (e) => {
    e.preventDefault();
    if (!listName) {
      showAlert(true,'danger','please enter list name');
    }
    else if(listName.length > 30) {
      showAlert(true,'danger','name is too long (max 30 characters)');
    }
    else {
      setList({
        ...list,
        id:list.id?list.id:uniquid(),
        title:listName
      });
      setIsNameEditing(!isNameEditing);
      showAlert(true,'success','list name changed');
    }
  };

  const handleItemName = (e) => {
    e.preventDefault();
    if (!itemName) {
      showAlert(true, 'danger', 'please enter item name');
    }
    else if (itemName && isItemEditing) {
      setList({
        ...list,
        items: list.items.map((item) => {
          if (item.id === editID) {
            return { ...item, title: itemName };
          }
          return item;
        })
      });
      setItemName('');
      setEditID(null);
      setIsItemEditing(false);
      showAlert(true, 'success', 'item changed');
    }
    else {
      const newItem = { id: uniquid(), title: itemName };
      setList({...list, items:[...list.items,newItem]});
      setItemName('');
      showAlert(true, 'success', 'item added to the list');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const toggleLists = () => {
    setShowLists(!showLists);
  };

  const loadList = (id) => {
    if(list.id) {
      const specificList = lists.find((list) => list.id === id);
      if(specificList) {
        let isAnyItemChanged = false;
        for(let i=0;i<specificList.items.length;i++) {
          if(specificList.items[i] !== list.items[i]) {
            isAnyItemChanged = true;
          }
        }
        if(isAnyItemChanged || list.items.length > specificList.items.length) {
          if(window.confirm('Would you like to save your current list?')) {
            saveList(list.id);
          }
        }
        else {
          
        }
      }
    }
    setList(lists.find((list) => list.id === id));
    setIsNameEditing(false);
    toggleLists();
    showAlert(true, 'success', 'list loaded');
  };

  const clearList = (id) => {
    if(list.items.length === 0) {
      showAlert(true, 'danger', 'list is already empty');
    }
    else if(list.items.length > 0 && !id) {
      setList({...list, items:[]});
      showAlert(true, 'danger', 'list cleared');
    }
    else {
      setList({...list, items:[]});
      const specificList = lists.find((list) => list.id === id);
      if(specificList) {
        const newLists = lists.filter((list) => list.id !== id);
        setLists([...newLists,list]);
      }
      showAlert(true, 'danger', 'list cleared');
    }
  };

  const saveList = (id) => {
    if(!id) {
      showAlert(true, 'danger', 'set list name to save it');
    }
    else {
      const specificList = lists.find((list) => list.id === id);
      if(specificList) {
        const newLists = lists.filter((list) => list.id !== id);
        setLists([...newLists,list]);
      }
      else {
        setLists([...lists,list]);
      }
      showAlert(true, 'success', 'list saved');
    }
  };

  const removeList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
    setList({
      id:null,
      title:'',
      items:[]
    });
    setIsNameEditing(!isNameEditing);
    showAlert(true, 'danger', 'list removed');
  };

  const newList = (specificId) => {
    saveList(specificId);
    setList({
      id:null,
      title:'',
      items:[]
    });
    setIsNameEditing(true);
    showAlert(true, 'success', 'new list created');
  };

  const removeItem = (id) => {
    setList({...list, items:list.items.filter((item) => item.id !== id)});
    if(isItemEditing) {
      setIsItemEditing(false);
      setItemName('');
    }
    showAlert(true, 'danger', 'item removed');
  };

  const editItem = (id) => {
    const specificItem = list.items.find((item) => item.id === id);
    setIsItemEditing(true);
    setEditID(id);
    setItemName(specificItem.title);
    showAlert(true, 'danger', 'item changed');
  };

  useEffect(() => {
    if(list.title) {
      setIsNameEditing(false);
    }
  },[]);

  useEffect(() => {
    setListName(list.title);
  },[list.title]);

  useEffect(() => {
    const listsHeight = listsRef.current.getBoundingClientRect().height;
    if(showLists) {
      listsContainerRef.current.style.height = `${listsHeight}px`;
    }
    else {
      listsContainerRef.current.style.height = '0';
    }
  },[showLists]);

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  return <>
    {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
    <Navbar lists={lists} toggleLists={toggleLists} />
    <div className='lists-container' ref={listsContainerRef}>
      <div className='lists' ref={listsRef}>
        {
          lists.map((list) => {
            return <button className='btn' key={list.id} onClick={() => loadList(list.id)}>
              {list.title}
            </button>
          })
          }
      </div>
    </div>
    <section className='section-center'>
      {
        isNameEditing
        ?
        <>
          <h3>
            {
              list.title ? `${listName}` : 'new list'
            }
          </h3>
          <form className='name-form' onSubmit={handleListName}>
            <div className='form-control'>
              <input
                type='text'
                className='list-name'
                placeholder='set up your list name'
                onChange={(e) => setListName(e.target.value)}
              />
              <button type='submit' className='submit-btn'>
                apply
              </button>
            </div>
          </form>
        </>
        : 
        <h3>
          {listName}
          <button
            type='button'
            className='edit-btn'
            onClick={() => setIsNameEditing(!isNameEditing)}
          >
            <FaEdit />
          </button>
        </h3>
      }
      <form className='shopping-form' onSubmit={handleItemName}>
        <div className='form-control'>
          <input
            type='text'
            className='shopping'
            placeholder='insert item name'
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isItemEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      <div className='shopping-container'>
        <List list={list} removeItem={removeItem} editItem={editItem} />
        <div className='btn-container'>
          <button className='btn' onClick={() => clearList(list.id)}>
            clear items
          </button>
          <button className='btn' onClick={() => saveList(list.id)}>
            save list
          </button>
          <button className='btn' onClick={() => removeList(list.id)}>
            remove list
          </button>
          <button className='btn' onClick={() => newList(list.id)}>
            new list
          </button>
        </div>
      </div>
    </section>
  </>
}

export default App;
