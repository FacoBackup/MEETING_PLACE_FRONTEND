import { useEffect, useState } from 'react'
import axios from 'axios'
import Host from '../../Host'
import Cookies from 'universal-cookie';

export default async function useMessage(conversationID, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setMessages([])
  },[conversationID])

  useEffect(() => {
    setLoading(true)
    setError(false)
    if(pageNumber !== null){
      let cancel
      async function fetch(){
        await axios({
          method: 'GET',
          url: Host() + 'api/fetch/by/page',
          headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
          params: { subjectID: conversationID, page: pageNumber, isUser: true },
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setMessages(prevMessages => {
            return [...new Set([...res.data,...prevMessages])]
          })
    
          setHasMore(res.data.lenght > 0 ? (res.data[0].page > 0): false )
          setLoading(false)
        }).catch(e => {
          if (axios.isCancel(e)) return
          setError(true)
        })
      } 
      fetch()
      return () => cancel()
    }
    else{
      setLoading(true)
      setError(false)
      let cancel
      async function fetchNew() {
        await axios({
          method: 'GET',
          url: Host() + 'api/fetch/unseen/messages',
          headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
          params: { subjectID: conversationID, page: null, isUser: true },
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setMessages(prevMessages => {
            return [...new Set([...prevMessages,...res.data])]
          })
  
          setHasMore(false)
          setLoading(false)
        }).catch(e => {
          if (axios.isCancel(e)) return
          setError(true)
        })
      }

      fetchNew()
      return () => cancel()
    }
    
  }, [conversationID, pageNumber])

  return { loading, error, messages, hasMore }
}