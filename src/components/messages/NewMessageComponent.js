import React, { useState, useRef, useCallback } from 'react'
import useMessage from './UseMessage'

export default function MessageComponent(conversationID) {
  
    const [pageNumber, setPageNumber] = useState()
        
    const [messages, setMessages] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

        

    // async function setThings(params) {
    //     const result =  await useMessage(conversationID,(pageNumber !== null && typeof pageNumber !== 'undefined') ? pageNumber: null)

    // }
    const observer = useRef()
    const lastMessageElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
        })
        if (node) {
            observer.current.observe(node)
            setPageNumber(node.page)
        }
    }, [loading, hasMore])

    return (
        <>
        {messages.map((message, index) => {
            if (messages.length === index + 1) {
            return <div ref={lastMessageElementRef} key={message.id}>{message.content}</div>
            } else {
            return <div key={message}>{message}</div>
            }
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
        </>
    )
}