from rest_framework.generics import CreateAPIView,ListAPIView,DestroyAPIView,RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.response import Response
from ..models import (WaterScheme,
WaterSupplyRecord,
QualityTestParameter,
WaterTestResults,
WaterTeriff,
WaterSupplySchedule,
OtherExpense,
OtherExpenseInflationRate,
WaterSchemeData,
UseBasedUnitRange,
YearsInterval,
NotificationPeriod,
NotificationStore,)
from .permission import IsSuperuser
from .serializers import (WaterSchemeSerializer,
    WaterSchemeListSerializer, 
    CreateWaterSupplyRecordSerializers,
    QualityTestParameterSerializer,
    CreateWaterTestResultsSerializers,
    GetWaterSupplyRecordSerializers,
    WaterSupplyScheduleSerializers,
    GetWaterTestResultsSerializers,
    InflationRateSerializer,
    OtherExpenseSerializers,
    WaterSchemeDataSerializer,
    WaterTariffUsedSerializers,
    WaterTariffFixedSerializers,
    WaterTariffUsedCreateSerializers,
    UseBasedUnitRangeSerializer,
    YearIntervalSerializer,
    NotificationPeriodSerializer,
    CreateWaterTariffUsedBasedSerializers,
    NotificationStoreSerializer,
    )
from rest_framework import viewsets, status
from users.api.permission import IsSchemeAdministrator, IsCareTaker
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from users.models import Users
from rest_framework.views import APIView
from django.forms.models import model_to_dict
import datetime
import nepali_datetime
from django.http import Http404
from asset_management_system.utils import *
from .utils import get_month_range

class CreateWaterSchemeView(CreateAPIView):
    """
    {
    "scheme_name": "asdf",
    "location": "asdf",
    "water_source": [{"name":"asdf"},{"name":"asfdasf"}],
    "system_built_date": "2078-01-12 00:00:00",
    "system_operation_from": "2078-01-12 00:00:00",
    "system_operation_to": "2078-01-12 00:00:00"
    }
    """
    permission_classes = [IsAuthenticated,IsSuperuser]
    serializer_class=WaterSchemeSerializer
    queryset=WaterScheme.objects.all()

class UpdateWaterSchemeView(RetrieveUpdateAPIView):
    """
    {
    "scheme_name": "asdf",
    "location": "asdf",
    "water_source": [{"name":"asdf"},{"name":"asfdasf"}],
    "system_built_date": "2078-01-12 00:00:00",
    "system_operation_from": "2078-01-12 00:00:00",
    "system_operation_to": "2078-01-12 00:00:00"
    }
    """
    permission_classes = [IsAuthenticated,(IsSchemeAdministrator|IsSuperuser)]
    serializer_class=WaterSchemeSerializer
    queryset=WaterScheme.objects.all()
    lookup_field = 'slug'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterScheme, slug = self.kwargs['slug'])

class WaterSchemeListView(ListAPIView):
    '''Water scheme list'''

    queryset=WaterScheme.objects.all()
    serializer_class=WaterSchemeListSerializer

class WaterSchemeDetailView(RetrieveAPIView):
    '''Water scheme detail view'''

    queryset=WaterScheme.objects.all()
    serializer_class=WaterSchemeListSerializer
    lookup_field = 'slug'


class WaterSchemeDataListView(ListAPIView):
    '''Water scheme multiple data with different apply date.'''

    queryset = WaterSchemeData.objects.all()
    serializer_class =  WaterSchemeDataSerializer
    permission_classes = [IsAuthenticated,IsSchemeAdministrator]

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return WaterSchemeData.objects.filter(water_scheme = user.water_scheme)

class WaterSchemeDataCreateView(CreateAPIView):
    '''Water scheme data create'''

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSchemeData.objects.all()
    serializer_class =  WaterSchemeDataSerializer

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return WaterSchemeData.objects.filter(water_scheme = user.water_scheme)

class WaterSchemeDataUpdateView(RetrieveUpdateAPIView):
    '''Water scheme data retrive and update'''

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSchemeData.objects.all()
    serializer_class =  WaterSchemeDataSerializer
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterSchemeData, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class WaterSchemeDataDeleteView(DestroyAPIView):
    '''Delete particular water scheme data'''

    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSchemeData.objects.all()
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        user = get_object_or_404(Users, id = self.request.user.id)
        qs = WaterSchemeData.objects.filter(water_scheme = user.water_scheme)
        next_qs = qs.filter(pk__gt=instance.pk).order_by('pk').first()
        previous = qs.filter(pk__lt=instance.pk).order_by('-pk').first()
        if not previous:
            instance.delete()
        elif not next_qs:
            previous.apply_upto = None
            previous.save()
            instance.delete()
        elif next_qs and previous:
            previous.apply_upto = next_qs.apply_date
            previous.save()
            instance.delete()

class WaterSupplyScheduleListView(ListAPIView):
    """Water supply schedule listing"""

    queryset = WaterSupplySchedule.objects.all()
    serializer_class =  WaterSupplyScheduleSerializers

    def get_queryset(self):
        return WaterSupplySchedule.objects.filter(water_scheme__slug = self.kwargs.get('water_scheme_slug'))

class WaterSupplyScheduleCreateView(CreateAPIView):
    """Creating water supply schedule"""

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSupplySchedule.objects.all()
    serializer_class =  WaterSupplyScheduleSerializers

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return WaterSupplySchedule.objects.filter(water_scheme = user.water_scheme)

class WaterSupplyScheduleUpdateView(RetrieveUpdateAPIView):
    """Reteriving and updating water supply schedule."""

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSupplySchedule.objects.all()
    serializer_class =  WaterSupplyScheduleSerializers
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterSupplySchedule, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class WaterSupplyScheduleDeleteView(DestroyAPIView):
    """Deleting water supply schedule"""

    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSupplySchedule.objects.all()
    serializer_class = WaterSupplyScheduleSerializers
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterSupplySchedule,id = self.kwargs['pk'],water_scheme = user.water_scheme)

class WaterTariffListView(ListAPIView):
    """Listing water tariff"""

    queryset = WaterTeriff.objects.filter()
    serializer_class =  None #WaterTariffSerializers

    def get_serializer_class(self):
        tariff_type = self.request.GET.get('tariff_type')
        if tariff_type == 'fixed':
            self.serializer_class = WaterTariffFixedSerializers
        if tariff_type == 'use':
            self.serializer_class = WaterTariffUsedSerializers
        return self.serializer_class

    def get_queryset(self):
        tariff_type = self.request.GET.get('tariff_type')
        if tariff_type == 'fixed':
            return WaterTeriff.objects.filter(water_scheme__slug = self.kwargs.get('water_scheme_slug'), terif_type='Fixed')
        if tariff_type == 'use':
            return WaterTeriff.objects.filter(water_scheme__slug = self.kwargs.get('water_scheme_slug'), terif_type='Use Based')


class WaterTariffCreateView(CreateAPIView):
    """Creating water tariff"""

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterTeriff.objects.all()
    serializer_class = None

    def get_queryset(self):
        tariff_type = self.request.GET.get('tariff_type')
        user = get_object_or_404(Users, id = self.request.user.id)
        if tariff_type == 'fixed':
            return WaterTeriff.objects.filter(water_scheme = user.water_scheme, terif_type='Fixed')
        if tariff_type == 'use':
            return WaterTeriff.objects.filter(water_scheme = user.water_scheme, terif_type='Use Based')

    def get_serializer_class(self):
        tariff_type = self.request.GET.get('tariff_type')
        if tariff_type == 'fixed':
            self.serializer_class = WaterTariffFixedSerializers
        if tariff_type == 'use':
            self.serializer_class = CreateWaterTariffUsedBasedSerializers
        return self.serializer_class

class UseBasedUnitRangeView(CreateAPIView):
    """Creating units range of use base tariff with different parameters"""

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = UseBasedUnitRange.objects.all()
    serializer_class = UseBasedUnitRangeSerializer

class UseBasedUnitRangeUpdateView(RetrieveUpdateAPIView):
    """Updating units range of use base tariff with different parameters"""

    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = UseBasedUnitRange.objects.all()
    serializer_class = UseBasedUnitRangeSerializer
    lookup_field = 'pk'

class WaterTariffUseBasedDeleteView(DestroyAPIView):
    """Deleting water use based units"""
    
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = UseBasedUnitRange.objects.all()
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        tariff = get_object_or_404(WaterTeriff,id = instance.tariff.id)
        instance.delete()

        if not UseBasedUnitRange.objects.filter(tariff_id=tariff.id).exists():
            user = get_object_or_404(Users, id = self.request.user.id)
            qs = WaterTeriff.objects.filter(water_scheme = user.water_scheme)
            next_qs = qs.filter(pk__gt=tariff.pk).order_by('pk').first()
            previous = qs.filter(pk__lt=tariff.pk).order_by('-pk').first()

            if not previous:
                tariff.delete()
            elif not next_qs:
                previous.apply_upto = None
                previous.save()
                tariff.delete()
            elif next_qs and previous:
                previous.apply_upto = next_qs.apply_date
                previous.save()
                tariff.delete()

class WaterTariffUpdateView(RetrieveUpdateAPIView):
    """Updating water tariff"""
    
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterTeriff.objects.all()
    serializer_class =  None#WaterTariffSerializers
    lookup_field = 'pk'

    def get_object(self):
        tariff_type = self.request.GET.get('tariff_type')
        user = get_object_or_404(Users, id = self.request.user.id)
        if tariff_type == 'fixed':
            return get_object_or_404(WaterTeriff, id = self.kwargs['pk'], water_scheme = user.water_scheme,terif_type='Fixed')

        if tariff_type == 'use':
            return get_object_or_404(WaterTeriff, id = self.kwargs['pk'], water_scheme = user.water_scheme,terif_type='Use Based')

    def get_serializer_class(self):
        tariff_type = self.request.GET.get('tariff_type')
        if tariff_type == 'fixed':
            self.serializer_class = WaterTariffFixedSerializers
        if tariff_type == 'use':
            self.serializer_class = WaterTariffUsedCreateSerializers
        return self.serializer_class

class WaterTariffDeleteView(DestroyAPIView):
    """Deleting water tariff"""
    
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterTeriff.objects.all()
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        user = get_object_or_404(Users, id = self.request.user.id)
        qs = WaterTeriff.objects.filter(water_scheme = user.water_scheme)
        next_qs = qs.filter(pk__gt=instance.pk).order_by('pk').first()
        previous = qs.filter(pk__lt=instance.pk).order_by('-pk').first()
        if not previous:
            instance.delete()
        elif not next_qs:
            previous.apply_upto = None
            previous.save()
            instance.delete()
        elif next_qs and previous:
            previous.apply_upto = next_qs.apply_date
            previous.save()
            instance.delete()

class QualityTestParameterView(viewsets.ModelViewSet):
    """Quality test parameter
        if user is not authenticated send query param as 
        ?water_scheme_slug=slug
    """
    permission_classes  = [IsAuthenticatedOrReadOnly]
    queryset = QualityTestParameter.objects.all()
    serializer_class =  QualityTestParameterSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            user = get_object_or_404(Users, id = self.request.user.id)
            return QualityTestParameter.objects.filter(water_scheme = user.water_scheme)
        else:
            scheme_slug = self.request.GET.get('water_scheme_slug')
            return QualityTestParameter.objects.filter(water_scheme__slug = scheme_slug)


class CreateWaterSupplyRecordView(CreateAPIView):
    """
    Adding water supply record by care taker.
    """
    permission_classes = [IsAuthenticated, IsCareTaker]
    serializer_class=CreateWaterSupplyRecordSerializers
    queryset=WaterSupplyRecord.objects.all()

    def get_queryset(self, request):
        user = get_object_or_404(Users, id = request.user.id)
        return WaterSupplyRecord.objects.filter(water_scheme = user.water_scheme)


class GetWaterSupplyRecordView(APIView):
    """
    Get record by date or date range of  water supply  by care taker.
    query parameter date_from and date_to
    /api/v1/water-supply-record/en/get/?date_from=2021-08-05
    /api/v1/water-supply-record/nep/get/?date_from=2078-08-05

    """
    permission_classes = [IsAuthenticated, IsCareTaker]
    serializer_class=GetWaterSupplyRecordSerializers
    queryset=WaterSupplyRecord.objects.all()

    def get_object(self):
        date_from = self.request.GET.get('date_from', None)
        date_to = self.request.GET.get('date_to', None)
        date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
        if date_to:
            date_to = datetime.datetime.strptime(date_to, '%Y-%m-%d').date()

        user = get_object_or_404(Users, id = self.request.user.id)
        if user.water_scheme.system_date_format == 'nep':
            date_list = str(date_from).split('-')
            date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
            date_from = date_nep.to_datetime_date()
            if date_to:
                date_list = str(date_to).split('-')
                date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
                date_to = date_nep.to_datetime_date()
        if date_to and date_from:
            data = WaterSupplyRecord.objects.filter(water_scheme = user.water_scheme, supply_date__lte = date_to, supply_date__gte = date_from).distinct('total_supply','is_daily')
            if len(data) == 1 or 0:
                return data.get()
            raise Http404
        if not date_to and date_from:
            data = get_object_or_404(WaterSupplyRecord, water_scheme = user.water_scheme, supply_date = date_from)
            return data

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('date_from'):
            serializer = GetWaterSupplyRecordSerializers(data = model_to_dict(self.get_object()), many=False)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error':'date_from query param is required'}, status=status.HTTP_403_FORBIDDEN)

class GetWaterResultsView(APIView):
    """
    Get record by date or date range of  water results  by care taker.
    query parameter date_from and date_to
    /api/v1/water-results/en/get/?date_from=2021-08-05
    /api/v1/water-results/nep/get/?date_from=2078-08-05

    """
    permission_classes = [IsAuthenticated, IsCareTaker]
    serializer_class=GetWaterTestResultsSerializers
    queryset=WaterTestResults.objects.all()

    def get_object(self):
        date_from = self.request.GET.get('date_from', None)
        date_to = self.request.GET.get('date_to', None)
        date_from = datetime.datetime.strptime(date_from, '%Y-%m-%d').date()
        if date_to:
            date_to = datetime.datetime.strptime(date_to, '%Y-%m-%d').date()
        user = get_object_or_404(Users, id = self.request.user.id)
        if user.water_scheme.system_date_format == 'nep':
            date_list = str(date_from).split('-')
            date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
            date_from = date_nep.to_datetime_date()
            if date_to:
                date_list = str(date_to).split('-')
                date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
                date_to = date_nep.to_datetime_date()

        if date_to and date_from:
            # data = WaterTestResults.objects.filter(water_scheme = user.water_scheme, date__lte = date_to, date__gte = date_from)
            # water_result_parameter
            # if len(data) == 1 or 0:
            #     return data.get()
            raise Http404
        if not date_to and date_from:
            data = get_object_or_404(WaterTestResults,water_scheme = user.water_scheme, date = date_from)
            return data

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('date_from'):
            obj = self.get_object()
            data_main = {}
            data_main['id']=obj.id
            parameters = []
            for i in obj.test_result_parameter.all():
                parameters.append({'id':i.id, 'value':i.value, 'parameter_name':i.parameter.parameter_name})
            data_main['parameters']=parameters
            return Response(data_main, status=status.HTTP_200_OK)
        return Response({'error':'date_from query param is required'}, status=status.HTTP_403_FORBIDDEN)


class CreateWaterTestResultsView(CreateAPIView):
    """
    Adding water test result by care taker.
    send data in following format
    {
      "date_from": "2021-08-24",
      "date_to": "2021-08-24",
      "test_result_parameter": [
        {
          "parameter": 1,
          "value": 10
        },
        {
          "parameter": 2,
          "value": 20
        },
        {
          "parameter": 3,
          "value": 1
        }
      ]
    }
    """

    permission_classes = [IsAuthenticated, IsCareTaker]
    serializer_class=CreateWaterTestResultsSerializers
    queryset=WaterTestResults.objects.all()

    def get_queryset(self):
        user = get_object_or_404(Users, id = request.user.id)
        return WaterTestResults.objects.filter(water_scheme = user.water_scheme)

class OtherExpenseListView(ListAPIView):
    queryset = OtherExpense.objects.all()
    serializer_class =  OtherExpenseSerializers
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    
    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return OtherExpense.objects.filter(water_scheme = user.water_scheme)

class OtherExpenseCreateView(CreateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = OtherExpense.objects.all()
    serializer_class =  OtherExpenseSerializers

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return OtherExpense.objects.filter(water_scheme = user.water_scheme)

class OtherExpenseUpdateView(RetrieveUpdateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = OtherExpense.objects.all()
    serializer_class =  OtherExpenseSerializers
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(OtherExpense, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class OtherExpenseDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = OtherExpense.objects.all()
    serializer_class = OtherExpenseSerializers
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(OtherExpense,id = self.kwargs['pk'],water_scheme = user.water_scheme)

class InflationParameterListView(ListAPIView):
    queryset = OtherExpenseInflationRate.objects.all()
    serializer_class =  InflationRateSerializer
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return OtherExpenseInflationRate.objects.filter(water_scheme = user.water_scheme)[:1]

class InflationParameterCreateView(CreateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = OtherExpenseInflationRate.objects.all()
    serializer_class =  InflationRateSerializer

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return OtherExpenseInflationRate.objects.filter(water_scheme = user.water_scheme)

class InflationParameterUpdateView(RetrieveUpdateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = OtherExpenseInflationRate.objects.all()
    serializer_class =  InflationRateSerializer
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(OtherExpenseInflationRate, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class InflationParameterDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = OtherExpenseInflationRate.objects.all()
    serializer_class = InflationRateSerializer
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(OtherExpenseInflationRate,id = self.kwargs['pk'],water_scheme = user.water_scheme)

from django.db.models import Sum, Avg, Count, Q
from finance.models import Expenditure, Income, WaterTestResultParamters
class WaterSupplyReport(APIView):
    """
    Report for water supply record
    for this year, query param used -----> ?this_year=id
    for all time no query param needed
    for this month, query param used ----> ?year=2078&this_month=3
    for this week, query param used -----------> ?this_week=true&date_from=2021-1-1&todate_t0=2021-01-7

    """
    def get(self, request, *args, **kwargs):
        scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
        # start_year = scheme.system_operation_from.year
        # end_year = scheme.system_operation_to.year
        year_interval = scheme.year_interval.all()
        this_year = request.GET.get('this_year',None)
        this_month = request.GET.get('this_month',None)
        month_year = request.GET.get('year', None)
        this_week = request.GET.get('this_week',None)
        if this_year:
            this_year_interval = scheme.year_interval.filter(year_num=this_year).get()
        
        if scheme.system_date_format == 'nep':
            if this_month:  
                this_month = get_month_range(int(month_year),int(this_month))

        if this_year:
            if scheme.system_date_format == 'en':
                supply = WaterSupplyRecord.objects.filter(water_scheme = scheme,supply_date__gte=this_year_interval.start_date,supply_date__lte=this_year_interval.end_date
                ).values('supply_date__year','supply_date__month').annotate(total_supply_avg = Avg('total_supply'), total_supply = Sum('total_supply'), data_count = Count('id'))
            else:
                from itertools import groupby
                supply_list = list(WaterSupplyRecord.objects.filter(water_scheme = scheme,supply_date__gte=this_year_interval.start_date,supply_date__lte=this_year_interval.end_date
                ).order_by('supply_date__year', 'supply_date__month').values('supply_date_np','total_supply'))#.annotate(total_supply_avg = Avg('total_supply'), total_supply = Sum('total_supply'), data_count = Count('id')))
                supply_list.sort(key=lambda x:x['supply_date_np'][:7])
                supply = []
                for k,v in groupby(supply_list, key=lambda x:x['supply_date_np'][:7]):
                    total_supply=0
                    count = 0
                    for j in list(v):
                        total_supply+=j.get('total_supply')
                        count +=1
                    try:
                        total_supply_avg = round(total_supply/count,0)
                    except:
                        total_supply_avg=0
                    supply.append({'date__year':k[0:4],'date__month':k[5:7],'total_supply':total_supply,'total_supply_avg':total_supply_avg,'data_count':count})
            data = {'supply':supply,
                }

        elif this_month:
            if scheme.system_date_format == 'en':
                supply = WaterSupplyRecord.objects.filter(water_scheme = scheme,supply_date__month = this_month,supply_date__year= month_year
                    ).values('supply_date').annotate(daily_avg = Avg('total_supply'), total_supply = Sum('total_supply'))
               
            else:
                from itertools import groupby
                supply_list = list(WaterSupplyRecord.objects.filter(water_scheme = scheme,supply_date__gte=this_month.get('month_start'),supply_date__lte=this_month.get('month_end')
                ).order_by('supply_date',).values('supply_date_np','total_supply'))#.annotate(total_supply_avg = Avg('total_supply'), total_supply = Sum('total_supply'), data_count = Count('id')))
                supply_list.sort(key=lambda x:x['supply_date_np'][:10])
                supply = []
                for k,v in groupby(supply_list, key=lambda x:x['supply_date_np'][:10]):
                    total_supply=0
                    count = 0
                   
                    for j in list(v):
                        total_supply+=j.get('total_supply')
                        count +=1
                    try:
                        daily_avg = round(total_supply/count,0)
                    except:
                        daily_avg=0
                    supply.append({'supply_date':k[0:10],'total_supply':total_supply,'daily_avg':daily_avg,})
                

            data = {'supply':supply,
                'daily_target':scheme.daily_target,
                }
        elif this_week:
            _from = request.GET.get('date_from') 
            _to = request.GET.get('date_to')

            if not _to:
                return Response({'error':'date_to query param is required.'}, status=status.HTTP_403_FORBIDDEN)
            if not _from:
                return Response({'error':'date_from query param is required.'}, status=status.HTTP_403_FORBIDDEN)

            if scheme.system_date_format == 'nep':
                _from = nep_to_eng_full_date(_from)
                _to = nep_to_eng_full_date(_to)
            
            
            supply = WaterSupplyRecord.objects.filter(water_scheme = scheme,supply_date__gte=_from,supply_date__lt=_to
                ).values('supply_date').annotate(daily_avg = Avg('total_supply'), total_supply = Sum('total_supply'))
                    
            if scheme.system_date_format == 'nep':
                for i in supply:
                    i['supply_date'] = convert_to_nepali_full_date(i['supply_date'])

            data = {'supply':supply,
                'daily_target':scheme.daily_target,
                }
        else:
            year_interval = scheme.year_interval.all()
            supply = []
            actual_water_supply = []
            water_sales = []
            for i in year_interval:
                start_date = i.start_date
                end_date =i.end_date
                if scheme.system_date_format == 'nep':
                    start_date = str(nepali_datetime.date.from_datetime_date(start_date))
                    end_date = str(nepali_datetime.date.from_datetime_date(end_date))

                
                data =WaterSupplyRecord.objects.filter(water_scheme = scheme,supply_date__gte=i.start_date, supply_date__lte =i.end_date
                ).values('supply_date__year').aggregate(Avg('total_supply'), Sum('total_supply'), Count('id'))
                
                total_supply__avg = data.get('total_supply__avg')
                if total_supply__avg is None:
                    total_supply__avg = 0
                total_supply__sum = data.get('total_supply__sum')
                if total_supply__sum is None:
                    total_supply__sum=0
                supply.append({'date_from':start_date,'date_to':end_date,'total_supply_avg':total_supply__avg,'total_supply':total_supply__sum,'data_count':data.get('id__count')})
                actual_water_supply.append(total_supply__sum)
                
                
                # non_revenue income
                water_sold = Income.objects.filter(category__water_scheme = scheme, category__name__in = ['Water Sales','water sales'],date__gte = i.start_date, date__lte=i.end_date).aggregate(Sum('water_supplied'))
                if water_sold:
                    water_sold = water_sold.get('water_supplied__sum')
                    if water_sold is None:
                        water_sold = 0
                else:
                    water_sold = 0

                water_sales.append(water_sold)

                # tariff = WaterTeriff.objects.filter(water_scheme=scheme, terif_type='Use Based')
                # tariffs = tariff.filter(Q(Q(apply_date__lte = i.start_date) & Q(apply_upto__gte = i.end_date)) | 
                # Q(Q(apply_date__lt=i.start_date) & Q(Q(apply_upto__gt=i.start_date) & Q(apply_upto__lt = i.end_date))) | 
                # Q(Q(Q(apply_date__lt=i.start_date) | Q(apply_date__gte = i.start_date)) & Q(apply_date__lt=i.end_date) & Q(apply_upto=None)) |
                # Q(Q(apply_date__gte = i.start_date) & Q(apply_upto__lte = i.end_date)) |
                # Q(Q(apply_date__gte = i.start_date) & Q(apply_date__lt = i.end_date) & Q(apply_upto__gte = i.end_date))).values('id')

                # datas = UseBasedUnitRange.objects.filter(tariff__id__in = [i.get('id') for i in tariffs if i is not None] )
                # units = 0
                # for data in datas:
                #     units += ((data.estimated_paying_connection/100) * income)/data.rate
                # total_usage = round(units * 1000, 0)
                # actual_water_supply.append(total_usage)

            non_revenue_water = []
            zip_object = zip(actual_water_supply,water_sales)
            count = 0
            for list1_i, list2_i in zip_object:
                supply[count]['non_revenue_water'] = list1_i-list2_i
                count +=1
                data = {'supply':supply,
                    }
        return Response(data, status = status.HTTP_200_OK)



class WaterTestResultReport(APIView):
    """
    Report for water test result, this year and all time.
    query param 

    """
    def get(self, request, *args, **kwargs):
        scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
        year_interval = scheme.year_interval.all()
        this_year = request.GET.get('this_year',None)

        if this_year:
            this_year = datetime.today()
            year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year)
            from finance.api.utils import get_month_range_in_list
            for i in year_interval:
                months = get_month_range_in_list(i, scheme.system_date_format)
                data_list = []
                for month in months:
                    datas = {}
                    datas['month']=month.get('month')
                    datas['year']=month.get('year')
                    if scheme.system_date_format == 'en':
                        item = WaterTestResultParamters.objects.filter(test_result__water_scheme=scheme,
                        test_result__date__year=month.get('year'),
                            test_result__date__month=month.get('month'),
                        )
                        data_count = item.count()
                        data = item.values('parameter__parameter_name', 'parameter__types').annotate(total_value = Sum('value'))
                        datas['data']=data
                        datas['data_count']=data_count
                        data_list.append(datas)
                    else:
                        from itertools import groupby
                        result_list = list(WaterTestResultParamters.objects.filter(test_result__water_scheme=scheme, test_result__date__gte=month.get('month_start'),test_result__date__lte=month.get('month_end')).order_by('test_result__date__year', 'test_result__date__month').values('test_result__date_np', 'parameter__parameter_name','parameter__types','value'))
                        result_list.sort(key=lambda x:x['test_result__date_np'][:7])
                        datas = {}
                        datas['month']=month.get('month')
                        datas['year']=month.get('year')
                        
                        data = []   
                        data_count = []
                        for k,v in groupby(result_list,key=lambda x:(x['test_result__date_np'][:7], x['parameter__parameter_name'],x['parameter__types'])):
                            v=list(v)
                            value = 0
                            for j in v:
                                value +=j.get('value')
                            data.append({
                                "parameter__parameter_name": k[1],
                                "parameter__types": k[2],
                                "total_value": value
                            },)

                            # if k[0][0:4] in [x.get('test_result__date__year') for x in data_count] and k[0][5:7] in [x.get('test_result__date__month') for x in data_count]:
                            #     for count_val in data_count:
                            #         if count_val.get('test_result__date__year') == k[0][0:4] and count_val.get('test_result__date__month') == k[0][5:7]:
                            #             count_val['data_count'] = count_val['data_count'] + len(v)
                            # else:
                            #     data_count.append({'test_result__date__year':k[0][0:4],'test_result__date__month':k[0][5:7],'data_count':len(v)})
                        datas['data']=data
                        datas['data_count']=len(data)
                        data_list.append(datas)
        else:
            data_list = []
            for i in year_interval:
                start_date = i.start_date
                end_date =i.end_date
                if scheme.system_date_format == 'nep':
                    start_date = str(nepali_datetime.date.from_datetime_date(start_date))
                    end_date = str(nepali_datetime.date.from_datetime_date(end_date))
                data = WaterTestResultParamters.objects.filter(test_result__water_scheme=scheme,
                test_result__date__gte=i.start_date,
                test_result__date__lte=i.end_date,
                ).values('parameter__parameter_name','parameter__types').annotate(total_value = Sum('value'))
                data_list.append({'year_from':start_date, 'year_to':end_date,'data':list(data),'data_count':data.count()})
        return Response(data_list, status=status.HTTP_200_OK)

class YearIntervalView(ListAPIView):
    """List of year intervals (running year or fiscal year) of water scheme"""
    queryset = YearsInterval.objects.filter()
    serializer_class =  YearIntervalSerializer

    def get_queryset(self):
        scheme_slug = self.kwargs.get('water_scheme_slug')
        scheme = get_object_or_404(WaterScheme, slug=scheme_slug)
        return YearsInterval.objects.filter(scheme = scheme).order_by('year_num')

class NotificationListView(ListAPIView):
    """Notification period list"""
    queryset = NotificationPeriod.objects.filter()
    serializer_class =  NotificationPeriodSerializer

    def get_queryset(self):
        scheme_slug = self.kwargs.get('water_scheme_slug')
        scheme = get_object_or_404(WaterScheme, slug=scheme_slug)
        return NotificationPeriod.objects.filter(water_scheme = scheme)

class NotificationPeriodCreateView(CreateAPIView):
    """Creating notification period to send push notification for mobile"""
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = NotificationPeriod.objects.all()
    serializer_class =  NotificationPeriodSerializer

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return NotificationPeriod.objects.filter(water_scheme = user.water_scheme)

class NotificationPeriodUpdateView(RetrieveUpdateAPIView):
    """Retrive and update Config notification period for water scheme"""
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = NotificationPeriod.objects.all()
    serializer_class =  NotificationPeriodSerializer
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(NotificationPeriod, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class NotificationStoreList(ListAPIView):
    """Listing notification for mobile app."""
    queryset = NotificationStore.objects.all()
    serializer_class =  NotificationStoreSerializer
    permission_classes = [IsAuthenticated,IsCareTaker]
    ordering = '-id'

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return NotificationStore.objects.filter(water_scheme = user.water_scheme)



#config api for crud watersupplyrecord
from .serializers import ConfigWaterSupplyRecordSerializers
class ConfigWaterSupplyRecordListView(ListAPIView):
    """
    query param date_from,date_to,
    """
    queryset = WaterSupplyRecord.objects.all()
    serializer_class =  ConfigWaterSupplyRecordSerializers
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    
    def get_queryset(self):
        user=get_object_or_404(Users, id = self.request.user.id)
        date_from = self.request.GET.get('date_from',None)
        date_to = self.request.GET.get('date_to',None)

        if user.water_scheme.system_date_format == 'nep':
            if date_from:
                date_from =  nep_to_eng_full_date(date_from)
            if date_to:
                date_to = nep_to_eng_full_date(date_to)

        if date_from and date_to:
            return WaterSupplyRecord.objects.filter(supply_date__gte = date_from, supply_date__lte = date_to,water_scheme = user.water_scheme)
        elif date_from and not date_to:
            print(date_from)
            return WaterSupplyRecord.objects.filter(supply_date = date_from, water_scheme = user.water_scheme)
        else:
            return WaterSupplyRecord.objects.filter(water_scheme = user.water_scheme)



class ConfigWaterSupplyRecordCreateView(CreateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSupplyRecord.objects.all()
    serializer_class =  ConfigWaterSupplyRecordSerializers

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return WaterSupplyRecord.objects.filter(water_scheme = user.water_scheme)

class ConfigWaterSupplyRecordUpdateView(RetrieveUpdateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSupplyRecord.objects.all()
    serializer_class =  ConfigWaterSupplyRecordSerializers
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterSupplyRecord, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class ConfigWaterSupplyRecordDestroyView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterSupplyRecord.objects.all()
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterSupplyRecord,id = self.kwargs['pk'],water_scheme = user.water_scheme)

#config water test results
from .serializers import ConfigWaterResultsSerializers
class ConfigGetWaterResultsList(ListAPIView):
    """
    query param date_from,date_to,
    """
    queryset = WaterTestResults.objects.all()
    serializer_class =  ConfigWaterResultsSerializers
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]

    def get_queryset(self):
        user=get_object_or_404(Users, id = self.request.user.id)
        date_from = self.request.GET.get('date_from',None)
        date_to = self.request.GET.get('date_to',None)

        if user.water_scheme.system_date_format == 'nep':
            if date_from:
                date_from =  nep_to_eng_full_date(date_from)
            if date_to:
                date_to = nep_to_eng_full_date(date_to)

        if date_from and date_to:
            return WaterTestResults.objects.filter(date__gte = date_from, date__lte = date_to,water_scheme = user.water_scheme)
        elif date_from and not date_to:
            return WaterTestResults.objects.filter(date = date_from, water_scheme = user.water_scheme)
        else:
            return WaterTestResults.objects.filter(water_scheme = user.water_scheme)

class ConfigGetWaterResultsCreate(CreateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterTestResults.objects.all()
    serializer_class =  ConfigWaterResultsSerializers

    def get_queryset(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return WaterTestResults.objects.filter(water_scheme = user.water_scheme)


class ConfigGetWaterResultsUpdate(RetrieveUpdateAPIView):
    permission_classes  = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterTestResults.objects.all()
    serializer_class =  ConfigWaterResultsSerializers

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterTestResults, id = self.kwargs['pk'], water_scheme = user.water_scheme)

class ConfigGetWaterResultsDelete(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchemeAdministrator]
    queryset = WaterTestResults.objects.all()
    lookup_field = 'id'

    def get_object(self):
        user = get_object_or_404(Users, id = self.request.user.id)
        return get_object_or_404(WaterTestResults,id = self.kwargs['pk'],water_scheme = user.water_scheme)
