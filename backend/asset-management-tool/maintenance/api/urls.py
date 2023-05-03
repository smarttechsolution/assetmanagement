from django.urls import path
from .views import *

app_name = "maintenance"

urlpatterns = [
    path('maintenance/component-category/list/', ComponentCategoryListView.as_view(), name = 'component-category-list'),
    path('maintenance/component-category/create/', ComponentCategoryCreateView.as_view(), name = 'component-category-create'),
    path('maintenance/component-category/update/<int:pk>/', ComponentCategoryUpdateView.as_view(), name = 'component-category-update'),
    path('maintenance/component-category/delete/<int:pk>/', ComponentCategoryDeleteView.as_view(), name = 'component-category-delete'),

    path('maintenance/component/list/', ComponentListView.as_view(), name = 'component-list'),
    path('maintenance/component/create/', ComponentCreateView.as_view(), name = 'component-create'),
    path('maintenance/component/update/<int:pk>/', ComponentUpdateView.as_view(), name = 'component-update'),
    path('maintenance/component/<int:pk>/', ComponentRetriveView.as_view(), name = 'component-get'),
    path('maintenance/component/delete/<int:pk>/', ComponentDeleteView.as_view()),

    path('maintenance/component-info/<str:lang>/list/', ComponentInfoListView.as_view(), name = 'component-info-list'),
    path('maintenance/component-info/<str:lang>/create/',ComponentInfoCreateView.as_view(),name = 'component-info-create'),
    path('maintenance/component-info/<str:lang>/update/<int:pk>/', ComponentInfoUpdateView.as_view(), name = 'component-info-update'),
    path('maintenance/component-info/<str:lang>/<int:pk>/', ComponentInfoRetriveView.as_view(), name = 'component-info-retrive'),
    path('maintenance/component-infos/delete/<int:pk>/', ComponentInfoDeleteView.as_view()),
    path('maintenance/dashboard-componant-info/<str:lang>/<str:water_scheme_slug>/',DashboardComponentInfoListView.as_view()),
    path('maintenance/component-info-log/<str:lang>/create/',ComponentLogCreateView.as_view(),name = 'component-info-log-create'),
    path('maintenance/component-info-log/<str:lang>/update/<int:pk>/', ComponentLogUpdateView.as_view()),

    path('report/maintenance-cost/<str:water_scheme_slug>/',MaintenanceCostReport.as_view()),
    path('report/maintenance-cost-by-cost/<str:water_scheme_slug>/',MaintenanceCostReportByCost.as_view()),
    path('config-component-log/list/<str:lang>/', ConfigComponentLogList.as_view()),
    path('config-component-log/create/<str:lang>/', ConfigComponentLogCreate.as_view()),
    path('config-component-log/update/<int:pk>/<str:lang>/', ConfigComponentLogUpdate.as_view()),
    path('config-component-log/delete/<int:pk>/',ConfigComponentLogDelete.as_view()),

]
