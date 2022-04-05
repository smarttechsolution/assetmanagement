from rest_framework import serializers
from users.models import Users
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from django.utils.encoding import smart_bytes,smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.shortcuts import get_object_or_404
import nepali_datetime
from asset_management_system.utils import english_to_nepali_converter
import datetime
from config_pannel.models import OtherExpenseInflationRate

class MobileUserLoginSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=255,required=True)
    password = serializers.CharField(max_length=30, min_length=4, write_only=True)
    name = serializers.CharField(max_length=255, read_only=True)
    water_scheme_slug =serializers.CharField(max_length=50, read_only=True)
    tokens = serializers.ReadOnlyField()
    water_scheme= serializers.ReadOnlyField()
    system_date_format = serializers.ReadOnlyField()
    user_lang =  serializers.ReadOnlyField()
    currency =  serializers.ReadOnlyField()
    dis_allow_edit=serializers.ReadOnlyField()
    class Meta:
        model = Users
        fields = ['id','phone_number','name','password','tokens','water_scheme','water_scheme_slug','user_lang','system_date_format','currency','dis_allow_edit',]

    def validate(self, attrs):
        phone_number = attrs.get('phone_number','')
        password = attrs.get('password','')
        try:
            username=Users.objects.get(phone_number=phone_number).username
        except:
            raise AuthenticationFailed('Invalid Phone Number.')
        user = auth.authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credential, try with valid credentials.')
        if not user.is_active:
            raise AuthenticationFailed('Account is not active, please contact at help@travelers.com')
        if not user.is_verified:
            raise AuthenticationFailed('User is not verified.')
        dis_allow_edit = OtherExpenseInflationRate.objects.filter(water_scheme=user.water_scheme).last()
        if dis_allow_edit:
            dis_allow_edit=dis_allow_edit.dis_allow_edit
        else:
            dis_allow_edit=False
        data = {
            'id':user.id,
            'name':user.name,
            'tokens':user.tokens(),
            'phone_number':user.phone_number,
            'water_scheme':user.water_scheme.scheme_name,
            'water_scheme_slug':user.water_scheme.slug,
            'system_date_format':user.water_scheme.system_date_format,
            'user_lang':user.user_lang,
            'currency':user.water_scheme.currency,
            'dis_allow_edit':dis_allow_edit,
        }
        return  data
class WebUserLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=255,required=True)
    password = serializers.CharField(max_length=30, min_length=6, write_only=True)
    name = serializers.CharField(max_length=255, read_only=True)
    tokens = serializers.ReadOnlyField()
    water_scheme= serializers.ReadOnlyField()
    slug= serializers.ReadOnlyField()
    class Meta:
        model = Users
        fields = ['id','username','name','password','tokens','water_scheme','slug']

    def validate(self, attrs):
        username = attrs.get('username','')
        password = attrs.get('password','')
        try:
            username=Users.objects.get(username=username).username
        except:
            raise AuthenticationFailed('Invalid Username.')
        user = auth.authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credential, try with valid credentials.')
        if not user.is_active:
            raise AuthenticationFailed('Account is not active, please contact at help@travelers.com')
        if not user.is_verified:
            raise AuthenticationFailed('User is not verified.')

        data = {
            'id':user.id,
            'name':user.name,
            'tokens':user.tokens(),
            'username':username,
            'water_scheme':user.water_scheme.scheme_name,
            'slug':user.water_scheme.slug
        }
        return  data

class WaterSchemeUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=30, min_length=7, write_only=True)
    password2 = serializers.CharField(max_length=30, min_length=7, write_only=True)

    class Meta:
        model = Users
        fields = ['id', 'username', 'name', 'phone_number', 'email','water_scheme','password1','password2']

    def validate(self, attrs):
        username = attrs.get('username',None)
        if not username:
            raise serializers.ValidationError('User must have an username')

        if Users.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists.')

        name = attrs.get('name','')
        phone_number = attrs.get('phone_number','')
        email = attrs.get('email','')
        water_scheme = attrs.get('water_scheme','')

        if not water_scheme:
            raise serializers.ValidationError('User must have water scheme')

        if not name:
            raise serializers.ValidationError('User must have name')

        password1 = attrs.get('password1','')
        password2 = attrs.get('password2','')

        if password1 != password2:
            raise serializers.ValidationError('Password does not match!')

        attrs.pop('password1')
        attrs.pop('password2')
        attrs['password'] = password1
        return attrs

    def create(self, validated_data):
        return Users.objects.create_administrative_user(**validated_data)

class UpdateWaterSchemeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'name', 'phone_number', 'email']

    def validate(self, attrs):
        name = attrs.get('name','')
        water_scheme = attrs.get('water_scheme','')

        if not water_scheme:
            raise serializers.ValidationError('User must have water scheme')

        if not name:
            raise serializers.ValidationError('User must have name')
        return attrs
class CreateCareTakerSerializers(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=30, min_length=4, write_only=True)
    password2 = serializers.CharField(max_length=30, min_length=4, write_only=True)
    
    class Meta:
        model = Users
        fields = ['id', 'name', 'phone_number','password1','password2']

    def validate(self, attrs):
        # username = attrs.get('username',None)
        # if not username:
        #     raise serializers.ValidationError('User must have an username')

        # if Users.objects.filter(username=username).exists():
        #     raise serializers.ValidationError('Username already exists.')

        phone_number = attrs.get('phone_number','')
        if not phone_number:
            raise serializers.ValidationError('Phone number required.')
        if not len(phone_number) == 10:
            raise serializers.ValidationError('Phone number must have 10 digits.')

        if Users.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError('Phone number already exists.')

        name = attrs.get('name','')
        # email = attrs.get('email','')
        water_scheme = attrs.get('water_scheme','')

        if not name:
            raise serializers.ValidationError('User must have name')

        password1 = attrs.get('password1','')
        password2 = attrs.get('password2','')
        import random
        num = random.randrange(1, 10**3)
        attrs['username'] = str(int(phone_number) + int(num))

        if password1 != password2:
            raise serializers.ValidationError('Password does not match!')

        attrs.pop('password1')
        attrs.pop('password2')
        attrs['password'] = password1
        attrs['water_scheme']=get_object_or_404(Users,id = self.context['request'].user.id).water_scheme
        return attrs

    def create(self, validated_data):
        return Users.objects.create_care_taker(**validated_data)

class UpdateCareTakerSerializers(serializers.ModelSerializer):
    password1 = serializers.CharField(max_length=30, min_length=4, write_only=True, required=False)
    password2 = serializers.CharField(max_length=30, min_length=4, write_only=True, required=False)
    class Meta:
        model = Users
        fields = ['id', 'name', 'phone_number','password1','password2']

    def validate(self, attrs):
        if self.instance:
            # username = attrs.get('username',None)
            # if not username:
            #     raise serializers.ValidationError('User must have an username')

            # if not self.instance.username == username:
            #     if Users.objects.filter(username=username).exists():
            #         raise serializers.ValidationError('Username already exists.')

            phone_number = attrs.get('phone_number','')
            if not phone_number:
                raise serializers.ValidationError('Phone number is required.')
            if not len(phone_number) == 10:
                raise serializers.ValidationError('Phone number must have 10 digits.')

            if not self.instance.phone_number == phone_number:
                if Users.objects.filter(phone_number=phone_number).exists():
                    raise serializers.ValidationError('Phone number already exists.')

        name = attrs.get('name','')
        # email = attrs.get('email','')
        water_scheme = attrs.get('water_scheme','')

        if not name:
            raise serializers.ValidationError('User must have name')

        password1 = attrs.get('password1','')
        password2 = attrs.get('password2','')

        if password1 and password2:
            if password1 != password2:
                raise serializers.ValidationError('Password does not match!')

            attrs.pop('password1')
            attrs.pop('password2')
            attrs['password'] = password1
        else:
            attrs['password'] = None

        import random
        num = random.randrange(1, 10**3)
        attrs['username'] = str(int(phone_number) + int(num))
        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        Users.objects.filter(id=instance.id).update(username = validated_data.get('phone_number'),
            phone_number = validated_data.get('phone_number'),
            name = validated_data.get('name'))
        if password:
            instance.set_password(password)
            instance.save()
        return Users.objects.get(id=instance.id)
class CareTakerListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'is_care_taker', 'username', 'phone_number', 'name']
class UpdateUSerLanguagePreferanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_lang']