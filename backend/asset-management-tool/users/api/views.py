from .serializer import (MobileUserLoginSerializer,
    WebUserLoginSerializer,
    WaterSchemeUserSerializer,
    UpdateWaterSchemeUserSerializer,
    CreateCareTakerSerializers,
    CareTakerListSerializer,
    UpdateCareTakerSerializers,
    UpdateUSerLanguagePreferanceSerializer,)
from .renderers import (
    UserRenderer,
)
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import Users
from django.contrib.sites.shortcuts import get_current_site
import jwt
from django.conf import settings
from django.utils.encoding import smart_bytes,smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveUpdateAPIView
from .permission import IsSuperuser,IsRightAdministratorToUpdateUser,IsAdministrator,IsSchemeAdministrator,IsCareTaker
from django.shortcuts import get_object_or_404

class MobileLoginAPIView(generics.GenericAPIView):
    serializer_class = MobileUserLoginSerializer
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status = status.HTTP_200_OK)

class WebLoginAPIView(generics.GenericAPIView):
    serializer_class = WebUserLoginSerializer
    # renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
class CreateWaterSchemaAdministrativeUser(CreateAPIView):
    serializer_class = WaterSchemeUserSerializer
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated,IsSuperuser]
    queryset = Users.objects.all()

class UpdateWaterSchemaAdministrativeUser(RetrieveUpdateAPIView):
    serializer_class = UpdateWaterSchemeUserSerializer
    permission_classes = [IsAuthenticated,(IsSuperuser | IsRightAdministratorToUpdateUser)]
    queryset = Users.objects.all()
    lookup_field = 'username'

class UpdateUserLanguagePreferanceView(RetrieveUpdateAPIView):
    serializer_class = UpdateUSerLanguagePreferanceSerializer
    permission_classes = [IsAuthenticated, IsCareTaker]
    queryset = Users.objects.all()
    lookup_field = 'pk'

    def get_objects(self, request):
        user = get_object_or_404(Users, id = self.request.user.id)
        return Users.objects.filter(water_scheme = user.water_scheme, is_care_taker = True)
class CreateCareTakerView(CreateAPIView):
    serializer_class = CreateCareTakerSerializers
    permission_classes = [IsAuthenticated,IsAdministrator]
    queryset = Users.objects.all()

class UpdateCareTakerView(RetrieveUpdateAPIView):
    serializer_class = UpdateCareTakerSerializers
    permission_classes = [IsAuthenticated,IsAdministrator]
    queryset = Users.objects.filter(is_care_taker=True)
    lookup_field = 'pk'

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return Users.objects.filter(water_scheme = user.water_scheme, is_care_taker = True)

class CareTakerListView(ListAPIView):
    serializer_class = CareTakerListSerializer
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = Users.objects.all()

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return Users.objects.filter(water_scheme = user.water_scheme, is_care_taker = True)
