from django.urls import path

from .views import *
from rest_framework.routers import DefaultRouter, SimpleRouter
router = SimpleRouter()

router.register('test-parameter', QualityTestParameterView)

app_name = "config_pannel"
urlpatterns = [
    path('water-scheme/list/', WaterSchemeListView.as_view(), name='water-scheme-list'),
    path('water-scheme/detail/<slug:slug>/',WaterSchemeDetailView.as_view()),
    path('water-scheme/<str:lang>/create/', CreateWaterSchemeView.as_view(), name='water-scheme-create'),
    path('water-scheme/update/<str:lang>/<slug:slug>/',UpdateWaterSchemeView.as_view(), name ='water-scheme-update'),

    path('water-scheme-data/list/<str:lang>/', WaterSchemeDataListView.as_view()),
    path('water-scheme-data/<str:lang>/create/', WaterSchemeDataCreateView.as_view()),
    path('water-scheme-data/<str:lang>/<int:pk>/', WaterSchemeDataUpdateView.as_view()),
    path('water-scheme-data/<str:lang>/<int:pk>/delete/', WaterSchemeDataDeleteView.as_view()),

    path('water-tariff/list/<str:lang>/<str:water_scheme_slug>/', WaterTariffListView.as_view()),
    path('water-tariff/<str:lang>/create/', WaterTariffCreateView.as_view()),
    path('water-tariff/<str:lang>/update/<int:id>/', WaterTariffUpdateView.as_view()),
    path('water-tariff/use-based-data/create/<str:lang>/',UseBasedUnitRangeView.as_view()),
    path('water-tariff/use-based-data/<int:pk>/<str:lang>/',UseBasedUnitRangeUpdateView.as_view()),
    path('water-tariff/use-based-data/delete/<int:pk>/', WaterTariffUseBasedDeleteView.as_view()),
    path('water-tariff/<str:lang>/<int:pk>/', WaterTariffUpdateView.as_view()),
    path('water-tariff/<int:pk>/delete/', WaterTariffDeleteView.as_view()),

    path('water-supply-schedule/list/<str:lang>/<str:water_scheme_slug>/', WaterSupplyScheduleListView.as_view()),
    path('water-supply-schedule/<str:lang>/create/', WaterSupplyScheduleCreateView.as_view()),
    path('water-supply-schedule/<str:lang>/<int:pk>/', WaterSupplyScheduleUpdateView.as_view()),
    path('water-supply-schedule/<str:lang>/<int:pk>/delete/', WaterSupplyScheduleDeleteView.as_view()),

    path('other-expenses/list/<str:lang>/', OtherExpenseListView.as_view()),
    path('other-expenses/<str:lang>/create/', OtherExpenseCreateView.as_view()),
    path('other-expenses/<str:lang>/<int:pk>/', OtherExpenseUpdateView.as_view()),
    path('other-expenses/<str:lang>/<int:pk>/delete/', OtherExpenseDeleteView.as_view()),

    path('inflation-parameter/list/<str:lang>/', InflationParameterListView.as_view()),
    path('inflation-parameter/<str:lang>/create/', InflationParameterCreateView.as_view()),
    path('inflation-parameter/<str:lang>/<int:pk>/', InflationParameterUpdateView.as_view()),
    path('inflation-parameter/<str:lang>/<int:pk>/delete/', InflationParameterDeleteView.as_view()),

    path('water-supply-record/<str:lang>/create/', CreateWaterSupplyRecordView.as_view(), name = 'water-supply-record'),
    path('water-supply-record/<str:lang>/get/', GetWaterSupplyRecordView.as_view(), name = 'water-supply-record-get'),

    path('water-test-results/<str:lang>/create/', CreateWaterTestResultsView.as_view(), name = 'water-test-results'),
    path('water-test-results/<str:lang>/get/', GetWaterResultsView.as_view(), name = 'water-test-results-get'),

    path('report/water-supply/<str:water_scheme_slug>/', WaterSupplyReport.as_view()),
    path('report/water-test-results/<str:water_scheme_slug>/',WaterTestResultReport.as_view()),

    path('year-intervals/<str:lang>/<str:water_scheme_slug>/', YearIntervalView.as_view()),

    path('notification/period/<str:water_scheme_slug>/',NotificationListView.as_view()),
    path('notification/period-create/', NotificationPeriodCreateView.as_view()),
    path('notification/period-update/<int:pk>/',NotificationPeriodUpdateView.as_view()),
    
    path('notification/list/',NotificationStoreList.as_view()),




    path('config/water-supply-record/list/<str:lang>/', ConfigWaterSupplyRecordListView.as_view()),
    path('config/water-supply-record/<str:lang>/create/', ConfigWaterSupplyRecordCreateView.as_view()),
    path('config/water-supply-record/<str:lang>/<int:pk>/', ConfigWaterSupplyRecordUpdateView.as_view()),
    path('config/water-supply-record/<int:pk>/delete/', ConfigWaterSupplyRecordDestroyView.as_view()),


    path('config/water-test-results/list/<str:lang>/', ConfigGetWaterResultsList.as_view()),
    path('config/water-test-results/<str:lang>/create/', ConfigGetWaterResultsCreate.as_view()),
    path('config/water-test-results/<str:lang>/<int:pk>/', ConfigGetWaterResultsUpdate.as_view()),
    path('config/water-test-results/<int:pk>/delete/', ConfigGetWaterResultsDelete.as_view()),
    path('test-parameter/bulk-delete/', BulkDeleteQualityTestParameter.as_view())

]
urlpatterns += router.urls

