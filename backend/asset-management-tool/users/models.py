from django.db import models
from django.db import models
from django.utils.translation import ugettext_lazy as _ 
from django.core.validators import RegexValidator
from django.contrib.auth.models import ( 
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from config_pannel.models import WaterScheme
class UserManager(BaseUserManager):

    def create_administrative_user(self, username, name, password,water_scheme, phone_number = None,email=None):
        water_scheme =  get_object_or_404(WaterScheme, scheme_name = water_scheme)
        if not username:
            raise ValueError(_('User must have an username.'))

        if not name:
            raise ValueError(_('Users must have name.'))

        if not password:
            raise ValueError(_('Administrative Users must have password.'))

        user = self.model(
            username = username,
            name = name,
            water_scheme = water_scheme
        )
        if email:
            user.email=email
        if phone_number:
            user.phone_number=phone_number
        user.is_verified = True
        user.is_active = True
        user.is_administrative_staff = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_care_taker(self, username, name, password, phone_number,water_scheme, email=None):
        if not username:
            raise ValueError(_('User must have an username.'))

        if not name:
            raise ValueError(_('Users must have name.'))

        if not password:
            raise ValueError(_('Users must have password.'))

        if not phone_number:
            raise ValueError(_('Users must have phone number.'))

        user = self.model(
            username = username,
            name = name,
            phone_number = phone_number,
            water_scheme = water_scheme
        )
        if email:
            user.email=email
        user.is_verified = True
        user.is_active = True
        user.is_care_taker = True
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_user(self, username, password, name, email):
        if not username:
            raise ValueError(_('User must have an username.'))

        if not name:
            raise ValueError(_('Users must have name.'))

        user = self.model(
            username = username,
            name = name,
            email = email
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, name, email):
        if not username:
            raise ValueError(_('User must have username'))
        
        if not password:
            raise ValueError(_('User must have password'))

        if not name:
            raise ValueError(_('User must have name'))

        user = self.create_user(
            username = username,
            password = password,
            name = name,
            email = email
        )
        user.is_staff = True
        user.is_verified = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Users(AbstractBaseUser, PermissionsMixin):
    """Default user for asset-management-tool."""

    #: First and last name do not cover name patterns around the globe

    class Lang(models.TextChoices):
        ENGLISH = 'en','en'
        NEPALI = 'nep','nep'

    name = models.CharField(_("Name of User"), max_length=255)
    email = models.EmailField(_('Email Address'), max_length=255,null=True,blank=True)
    username = models.CharField(_('Username'),max_length=100, unique=True)
    first_name = None  # type: ignore
    last_name = None  # type: ignore
    phone_number = models.CharField(max_length=15,null = True, blank = True)
    is_care_taker = models.BooleanField(default = False)
    is_administrative_staff = models.BooleanField(default = False)
    is_verified     = models.BooleanField(_('Is Verified'), default=False)
    is_active       = models.BooleanField(_('is Active'), default=True)
    is_staff        = models.BooleanField(_('is Staff'), default=False)
    is_superuser    = models.BooleanField(_('is Super User'), default=False)
    water_scheme 	= models.ForeignKey(WaterScheme, on_delete = models.SET_NULL, null=True, blank=True, related_name = 'scheme_user')
    user_lang = models.CharField(max_length=5, choices=Lang.choices, default = 'en')
    USERNAME_FIELD  = 'username'
    REQUIRED_FIELDS = ['name', 'email']
    objects = UserManager()

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returans:
            str: URL for user detail.
        """
        return reverse("users:detail", kwargs={"username": self.username})

    def tokens(self):
        token = RefreshToken.for_user(self)
        data ={
            'refresh':str(token),
            'access':str(token.access_token)
        }
        return data