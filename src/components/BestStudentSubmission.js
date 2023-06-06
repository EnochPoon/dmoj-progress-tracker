import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestAppend } from '../store/requestQueue';
import { Badge, Button, Spinner } from 'react-bootstrap';

const statusColours = {
  'AC': 'success',
  'WA': 'danger',
  'IR': 'warning',
  'RTE': 'warning',
  'OLE': 'warning',
  'MLE': 'warning',
  'TLE': 'secondary',
  'IE': 'danger'
}
export default function BestStudentSubmission(props) {
  const { username, problem } = props;
  const url = `/api/v2/submissions?user=${username}&problem=${problem}`
  const [status, setStatus] = useState("");
  const requestQueue = useSelector(state => state.requestQueue.queue);
  const dispatch = useDispatch();
  
  function handleResponse(res) {
    console.log('full res:', res);
    // get all submissions
    const submissions = res.data.data.objects.slice();
    
    submissions.sort((a, b) => {
      return b.points - a.points;
    });
    if (submissions.length) {
      console.log(submissions[0]);
      setStatus(submissions[0].result);
      // update localStorage
      localStorage.setItem('knownStatuses', JSON.stringify({
        ...JSON.parse(localStorage.knownStatuses),
        [url]: submissions[0].result
      }));
    } else {
      setStatus('No Submissions');
    }

    // put this back into the request queue if needed
    if (submissions.length === 0 || submissions[0].result !== 'AC') {
      dispatch(requestAppend({
        url,
        callback: handleResponse
      }));
    }
  }

  useEffect(() => {
    // try getting from localstorage first
    const knownStatuses = JSON.parse(localStorage.knownStatuses);
    
    if (knownStatuses[url]) {
      setStatus(knownStatuses[url]);
    }
    if (knownStatuses[url] !== 'AC') {
      dispatch(requestAppend({
        url,
        callback: handleResponse
      }));
    }
    
  }, []);

  useEffect(() => {

    // axios.get(`/api/v2/submissions?user=${username}&problem=${problem}`)
    // .then(data => {
    //   console.log(data);
    //   if (Object.keys(data.data.data.objects).length === 0) {
    //     setStatus('N/A');
    //   } else {
    //     const bestSubmission = Object.values(data.data.data.objects).reduce((s1, s2) => {
    //         if (s1.points > s2.points) return s1;
    //         if (s2.points > s1.points) return s2;

    //         // point values equal
    //         if (new Date(s1.date) > new Date(s2.date)) {
    //           return s1;
    //         }
    //         return s2;
    //       }, data.data.data.objects[0]);
    //     setStatus(bestSubmission.result);
    //   }
    // })
    // axios.get('https://dmoj.ca')
    // .then(data => console.log(data));

    // fetch('https://dmoj.ca', { mode: 'no-cors'});
  }, [status]);

  

  return (
    <td>
      {/* <button onClick={() => dispatch(requestAppend({
        url: `/api/v2/submissions?user=${username}&problem=${problem}`,
        callback: handleResponse
      }))}>
        {`${username} ${problem}`}
      </button> */}
      {status? (
        <a href={`https://dmoj.ca/problem/${problem}/submissions/${username}/`} target="_blank" rel="noreferrer">
        <Button variant={statusColours[status] || 'secondary'}>{status}</Button></a>
         ) : (
          <Spinner role="status" />
        )}
      
      
    </td>
  );

}
