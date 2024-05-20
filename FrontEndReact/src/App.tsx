import ListGroup from './components/ListGroup';

let heading = 'Illinois Cities';
const cities = ['Chicago', 'Aurora', 'Joliet', 'Naperville', 'Rockford'];

function App() {
  return (
    <div>
      <ListGroup
        onSelectItem={(item: string) => console.log(item)}
        items={cities}
        heading={heading}
      ></ListGroup>
    </div>
  );
}

export default App;
