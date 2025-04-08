import { Button, IconAdd24, IconArrowRight24, IconDownload24 } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import styles from "./SendOrDownloadButtons.module.css"
import { start } from 'repl'

interface SendOrDownloadButtonsProps {
  startDownload : {
    startDownload : boolean
    action : "predict" | "new-dataset" | "download"
  }
  orgUnits : any[]
  onClickDownloadOrPostData : (action : "predict" | "new-dataset" | "download") => void
  formValid : boolean
  onButtonSendAction : "predict" | "new-dataset"
}

const SendOrDownloadButtons = ({startDownload, formValid: isValid, orgUnits, onClickDownloadOrPostData, onButtonSendAction} : SendOrDownloadButtonsProps) => {

  
  const orgUnitsSelectedIsValid = () => {
    if (orgUnits.length === 0) {
      return true;
    }

    const firstElement = (orgUnits[0] as any).path.split('/').length;
    return orgUnits.every(
      (innerArray : any) =>
        (innerArray as any).path.split('/').length === firstElement
    );
  }

  const rightButtonText = onButtonSendAction === "predict" ? "Send prediction" : "Create dataset"
  const icon = onButtonSendAction === "predict" ? <IconArrowRight24 /> : <IconAdd24 />
  
  
  return (
      <div className={styles.buttons} >
          <Button
            icon={<IconDownload24 />}
            loading={startDownload.startDownload && startDownload.action === "download"}
            disabled={
              !isValid ||
              startDownload.startDownload ||
              !orgUnitsSelectedIsValid()
            }
            onClick={() => onClickDownloadOrPostData("download")}
          >
            Download data
          </Button>
          <Button
            icon={icon}
            primary
            loading={startDownload.startDownload && startDownload.action === onButtonSendAction}
            disabled={!isValid || (startDownload.startDownload) || !orgUnitsSelectedIsValid()}
            onClick={() =>onClickDownloadOrPostData(onButtonSendAction)}
          >
            {rightButtonText}
          </Button>
        </div>
  )
}

export default SendOrDownloadButtons