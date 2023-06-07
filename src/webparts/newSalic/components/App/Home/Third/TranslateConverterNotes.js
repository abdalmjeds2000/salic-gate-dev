import React from "react";
import './TranslateConverterNotes.css';
import GoogleTranslate from './GoogleTranslate/GoogleTranslate'
import CurrencyConverter from './CurrencyConverter/CurrencyConverter'
import StickyNotes from './StickyNotes/StickyNotes'


const TranslateConverterNotes = () => {

  return (
    <div className="translate-converter-notes-container">
      <GoogleTranslate />
      <CurrencyConverter />
      <StickyNotes />
    </div>
  )
}

export default TranslateConverterNotes