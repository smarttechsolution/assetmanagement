from django.urls import path
from .views import *

app_name = "users"
urlpatterns = [
    path('mobile-login/', MobileLoginAPIView.as_view(), name='mobile-login'),
    path('web-login/', WebLoginAPIView.as_view(), name='web-login'),
    path('user/care-taker/list/', CareTakerListView.as_view(), name='care-taker-list'),
    path('water-scheme/user/create/', CreateWaterSchemaAdministrativeUser.as_view(), name='water-scheme-user-create'),
    path('water-scheme/user/update/<slug:username>/',UpdateWaterSchemaAdministrativeUser.as_view(), name = 'water-scheme-user-update'),
    path('water-scheme/care-taker/create/', CreateCareTakerView().as_view()),
    path('water-scheme/care-taker/update/<int:pk>/', UpdateCareTakerView().as_view()),
    path('language/preferance/change/<int:pk>/', UpdateUserLanguagePreferanceView.as_view())
]
