
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services.modelManager import ModelManager

# Initialize the ModelManager
model_manager = ModelManager()

#GET Request for training the model
@api_view(['GET'])
def train_model(request):
    try:
        model_manager.train()
        return JsonResponse({'message': 'Training completed successfully.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#POST Request for getting predictions with the model
@api_view(['POST'])
def predict_home_value(request):
    try:
        date_str = request.data.get('date')
        state_name = request.data.get('state')
        if not date_str or not state_name:
            return JsonResponse({'error': 'Both date and state parameters are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        prediction = model_manager.make_prediction(date_str, state_name)

        #Casting to float for JSON serialization
        prediction = float(prediction)

        #Returning the JSON response
        return JsonResponse({'state': state_name, 'date': date_str, 'predicted_value': prediction}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#POST Request for getting change estimations between dates    
@api_view(['POST'])
def predict_growth(request):
    try:
        #Defining variables expected in JSON
        date_str1 = request.data.get('date1')
        date_str2 = request.data.get('date2')
        state_name = request.data.get('state')

        #If data is missing, return a JSON response with a bad request
        if not date_str1 or not date_str2 or not state_name:
            return JsonResponse({'error': 'date1, date2, and state are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        #Calculating the predictions with the model
        prediction1 = model_manager.make_prediction(date_str1, state_name)
        prediction2 = model_manager.make_prediction(date_str2, state_name)

        #Casting to float for JSON serialization
        prediction1 = float(prediction1)
        prediction2 = float(prediction2)

        #Calculating changes between predictions
        amount_change = (prediction2 - prediction1)
        percent_change = (((prediction2 - prediction1) / prediction1) * 100)
        
        #Returning the JSON response
        return JsonResponse({'state': state_name, 
                             'date1': date_str1, 
                             'date2': date_str2, 
                             'predicted_value1': prediction1, 
                             'predicted_value2': prediction2,
                             'amount_change': amount_change,
                             'percent_change': percent_change}, 
                             status=status.HTTP_200_OK)
    #Handling an exception
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)