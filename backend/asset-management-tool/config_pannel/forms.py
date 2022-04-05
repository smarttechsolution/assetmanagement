from django import forms
from django.contrib.auth.models import User
from django.db.models import fields
from django.forms import models
from config_pannel.models import WaterScheme  
from users.models import Users
from finance.api.utils import str_to_datetime, convert_nep_date_to_english

class UsersForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(UsersForm, self).__init__(*args, **kwargs)
        
        if self.instance.id:
            self.fields['password'].required=False
    class Meta:
        model = Users
        fields  = ['name','water_scheme','username','password']
        
        widgets={
        'password': forms.PasswordInput(),
        }
    
    def save(self, commit=True):
        instance = super(UsersForm, self).save(commit=False)
        if not self.instance.id:
            if commit:
                instance.is_administrative_staff = True
                instance.is_active = True
                instance.is_verified = True
                password=self.cleaned_data['password']
                instance.set_password(self.cleaned_data['password'])
                instance.save() 
            return instance
        else:
            if commit:
                if not self.cleaned_data['password'] == '':
                    password=self.cleaned_data['password']
                    instance.set_password(self.cleaned_data['password'])
                    instance.save()
                Users.objects.filter(id=instance.id).update(
                name = self.cleaned_data['name'],
                water_scheme = self.cleaned_data['water_scheme'],
                username= self.cleaned_data['username']
                )
            return Users.objects.get(id=instance.id)
    
    # def clean_phone_number(self):       
    #     phone_number = self.cleaned_data.get('phone_number',None)
    #     if not self.instance.phone_number:
    #         if phone_number:
    #             if Users.objects.filter(phone_number=phone_number).exists():
    #                 raise forms.ValidationError("This phone number is already used.")
    #     else:
    #         if phone_number:
    #             if Users.objects.filter(phone_number=phone_number).count() > 1:
    #                 raise forms.ValidationError("This phone number is already used.")
    #     return phone_number

class WaterSchemeForm(forms.ModelForm):
    class Meta:
        model = WaterScheme
        fields = '__all__'
        exclude = ['slug',]

    def clean(self):
        data = self.cleaned_data
        date_format = data.get('system_date_format',None)
        system_built_date = data.get('system_built_date',None)
        # system_operation_from = self.cleaned_data.get('system_operation_from',None)
        # system_operation_to = self.cleaned_data.get('system_operation_to',None)
        tool_start_date = self.cleaned_data.get('tool_start_date',None)

        if date_format == 'nep':
            data['system_built_date'] = convert_nep_date_to_english(str(system_built_date))
            # data['system_operation_from'] = convert_nep_date_to_english(str(system_operation_from))
            # data['system_operation_to'] = convert_nep_date_to_english(str(system_operation_to))
            data['tool_start_date'] = convert_nep_date_to_english(str(tool_start_date))

        return data