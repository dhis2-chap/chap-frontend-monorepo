import { useMemo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
}

const focusedStyle = {
    borderColor: '#2196f3',
}

const acceptStyle = {
    borderColor: '#00e676',
}

const rejectStyle = {
    borderColor: '#ff1744',
}

const StyledDropzone = ({ onLoad, disabled }: any) => {
    const onDrop = useCallback(
        ([file]: any) => {
            const reader: any = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => onLoad(JSON.parse(reader.result))
            reader.readAsText(file)
        },
        [onLoad]
    )

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: {
            'application/json': ['.json'],
        },
        multiple: false,
        disabled: disabled,
        onDrop,
    })

    const style: any = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    )

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {/*If fetching orgUnits is loading, disable field.*/}
                {disabled ? (
                    <p>{i18n.t('Loading..')}</p>
                ) : (
                    <p>
                        {i18n.t(
                            "Drag 'n' drop prediction/evaluation file, or click to select it"
                        )}
                    </p>
                )}
            </div>
        </div>
    )
}

export default StyledDropzone
