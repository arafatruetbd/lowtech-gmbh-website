import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className="search-box">
    <InputGroup className="rounded shadow-sm">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search for products..."
        className="search-input"
      />
      <Button type="submit" variant="primary" className="search-btn">
        🔍
      </Button>
    </InputGroup>
  </Form>
  );
};

export default SearchBox;
