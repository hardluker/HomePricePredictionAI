import { useState } from 'react';
import './App.css';
import { ExpandableText } from './components/ExpandableText';
import produce from 'immer';
import { Form } from './components/Form';

function App() {
  return (
    <>
      <div>
        <Form></Form>
      </div>
    </>
  );
}

export default App;
