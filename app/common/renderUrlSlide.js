export const renderUrlSlide = (slideId, pageObjectId = 'id.#', start = true, delayms = 3, loop = false) => {
    if (!slideId) return ''
    return `https://docs.google.com/presentation/d/${slideId}/embed?start=${start}&loop=${loop}&delayms=${delayms * 1000}&slide=${pageObjectId}`
}