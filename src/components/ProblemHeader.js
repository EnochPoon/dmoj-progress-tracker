import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { deleteProblem, requestAppend } from '../store/requestQueue';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';


export default function ProblemHeader(props) {
  const { problem } = props;
  const [problemName, setProblemName] = useState('Loading...');
  const dispatch = useDispatch();
  
  function handleCallback(res) {
    const data = res.data.data.object;
    setProblemName(data.name);
    localStorage.problems = JSON.stringify({
      ...JSON.parse(localStorage.problems),
      [problem]: data.name
    });
    console.log('set problem:', data.name);
  }
  useEffect(() => {
    const savedProblems = JSON.parse(localStorage.problems);
    if (savedProblems[problem]) {
      setProblemName(savedProblems[problem]);
    } else {
      dispatch(requestAppend({
          url: "/api/v2/problem/" + problem,
          callback: (res) => handleCallback(res)
      }));
    }
  }, []);
  function attemptDelete() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this problem?')) {
      dispatch(deleteProblem(problem))
    }
  }
  return (
    <th>
      <div>
      <div>
        <div><a href={`https://dmoj.ca/problem/${problem}`} target="_blank" rel="noreferrer">{problem}</a></div>
        {problemName}
      </div>
      
      <Button variant="danger" size="sm" onClick={attemptDelete}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
      </div>
    </th>
  )
}
