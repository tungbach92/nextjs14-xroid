import React from 'react'
import {cloneDeep} from "lodash";

export const onUploadImage = async (event: any, {
    index,
    setLoadingImage,
    setImage,
    image,
    errorUpload,
    setErrorUpload
}: any) => {

    setLoadingImage(true)
    try {
        if (!event) return
        const file = event.target.files[0]

        // const storageRef = '' // ref
        // const snapshot = await uploadBytes(storageRef, file)
        // const url = await getDownloadURL(snapshot.ref)

        const _url = file?.name
        const images = cloneDeep(image)
        images[index].url = _url
        setImage([...images])

        if (!file) return
        if (errorUpload) setErrorUpload('')

    } catch (e) {
        console.log(e)
    } finally {
        setLoadingImage(false)
    }
}
