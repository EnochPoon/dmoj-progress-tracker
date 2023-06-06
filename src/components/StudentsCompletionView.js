import React, { useState, useEffect, useRef } from 'react';
import StudentsCompletionTable from './StudentsCompletionTable';
import { useDispatch, useSelector } from 'react-redux';
import { requestResolveNext, resetRequestQueue, addProblem, addUsername } from '../store/requestQueue';
import { Button, Col, Form, Row } from 'react-bootstrap';

function StudentsCompletionView(props) {
  // const [usernames, setUsernames] = useState(new Set(['petersonguo', '16BitNarwhal', 'ChaSiu']));
  const [problems, setProblems] = useState(new Set(['boolean', 'cco14p1']));
  const dispatch = useDispatch();
  const requestQueue = useSelector(state => state.requestQueue.queue);
  const requestCount = useSelector(state => state.requestQueue.requestCount);
  const lastCallTime = useSelector(state => state.requestQueue.lastCallTime);
  const usernames = useSelector(state => state.requestQueue.usernames);
  const problemInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  function handleAddProblem() {
    dispatch(addProblem(problemInputRef.current.value));
    // setProblems(new Set([...problems, problemInputRef.current.value]));
    problemInputRef.current.value = '';
  }
  function handleAddUsername() {
    dispatch(addUsername(usernameInputRef.current.value));
    usernameInputRef.current.value = '';
  }
  useEffect(() => {
    setInterval(() => dispatch(resetRequestQueue()), 5000);
  }, []);

  return (
    <div>
      <Row>
          <Form.Label column sm="2">Add new problem</Form.Label>
          <Col sm="7">
            <Form.Control sm="7" ref={problemInputRef} />
          </Col>
          <Col sm="3">
            <Button sm="3" onClick={handleAddProblem}>Add</Button>
          </Col>
      </Row>
      <Row>
          <Form.Label column sm="2">Add new username</Form.Label>
          <Col sm="7">
            <Form.Control sm="7" ref={usernameInputRef} />
          </Col>
          <Col sm="3">
            <Button sm="3" onClick={handleAddUsername}>Add</Button>
          </Col>
      </Row>
      

      <StudentsCompletionTable usernames={usernames} problems={problems}/>
      <Button onClick={() => dispatch(requestResolveNext())}>Get Next</Button>
      
      <div>Request Count: {requestCount}</div>
      <div>Last Call Time: {`${lastCallTime.getHours() % 12}:${lastCallTime.getMinutes()}:${lastCallTime.getSeconds()}`}</div>
      <ul>
        {[...requestQueue].map(item => <li key={item[0]}>{item[0]}</li>)}
      </ul>
    </div>
    
  );
}

export default StudentsCompletionView;
