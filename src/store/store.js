import { configureStore } from '@reduxjs/toolkit'
import requestQueueReducer from './requestQueue'
import usernames from './usernames'
import { enableMapSet } from 'immer';

enableMapSet();

export default configureStore({
  reducer: {
    requestQueue: requestQueueReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})
