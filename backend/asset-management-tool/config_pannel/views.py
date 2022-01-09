from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic.edit import UpdateView
from .models import *
from django.views.generic import ListView, TemplateView,CreateView,UpdateView, DeleteView
from django.contrib.auth import authenticate, login
from users.models import Users
from django.http import HttpResponseRedirect
from .forms import WaterSchemeForm, UsersForm
from asset_management_system.pusher import sendPushNotification
# Create your views here.

class SuperuserLogin(TemplateView):
    template_name = 'login.html'
    def get(self, request, *args, **kwargs):
        return render(request,self.template_name)

    def post(self,request, *args, **kwargs):
        password = request.POST.get('password')
        username = request.POST.get('username')
        try:
            user = get_object_or_404(Users, username=username, is_superuser=True)
        except:
            return render(request, 'login.html', {'error': 'Wrong credintials'})

        user = authenticate(request, username=user.username, password=password)
        if user is not None:
            login(request, user)
            return redirect('main-config:scheme-list')
        else:
            return render(request, 'login.html', {'error': 'Wrong credintials'})


from django.contrib.auth.mixins import LoginRequiredMixin
class SchemeList(LoginRequiredMixin,ListView):
    template_name = 'water_scheme_list.html'
    model = WaterScheme
    context_object_name = 'schemes'
    ordering = '-id'

    def get_context_data(self, *, object_list=None, **kwargs):
        """Get the context for this view."""
        from decouple import config
        print(config('FRONTEND_DOMAIN_URL'),'---------')
        import nepali_datetime
        from finance.api.utils import str_to_datetime
        queryset = object_list if object_list is not None else self.object_list
        for i in range(len(queryset)):
            if queryset[i].system_date_format == 'nep':
                queryset[i].tool_start_date = str(nepali_datetime.date.from_datetime_date(str_to_datetime(str(queryset[i].tool_start_date))))

        page_size = self.get_paginate_by(queryset)
        context_object_name = self.get_context_object_name(queryset)
        if page_size:
            paginator, page, queryset, is_paginated = self.paginate_queryset(queryset, page_size)
            context = {
                'paginator': paginator,
                'page_obj': page,
                'is_paginated': is_paginated,
                'object_list': queryset,
                'FRONTEND_DOMAIN_URL': config('FRONTEND_DOMAIN_URL')
            }
        else:
            context = {
                'paginator': None,
                'page_obj': None,
                'is_paginated': False,
                'object_list': queryset,
                'FRONTEND_DOMAIN_URL': config('FRONTEND_DOMAIN_URL'),
            }
        if context_object_name is not None:
            context[context_object_name] = queryset
        context.update(kwargs)
        return super().get_context_data(**context)

class SchemeUserList(LoginRequiredMixin,ListView):
    template_name = 'user_list.html'
    model = Users
    context_object_name = 'users'
    ordering = '-id'

    def get_queryset(self):
        qs = super().get_queryset() 
        return qs.filter(is_administrative_staff=True)

from django.urls import reverse_lazy
class CreateWaterSchemeView(LoginRequiredMixin,CreateView):
    model = WaterScheme
    form_class = WaterSchemeForm
    template_name = 'create_water_scheme.html'
    success_url = reverse_lazy('main-config:scheme-list')

class UpdateWaterSchemeView(LoginRequiredMixin,UpdateView):
    model = WaterScheme
    form_class = WaterSchemeForm
    template_name = 'update_water_scheme.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('main-config:scheme-list')

    def get_context_data(self, **kwargs):
        import nepali_datetime
        from finance.api.utils import str_to_datetime
        """Insert the single object into the context dict."""
        if self.object.system_date_format == 'nep':
            self.object.system_built_date = str(nepali_datetime.date.from_datetime_date(str_to_datetime(str(self.object.system_built_date))))
            self.object.system_operation_from = str(nepali_datetime.date.from_datetime_date(str_to_datetime(str(self.object.system_operation_from))))
            self.object.system_operation_to = str(nepali_datetime.date.from_datetime_date(str_to_datetime(str(self.object.system_operation_to))))
            self.object.tool_start_date = str(nepali_datetime.date.from_datetime_date(str_to_datetime(str(self.object.tool_start_date))))
        context = {}
        if self.object:
            context['object'] = self.object
            context_object_name = self.get_context_object_name(self.object)
            if context_object_name:
                context[context_object_name] = self.object
        context.update(kwargs)
        return super().get_context_data(**context)

class CreateWaterSchemeUserView(LoginRequiredMixin,CreateView):
    model = Users
    form_class = UsersForm
    template_name = 'scheme_user_create.html'
    success_url = reverse_lazy('main-config:user-scheme-list')

class UpdateWaterSchemeUserView(LoginRequiredMixin,UpdateView):
    model = Users
    form_class = UsersForm
    template_name = 'scheme_user_update.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('main-config:user-scheme-list')


class DeleteWaterSchemeView(LoginRequiredMixin,DeleteView):
    model = Users
    template_name = 'water_scheme_list.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('main-config:scheme-list')

class DeleteWaterSchemeUserView(LoginRequiredMixin,DeleteView):
    model = Users
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('main-config:user-scheme-list')

def deleteUser(request, pk):
    get_object_or_404(Users, id=pk).delete()
    return redirect('main-config:user-scheme-list')

def privacy_policy(request):
    return render(request, 'privacy_policy.html')


from django.http import HttpResponse
def test_notif(request):
    for i in Users.objects.filter(is_care_taker = True):
        sendPushNotification('ids','created_date',i.water_scheme.scheme_name,'message','message_np','title_np', i.water_scheme.slug)
    return HttpResponse('Successfully sent')

