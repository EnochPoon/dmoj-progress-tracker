import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BestStudentSubmission from './BestStudentSubmission';
import { parse } from 'node-html-parser';
import { deleteUsername, requestAppend } from '../store/requestQueue';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import ProblemHeader from './ProblemHeader';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import '../styles/StudentsCompletionTable.scss';

function StudentsCompletionTable(props) {
  const { usernames } = props;
  const [problemTitles, setProblemTitles] = useState({}); //useState(Array.from(problems).reduce((o, p) => Object.assign(o, {[p]: 'a'}), {}));
  const dispatch = useDispatch();
  const problems = useSelector(state => state.requestQueue.problems);

  function attemptDeleteUsername(username) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete user: ' + username + '?')) {
      dispatch(deleteUsername(username));
    }
  }

  function getRow(username) {
    return (
      <tr key={username}>
        {_.map(Object.keys(problems), p => <BestStudentSubmission username={username} problem={p} key={p} />)}
      </tr>
    )
  }

  const handleCallback = (res) => {
    console.log('problem title res:', res);
    const data = res.data.data.object;
    console.log(problemTitles);
    setProblemTitles({ ...problemTitles, [data.code]: data.name });
  }

  return (
    <Row>
      <Col sm="3">
      <Table responsive  striped bordered variant="dark">
        <thead>
          <tr>
            <th><br /><Button size="sm" disabled variant="light">Username</Button></th>
          </tr>
        </thead>
        
        {_.map(Array.from(usernames), username => (
          <tr key={username}>
            <td>
              <div className="username-cell">
                {username}
                <Button variant="danger" size="sm" onClick={() => attemptDeleteUsername(username)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            </td>
          </tr>
        ))
        }
      </Table>
      </Col>
      <Col sm="9">
        <Table responsive striped bordered variant="dark" className="completion-table">
        <thead>
          <tr>
            {Object.keys(problems).map(p => <ProblemHeader key={p} problem={p} problemName={problemTitles[p]} />)}
          </tr>
        </thead>
        <tbody>
          {_.map(Array.from(usernames), username => getRow(username))}
        </tbody>

      </Table>
      </Col>
      
    </Row>

  )
}

export default StudentsCompletionTable;
