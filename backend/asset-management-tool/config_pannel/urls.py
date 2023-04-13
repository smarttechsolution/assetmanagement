from django.urls import path
from .views import *
app_name = "main-config"

urlpatterns = [
     path('login/', SuperuserLogin.as_view(), name='superuser-login'),
     path('logout/', superuser_logout, name="superuser-logout"),
     path('scheme/list/', SchemeList.as_view(), name = 'scheme-list'),
     path('scheme/user/list/', SchemeUserList.as_view(), name = 'user-scheme-list'),
     path('scheme/create/', CreateWaterSchemeView.as_view(), name='scheme-create'),
     path('scheme/update/<int:pk>/', UpdateWaterSchemeView.as_view(), name='scheme-update'),
     path('scheme-user/create/', CreateWaterSchemeUserView.as_view(), name='scheme-user-create'),
     path('scheme-user/update/<int:pk>/', UpdateWaterSchemeUserView.as_view(), name='scheme-user-update'),
     path('scheme-user/delete/<int:pk>/', deleteUser, name='scheme-user-delete'),
     path('privacy-policy/', privacy_policy, name='privacy_policy'),

     path('notf-test/', test_notif, name = 'test-notf'),
]