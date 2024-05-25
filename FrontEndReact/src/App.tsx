import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios, { CanceledError } from 'axios';
import { PriceGrowthForm } from './predictorComponents/PriceGrowthForm';

function App() {
  const [states, setStates] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  //Effect to update the states array with the GET request.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    axios
      .get<{ states: string[] }>('http://127.0.0.1:8000/api/get-states/', {
        signal: controller.signal
      })
      .then((response) => {
        setStates(response.data.states);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/specific-growth/',
        data
      );
      setResponse(response.data); // Store the response data in state
    } catch (error) {
      // Handle error, e.g., display an error message
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <>
      <h1>
        Home Price Predictor{' '}
        <span className="badge text-bg-secondary">AI Powered</span>
      </h1>
      {!submitted && (
        <PriceGrowthForm onSubmit={handleSubmit} states={states} />
      )}
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}

      {response &&
        submitted && ( // Render response data if available
          <div className="results">
            <div className="results alert alert-success">
              <h2>Results:</h2>
              <div className="mb-3">
                It is estimated the home price will have changed by{' '}
                {response.percentChange.toFixed(2)}% in the state of{' '}
                {response.state} during this time.
              </div>
              <div>Starting Price: ${response.startPrice.toFixed(2)}</div>
              <div className="mb-3">Starting Date: {response.startDate}</div>
              <div>Projected Price: ${response.projectedPrice.toFixed(2)}</div>
              <div>End Date: {response.endDate}</div>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="btn btn-success"
            >
              Return
            </button>
            <p className=" warning text-danger mt-5">
              <div>
                Note: This AI model was trained on the Zillow Home Value Index.
              </div>
              <div>
                This tool is simply to provide a visualization of predictive
                outcomes.
              </div>
              <div>This is not financial advice.</div>
            </p>
          </div>
        )}
    </>
  );
}

export default App;
