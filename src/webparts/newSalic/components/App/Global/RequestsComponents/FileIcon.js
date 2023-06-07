import React from "react";
import imgIcon from '../../../../assets/icons/FilesIcons/jpg.png'
import videoIcon from '../../../../assets/icons/FilesIcons/mp4.png'
import pdfIcon from '../../../../assets/icons/FilesIcons/pdf.png'
import txtIcon from '../../../../assets/icons/FilesIcons/txt.png'
import rarIcon from '../../../../assets/icons/FilesIcons/zip.png'
import wordIcon from '../../../../assets/icons/FilesIcons/doc.png'
import pptIcon from '../../../../assets/icons/FilesIcons/ppt.png'
import csvIcon from '../../../../assets/icons/FilesIcons/csv.png'
import folderIcon from '../../../../assets/icons/FilesIcons/folder.png'
import fileIcon from '../../../../assets/icons/FilesIcons/file.png'
import phpIcon from '../../../../assets/icons/FilesIcons/php.png'
import jsIcon from '../../../../assets/icons/FilesIcons/js.png'
import cssIcon from '../../../../assets/icons/FilesIcons/css.png'

import { Tooltip } from "antd";

const FileIcon = (props) => {
    const checkFileType = (fileType) => {
        if(['jpg', 'jpeg', 'tif', 'tiff', 'bmp', 'png', 'gif', 'raw'].includes(fileType?.toLowerCase())) {
            return imgIcon
        } else if(['mp4', 'mp3', 'webm', 'mkv', 'avi', 'mpeg'].includes(fileType?.toLowerCase())) {
            return videoIcon
        } else if(['pdf'].includes(fileType?.toLowerCase())) {
            return pdfIcon
        } else if(['txt'].includes(fileType?.toLowerCase())) {
            return txtIcon
        } else if(['zip', 'rar'].includes(fileType?.toLowerCase())) {
            return rarIcon
        } else if(['docx', 'doc'].includes(fileType?.toLowerCase())) {
            return wordIcon
        } else if(['pptx', 'ppt'].includes(fileType?.toLowerCase())) {
            return pptIcon
        } else if(['xlsx', 'xls', 'sheet'].includes(fileType?.toLowerCase())) {
            return csvIcon
        } else if(['php'].includes(fileType?.toLowerCase())) {
            return phpIcon
        } else if(['js'].includes(fileType?.toLowerCase())) {
            return jsIcon
        } else if(['css'].includes(fileType?.toLowerCase())) {
            return cssIcon
        } else if(['folder'].includes(fileType?.toLowerCase())) {
            return folderIcon
        } else {
            return fileIcon
        }
    }
    return (
        <Tooltip title={props.FileName}>
            <img 
                src={checkFileType(props.FileType)}
                // title={props.FileName}
                data-originalName={props.FileName}
                data-guid={props.FilePath} 
                onClick={() => props.FilePath ? window.open(props.FilePath, "_blank") : null} 
                width={props.IconWidth}
                className='attachment-file-icon'
            />
        </Tooltip>
    )
}

export default FileIcon;