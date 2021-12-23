# <Asset Management Tool (AMT) for managing Water Supply Asset by Community Level.>
#     Copyright (C) 2021 Smart Tech Solution Pvt. Ltd.

#     This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
#     This is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
#     You should have received a copy of the GNU Affero General Public License along with this program.  If not, see
# <https://www.gnu.org/licenses/>.

from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Asset Management System",
      default_version='v1',
      description="REST API v1",
      contact=openapi.Contact(email=""),
      license=openapi.License(name="GNU License"),
      terms_of_service="http://65.0.18.97/swagger/policies/terms/",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/', include('users.api.urls', namespace='users'), name = 'users'),
    path('api/v1/', include('config_pannel.api.urls', namespace='config_pannel')),
    path('api/v1/', include('finance.api.urls', namespace='finance')),
    path('api/v1/', include('maintenance.api.urls', namespace='maintenance')),
   
   path('main-config/', include('config_pannel.urls', namespace='main-config')),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
