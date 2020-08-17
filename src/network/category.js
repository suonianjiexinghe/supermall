import { request } from './request'

export function getCategory() {
    return request({
        url: 'http://152.136.185.210:8000/api/z8/category',
    })
}

export function getSubCategory(maitKey) {
    return request({
        url: 'http://152.136.185.210:8000/api/z8/subcategory',
        params: {
            maitKey
        }
    })
}

export function getCategoryDetail(miniWallkey, type) {
    return request({
        url: 'http://152.136.185.210:8000/api/z8/subcategory/detail',
        params: {
            miniWallkey,
            type
        }
    })
}