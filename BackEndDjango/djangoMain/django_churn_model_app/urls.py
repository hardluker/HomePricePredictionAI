from django.urls import path
from .views import train_model, predict_home_value, predict_growth_median, predict_growth_specific, get_states_list

print("Loading URL patterns from APP")
urlpatterns = [
    # path('train/', train_model, name='train_model'), #Commented out to prevent usage in production 
    path('predict/', predict_home_value, name='predict_home_value'),
    path('median-growth/', predict_growth_median, name='predict_growth_median'),
    path('specific-growth/', predict_growth_specific, name='predict_growth_specific'),
    path('get-states/', get_states_list, name='get_states_list')
]
print("APP patterns loaded")