import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
from keras.models import Sequential
from keras.layers import Input, Dense
from keras.callbacks import ModelCheckpoint
import os

class ModelManager:
    def __init__(self):
        #Defining the paths of the working files
        self.base_path = os.getcwd()
        self.data_path = os.path.normpath(self.base_path + os.sep + 'data')
        self.models_path = os.path.normpath(self.base_path + os.sep + 'models')
        self.reference_date = pd.to_datetime('1970-01-01')
        
        # CSV filenames
        self.csv_files = ['ZHVI.csv', 'ZHVI2.csv', 'ZHVI3.csv']

    #Function for loading csv data    
    def load_data(self, csv_path):
        """Load and preprocess the data from a CSV file."""
        try:
            home_price_data = pd.read_csv(csv_path)
            home_price_data['Date'] = pd.to_datetime(home_price_data['Date'])
            home_price_data['Days_Since_Reference'] = (home_price_data['Date'] - self.reference_date).dt.days
            return home_price_data
        except FileNotFoundError:
            raise FileNotFoundError(f"Data file not found at path: {csv_path}")
        except Exception as e:
            raise Exception(f"Error loading data: {e}")
    
    # Function for training the model
    def train(self):
        """Train models for each state using data from multiple CSV files."""
        for csv_file in self.csv_files:
            try:
                print(f"Training models using data from {csv_file}")
                
                # Load data from the current CSV file
                self.data = self.load_data(os.path.join(self.data_path, csv_file))
                self.states = self.data.columns[1:-1]  # Exclude 'Date' and 'Days_Since_Reference'
                
                # Train models for each state using the loaded data
                for state in self.states:
                    print(f"Training model for {state} using data from {csv_file}")
                    
                    # Extract features and target
                    X = self.data[['Days_Since_Reference']].values
                    y = self.data[state].values
                
                    # Split the data for training and testing
                    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                
                    # Standardize features
                    scaler = StandardScaler()
                    X_train_scaled = scaler.fit_transform(X_train)
                    X_test_scaled = scaler.transform(X_test)
                
                    # Define the neural network model
                    model = Sequential([
                        Input(shape=(1,)),
                        Dense(64, activation='relu'),
                        Dense(64, activation='relu'),
                        Dense(1)
                    ])
                
                    # Compile the model
                    model.compile(optimizer='adam', loss='mean_squared_error')
                
                    # Define ModelCheckpoint callback to save model weights
                    checkpoint_filepath = os.path.join(self.models_path, f'{state}_model_checkpoint.weights.h5')
                    checkpoint_callback = ModelCheckpoint(
                        filepath=checkpoint_filepath,
                        save_weights_only=True,
                        monitor='val_loss',
                        mode='min',
                        save_best_only=True
                    )
                
                    # Train the model with ModelCheckpoint callback
                    model.fit(
                        X_train_scaled, y_train,
                        epochs=10000,
                        batch_size=32,
                        verbose=2,
                        validation_data=(X_test_scaled, y_test),
                        callbacks=[checkpoint_callback]
                    )
                
                    # Save the final model and scaler
                    model.save(os.path.join(self.models_path, f'{state}_final_model.keras'))
                    joblib.dump(scaler, os.path.join(self.models_path, f'{state}_scaler.pkl'))
            except Exception as e:
                print(f"Error training models using data from {csv_file}: {e}")

    def make_prediction(self, date_str, state_name):
        """Make a prediction for a given state and date."""
        try:
            # Load the scaler and model for the specified state
            scaler_path = os.path.join(self.models_path, f'{state_name}_scaler.pkl')
            model_path = os.path.join(self.models_path, f'{state_name}_model_checkpoint.weights.h5')
            
            scaler = joblib.load(scaler_path)
            
            model = Sequential([
                Input(shape=(1,)),
                Dense(64, activation='relu'),
                Dense(64, activation='relu'),
                Dense(1)
            ])
            model.compile(optimizer='adam', loss='mean_squared_error')
            model.load_weights(model_path)
            
            # Convert input date to the number of days since the reference date
            input_date = pd.to_datetime(date_str)
            input_date_encoded = np.array([(input_date - self.reference_date).days]).reshape(1, -1)
            
            # Standardize the date feature
            input_date_scaled = scaler.transform(input_date_encoded)
            
            # Make the prediction
            prediction = model.predict(input_date_scaled)
            return prediction[0][0]
        except FileNotFoundError:
            raise FileNotFoundError(f"Model or scaler not found for state: {state_name}")
        except Exception as e:
            raise Exception(f"Error making prediction for {state_name}: {e}")
