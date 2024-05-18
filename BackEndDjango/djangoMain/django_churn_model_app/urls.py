from django.urls import path
from .views import train_model, predict_home_value, predict_growth

print("Loading URL patterns from APP")
urlpatterns = [
    path('train/', train_model, name='train_model'),
    path('predict/', predict_home_value, name='predict_home_value'),
    path('growth/', predict_growth, name='predict_growth'),
]
print("APP patterns loaded")