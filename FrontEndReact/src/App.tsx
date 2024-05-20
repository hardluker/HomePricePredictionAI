import ListGroup from './components/ListGroup';

function App() {
  let cities = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];
  let colors = ['blue', 'green', 'yellow', 'red', 'purple'];
  return (
    <div>
      <ListGroup items={cities} heading="Cities" />
      <ListGroup items={colors} heading="Colors" />
    </div>
  );
}

export default App;
