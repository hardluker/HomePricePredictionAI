# Importing necessary modules for training
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
        self.zhvi_csv_path = os.path.join(self.data_path, 'ZHVI3.csv')

        #Defining a reference date for calculating regression
        self.reference_date = pd.to_datetime('1970-01-01')
        
        self.data = self.load_data()
        self.states = self.data.columns[1:-1]  # Exclude 'Date' and 'Days_Since_Reference'
    
    #Loading and pre-processing the data for training
    def load_data(self):
        """Load and preprocess the data."""
        try:
            home_price_data = pd.read_csv(self.zhvi_csv_path)
            home_price_data['Date'] = pd.to_datetime(home_price_data['Date'])
            home_price_data['Days_Since_Reference'] = (home_price_data['Date'] - self.reference_date).dt.days
            return home_price_data
        except FileNotFoundError:
            raise FileNotFoundError(f"Data file not found at path: {self.zhvi_csv_path}")
        except Exception as e:
            raise Exception(f"Error loading data: {e}")
    
    #Train the models for each state
    def train(self):
        """Train models for each state."""
        for state in self.states:
            try:
                print(f"Training model for {state}")
                
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
                    epochs=2000,
                    batch_size=32,
                    verbose=2,
                    validation_data=(X_test_scaled, y_test),
                    callbacks=[checkpoint_callback]
                )
                
                # Save the final model and scaler
                model.save(os.path.join(self.models_path, f'{state}_final_model.keras'))
                joblib.dump(scaler, os.path.join(self.models_path, f'{state}_scaler.pkl'))
            except Exception as e:
                print(f"Error training model for {state}: {e}")

    #Predict the home value based on state and date
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