import React, { useContext } from 'react'
import { AppCtx } from '../../../App';


const editStyle = () => {
  var iframe = document.getElementById("spIframeESignFolder");
  var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
  elmnt.style.backgroundColor = "#fff";
  var btn = iframe.contentWindow.document.getElementsByClassName("librariesDropdown_c258b0e8");
  btn[0].style.display = "none";
}


function ESignFolder() {
  const { user_data } = useContext(AppCtx);

    return (
      Object.keys(user_data).length > 0
      ? <div>
          <iframe 
            src={`https://devsalic.sharepoint.com/sites/newsalic/eDocument/Forms/AllItems.aspx`} 
            width='100%'
            id='spIframeESignFolder'
            onLoad={editStyle}
          >
          </iframe>
        </div>
      : <></>
    )
}

export default ESignFolder