import React, { useState, useEffect, useContext } from 'react';
import './StickyNotes.css';
import pnp from 'sp-pnp-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { AppCtx } from '../../../App';
import { message, Popconfirm } from 'antd';
import AddNote from './API/AddNote';
import UpdateNote from './API/UpdateNote';











const StickyNotes = () => {
  const { notes_list, setNotesList } = useContext(AppCtx);
  const [currentNote, setCurrentNote] = useState(notes_list[0]?.Id);
  const [isActiveEditMode, setIsActiveEditMode] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState(notes_list.filter(n => n.id === currentNote)[0]?.title);
  const [newNoteDescription, setNewNoteDescription] = useState(notes_list.filter(n => n.id === currentNote)[0]?.description);


  async function saveEdits() {
    if(newNoteTitle === '' || newNoteDescription === ''){
      message.error("Please, edit Title and Description above and try again.")
    } else {
      if(currentNote === -1) {
        const response = await AddNote(newNoteTitle, newNoteDescription);
        if(response.data) {
          setNotesList(prev => [response.data, ...prev]);
          message.success("Done!")
          setCurrentNote(response.data?.Id)
        } else {
          message.error("Failed, Please try again.")
        }
      } else {
        const response = await UpdateNote(currentNote, newNoteTitle, newNoteDescription);
        if(response.data) {
          const updatedNotes = notes_list.map(obj => {
            if (obj.Id === currentNote) {
              obj.Title = newNoteTitle;
              obj.NoteDescription = newNoteDescription;
              return {...obj};
            }
            return obj;
          });
          setNotesList(updatedNotes);
          message.success("Done!")
        } else {
          message.error("Failed, Please try again.")
        }
      }
      setIsActiveEditMode(false)
    }
  }

  const cancelEdits = () => {
    setIsActiveEditMode(false)
    if(currentNote === -1) {
      setCurrentNote(notes_list[0]?.Id)
    }
  }

  const onDeleteHandler = (Id) => {
    const newArray = notes_list.filter(r => r.Id !== Id);
    pnp.sp.web.lists.getByTitle("Sticky Notes").items.getById(Id).delete()
        .then(() => setNotesList(newArray))
        .then(() => setCurrentNote(newArray[0]?.Id))
        .then(() => message.success("Your Note has been deleted."))
        .catch((err) => console.log(err))
  }

  useEffect(() => {
    setNewNoteTitle('')
    setNewNoteDescription('')
  }, [isActiveEditMode])
  useEffect(() => {
    if(currentNote === -1) {
      setIsActiveEditMode(true)
    }else if(currentNote !== -1) {
      setIsActiveEditMode(false)
    }
  }, [currentNote])
  useEffect(() => {
    setCurrentNote(notes_list[0]?.Id);
  }, [notes_list]);

  return (
    <div className='sticky-notes-container'>
      <div className="header">
        <h2>Sticky Notes</h2>
        {
          isActiveEditMode
          ? <div className='action-btns'>
              <button className='action-btn save-btn' onClick={saveEdits}>Save</button>
              <button className='action-btn cancel-btn' onClick={cancelEdits}>Cancel</button>
            </div>
          : <div className='action-btns'>
              <Popconfirm placement="top" title="Delete?" onConfirm={() => onDeleteHandler(currentNote)} okText="Delete" cancelText="Cancel">
                <span className='action-btn'><FontAwesomeIcon icon={faTrash} style={{cursor: 'pointer'}} /></span>
              </Popconfirm>
              
              <span className='action-btn' onClick={() => setCurrentNote(-1)}><FontAwesomeIcon icon={faPlus} style={{cursor: 'pointer'}} /></span>
            </div>
        }
      </div>
      <div className="note">

        {
          currentNote === -1
          ? <div className='add-new-form'>
              <input type="Note Title" placeholder='Note Title' onChange={e => setNewNoteTitle(e.target.value)} />
              <textarea name="Note Description" placeholder='Note Description' rows={7} onChange={e => setNewNoteDescription(e.target.value)}></textarea>
            </div>
          : null
        }


        {
          notes_list?.map((n) => {
            return (
              n?.Id === currentNote && <>
                {
                  isActiveEditMode
                  ? <div className='add-new-form'>
                      <input type="Note Title" onChange={e => setNewNoteTitle(e.target.value)} defaultValue={n.Title} />
                      <textarea name="Note Description" rows={5} onChange={e => setNewNoteDescription(e.target.value)} defaultValue={n.NoteDescription} ></textarea>
                    </div>
                  : <div onClick={() => setIsActiveEditMode(true)}>
                      <h4 className="note-title">
                        {n.Title}
                      </h4>
                      <p className="note-description">
                        {n.NoteDescription}
                      </p>
                    </div>
                }
              </>
            )
          })
        }
      </div>
      <div className='dots'>
        
        {
          notes_list.map((n) => {
            return (
              <span 
                className={`note3 ${currentNote === n?.Id ? 'active' : ''}`}
                onClick={(() => setCurrentNote(n?.Id))}
                style={{pointerEvents: isActiveEditMode && currentNote !== -1 ? 'none' : ''}}
              ></span>
            )
          })
        }
        <span 
          className={`note3 ${currentNote === -1 ? 'active' : ''}`}
          onClick={(() => setCurrentNote(-1))}
          style={{pointerEvents: isActiveEditMode && currentNote === -1 ? 'none' : ''}}
        ></span>
      </div>
    </div>
  )
}


export default StickyNotes