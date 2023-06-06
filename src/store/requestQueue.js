import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';



if (localStorage.getItem('initialized') === null) {

  const initStorage = {
    initialized: true,
    queue: [],
    lastCallTime: new Date(),
    requestCount: 0,
    knownStatuses: '{}',
    usernames: [],
    problems: '{}'
  }
  
  for (const key in initStorage) {
    localStorage.setItem(key, initStorage[key]);
  }
  
}
console.log('localStorage:', localStorage);

const initialState = {
    queue: new Map(),
    lastCallTime: new Date(localStorage.getItem('lastCallTime')),
    requestCount: Number(localStorage.getItem('requestCount')),
    knownStatuses: JSON.parse(localStorage.getItem('knownStatuses')),
    usernames: new Set(),
    problems: JSON.parse(localStorage.problems)
}

if (localStorage.usernames !== '') {
  initialState.usernames = new Set(localStorage.usernames.split(','));
}

// set up queue
if (localStorage.getItem('queue') !== '') {
  for (const url of localStorage.getItem('queue').split(',')) {
    initialState.queue.set(url, () => {}); 
  }
}


const REQUEST_LIMIT = 30;

export const requestQueueSlice = createSlice({
  name: 'requestQueue',
  initialState,
  reducers: {

    requestResolveNext: (state) => {
      if (state.queue.size && state.requestCount < REQUEST_LIMIT) {
        const url = [...state.queue.keys()][0];
        const callback = state.queue.get(url);
        state.queue.delete(url);
        axios.get(url).then(data => callback(data));
        state.requestCount += 1;
        localStorage.setItem('requestCount', state.requestCount);
        localStorage.setItem('queue', Array.from(state.queue.keys()));
        // state.queue.set(url, callback);
        // localStorage.setItem('queue', Array.from(state.queue.keys()));
      }
    },
    requestAppendOnce: (state, action) => {
      console.log(action);
      const {url, callback} = action.payload;
      state.queue.set(url, callback); // may or may not extend the queue
      localStorage.setItem('queue', Array.from(state.queue.keys()));
    },
    requestAppend: (state, action) => {
      
      console.log(action);
      const {url, callback} = action.payload;
      
      // if (state.queue.size && state.requestCount < REQUEST_LIMIT) {
      //   callback(url);
      //   state.requestCount += 1;
      // }
      state.queue.set(url, callback);
      localStorage.setItem('queue', Array.from(state.queue.keys()));
    },
    resetRequestQueue: function(state) {
      // check for time difference since last batch process
      const timediff = new Date() - state.lastCallTime;
      
      if (timediff > 60000) {
        console.log('reset')
        // state.lastCallTime = new Date();
        localStorage.setItem('lastCallTime', state.lastCallTime = new Date());
        state.requestCount = 0;
        localStorage.setItem('requestCount', state.requestCount = 0);
        
      }
      const queueArray = Array.from(state.queue);
      for (const item of queueArray) {
        if (state.requestCount >= REQUEST_LIMIT) break;
        state.queue.delete(item[0]);
        
        // callback
        axios.get(item[0]).then(data => item[1](data));

        // state.queue.set(item[0], item[1]);
        state.requestCount += 1;
        localStorage.requestCount = state.requestCount
        localStorage.queue = Array.from(state.queue.keys())
      }
      
    },
    addProblem: (state, action) => {
      if (!state.problems[action.payload]) {
        state.problems[action.payload] = '';
        localStorage.problems = JSON.stringify(state.problems);
      }
    },
    deleteProblem: (state, action) => {
      // action.payload = problem id, such as "ccc16j1"

      // update problems
      delete state.problems[action.payload];
      localStorage.problems = JSON.stringify(state.problems);

      // update knownStatuses
      const statusesToDelete = Object.keys(state.knownStatuses).filter(s => s.endsWith(`problem=${action.payload}`));
      for (const s of statusesToDelete) {
        delete state.knownStatuses[s];
      }
      localStorage.knownStatuses = JSON.stringify(state.knownStatuses);
      
      // update queue
      for (const url of Array.from(state.queue.keys())) {
        if (url.endsWith(`problem=${action.payload}`)) {
          state.queue.delete(url);
        }
      }
      localStorage.queue = Array.from(state.queue.keys());
    },

    addUsername: (state, action) => {
      // action.payload = username string
      if (action.payload) {
        state.usernames.add(action.payload);
        localStorage.usernames = Array.from(state.usernames);
      }
    },

    deleteUsername: (state, action) => {
      // action.payload = username string

      // update usernames
      state.usernames.delete(action.payload);
      localStorage.usernames = Array.from(state.usernames);

      // update knownStatuses
      const statusesToDelete = Object.keys(state.knownStatuses).filter(s => s.includes(`user=${action.payload}&`) || s.endsWith(`/user/${action.payload}`));
      for (const s of statusesToDelete) {
        delete state.knownStatuses[s];
      }
      localStorage.knownStatuses = JSON.stringify(state.knownStatuses);

      // update queue
      for (const url of Array.from(state.queue.keys())) {
        if (url.includes(`user=${action.payload}&`) || url.endsWith(`user/${action.payload}`)) {
          state.queue.delete(url);
        }
      }
      localStorage.queue = Array.from(state.queue.keys());
    }
  }
})

// Action creators are generated for each case reducer function
export const { requestAppend, requestResolveNext, resetRequestQueue, addProblem, deleteProblem, addUsername, deleteUsername } = requestQueueSlice.actions

export default requestQueueSlice.reducer
