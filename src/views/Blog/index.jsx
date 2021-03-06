import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { getCategory } from '../../store/files'
import Category from './Category'
import './index.sass'

export default function Blog() {
    const [dropdown, setDropdown] = useState(false)

    const dispatch = useDispatch()
    const { title, createdAt, content } = useSelector(state => state.files.article)
    const time = createdAt ? new Date(createdAt).toISOString().slice(0, 10) : ''

    useEffect(() => {
        dispatch(getCategory())
    }, [dispatch])

    return (
        <div className='myapp-blog'>
            <div className='myapp-blog-main-center'>
                <div className='myapp-blog-main-center-catalog'
                    onMouseLeave={() => setDropdown(false)}
                >
                    <div onClick={() => setDropdown(true)}
                        className='myapp-blog-main-center-catalog-button'
                    >
                        Catalog&gt;&gt;
                    </div>
                    {dropdown &&
                    <div className='myapp-blog-main-center-catalog-files'>
                        <Category />
                    </div>}
                </div>

                <div className='myapp-blog-main-center-content'>
                    <div className='myapp-blog-main-center-content-title'>
                        {title}
                    </div>
                    <div className='myapp-blog-main-center-content-time'>
                        {time}
                    </div>
                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>

            <div className='myapp-blog-main-right'>
                <Category />
            </div>
        </div>
    )
}