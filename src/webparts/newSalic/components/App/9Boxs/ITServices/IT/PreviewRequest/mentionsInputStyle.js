export default {
  control: {
    backgroundColor: '#fff',
  },

  '&multiLine': {
    control: {
      fontFamily: 'Arial',
      minHeight: 100,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '1px solid silver',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      boxShadow: '1px 4px 10px rgba(0,0,0,0.2)',
    },
    item: {
      fontFamily: 'Arial',
      padding: '5px 15px',
      borderBottom: '2px solid rgba(0,0,0,0.2)',
      '&focused': {
        backgroundColor: '#82beff',
        color: "#fff"
      },
    },
  },
}