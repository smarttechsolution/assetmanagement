from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register([WaterScheme,
 WaterSource,
  QualityTestParameter,
  WaterTestResults,
  WaterTestResultParamters,
  WaterSupplyRecord,
  WaterSupplySchedule,
  WaterTeriff,
  OtherExpense,
  OtherExpenseInflationRate,
  WaterSchemeData,
  SupplyBelts,
  UseBasedUnitRange,
  YearsInterval,
  NotificationPeriod,
  NotificationStore,])