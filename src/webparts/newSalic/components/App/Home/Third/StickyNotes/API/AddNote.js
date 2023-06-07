import pnp from 'sp-pnp-js';

export default async function AddNote(newTitle, newDescription) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Sticky Notes').items.add({
      Title: newTitle,
      NoteDescription: newDescription, 
    })
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}
