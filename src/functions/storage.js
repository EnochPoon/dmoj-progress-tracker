export function requestNextBatch() {
  
}

export function initLocalStorage() {
  if (localStorage.getItem('initialized') === null) {
    localStorage.setItem('initialized', true);
    localStorage.setItem('requestQueue', []);
    localStorage.setItem('lastCallMinute', new Date());
    localStorage.setItem('requestCount', 0);
  }
  
}


export function queueRequest(url, reqtype = 'get') {

}
