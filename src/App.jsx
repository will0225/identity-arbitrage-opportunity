// src/App.js
import React from 'react';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">React Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Welcome to React Bootstrap</h1>
        <Button variant="primary" size="lg">
          Click Me
        </Button>
      </Container>
    </div>
  );
}

export default App;
