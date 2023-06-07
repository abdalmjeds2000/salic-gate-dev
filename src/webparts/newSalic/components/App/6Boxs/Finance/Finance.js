import React from 'react'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';


function Finance() {

  const editStyle = () => {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
    elmnt.style.backgroundColor = "#fff";
  }

  
  return (
    <>
      <HistoryNavigation>
        <p>Organization Documents - Finance</p>
      </HistoryNavigation>

      <div className='folder-explorer-container'>  

        <iframe 
          src='https://devsalic.sharepoint.com/sites/newsalic/Organization%20Documents/Forms/AllItems.aspx?id=%2Fsites%2Fnewsalic%2FOrganization%20Documents%2FFinance&viewid=724f995e%2Dc54a%2D4cff%2Dab0f%2Db1ac14964cee' 
          width='100%'
          id='spIframe'
          onLoad={editStyle} 
        >
        </iframe>
      </div>
    </>
  )
}

export default Finance