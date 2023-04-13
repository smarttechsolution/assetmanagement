from django.http.response import JsonResponse
from requests import delete
from rest_framework.generics import (CreateAPIView,
	ListAPIView,
	RetrieveUpdateAPIView,
	UpdateAPIView,
	RetrieveAPIView,
	DestroyAPIView,
	)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from users.api.permission import IsSchemeAdministrator, IsCareTaker
from ..models import *
from .serializers import *
from users.models import Users
from django.shortcuts import get_object_or_404
from rest_framework.filters import OrderingFilter
import datetime
import nepali_datetime
from .utils import add_months,add_nep_month, add_month_to_date,add_days_to_date, compress, days_maintanace_interval, month_maintanance_interval
from django.db.models import Sum, Avg
from rest_framework.response import Response
from rest_framework import generics, status, views
from django.db.models import Q, F, FloatField

class ComponentCategoryListView(ListAPIView):
	"""
	Asset Component category list for care taker and Scheme administrator after login
	"""
	permission_classes = [IsAuthenticated]
	queryset = AssetComponentCategory.objects.all()
	serializer_class = ComponentCategorySerializer

	def get_queryset(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return AssetComponentCategory.objects.filter(water_scheme__slug = user.water_scheme.slug)

class ComponentCategoryCreateView(CreateAPIView):
	"""Creating Asset Component  category by scheme administrator"""
	permission_classes = [IsAuthenticated]
	queryset = AssetComponentCategory.objects.all()
	serializer_class = ComponentCategorySerializer

	def get_queryset(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return AssetComponentCategory.objects.filter(water_scheme__slug = user.water_scheme.slug)

class ComponentCategoryUpdateView(RetrieveUpdateAPIView):
	"""Updating component category by scheme administrator"""
	permission_classes = [IsAuthenticated]
	queryset = AssetComponentCategory.objects.all()
	serializer_class = ComponentCategorySerializer
	lookup_field = 'id'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(AssetComponentCategory, id = self.kwargs['pk'],water_scheme__slug = user.water_scheme.slug)

class ComponentCategoryDeleteView(DestroyAPIView):
	"""Deleting component category by scheme admininstrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	lookup_field = 'id'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(AssetComponentCategory,id = self.kwargs['pk'],water_scheme__slug = user.water_scheme.slug)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		try:
			self.perform_destroy(instance)
			return Response(status=status.HTTP_204_NO_CONTENT)
		except:
			return Response({'error':'Delete related components first to delete  category.'}, status=status.HTTP_403_FORBIDDEN)


class ComponentDeleteView(DestroyAPIView):
	"""Deleting component category by scheme admininstrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	lookup_field = 'id'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Components,id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		try:
			self.perform_destroy(instance)
			return Response(status=status.HTTP_204_NO_CONTENT)
		except:
			return Response({'error':'Delete related components info first to delete  category.'}, status=status.HTTP_403_FORBIDDEN)



class ComponentListView(ListAPIView):
	"""
	Asset Component category list for care taker and Scheme administrator after login
	"""
	permission_classes = [IsAuthenticated]
	queryset = Components.objects.all()
	serializer_class = ComponentsSerializer

	def get_queryset(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return Components.objects.filter(category__water_scheme__slug = user.water_scheme.slug)
		
class ComponentCreateView(CreateAPIView):
	"""Creating  Component   by scheme administrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = Components.objects.all()
	serializer_class = ComponentCreateSerializer

	def get_queryset(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return Components.objects.filter(category__water_scheme__slug = user.water_scheme.slug)

class ComponentUpdateView(UpdateAPIView):
	"""Updating component componanet by scheme administrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = Components.objects.all()
	serializer_class = ComponentCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Components, id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

class ComponentRetriveView(RetrieveAPIView):
	"""Get componanet by care taker"""
	permission_classes = [IsAuthenticated]
	queryset = Components.objects.all()
	serializer_class = ComponentsSerializer
	lookup_field = 'id'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Components, id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

class DashboardComponentInfoListView(ListAPIView):
	queryset = ComponentInfo.objects.all()
	serializer_class = ComponentInfoListSerializer
	

	def get_queryset(self, *args, **kwargs):
		scheme_slug = self.kwargs.get('water_scheme_slug')
		return ComponentInfo.objects.filter(component__category__water_scheme__slug = scheme_slug)

class ComponentInfoListView(ListAPIView):
	"""
	Asset component info list view for mobile(caretaker) and dashboard.
	Filter field :-  mitigation and year
	language option: lang = en or nep
	?year=id and for lang=en  ?year=id
	?type=not-schedule&year=year_id for listing all componant info

	for filtering use following fields:
		'next_action','resulting_risk_score','maintenance_cost',
	"""
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfo.objects.all()
	serializer_class = ComponentInfoListSerializer
	filterset_fields = ('mitigation',)
	# OrderingFilter = ('next_action','resulting_risk_score','maintenance_cost',)


	def filter_queryset(self, queryset):
		ordering = self.request.GET.get("ordering", None)
		mitigation = self.request.GET.get("mitigation", None)

		if ordering == 'maintenance_cost':
			queryset = queryset.order_by('-maintenance_cost')
		elif ordering == 'resulting_risk_score':
			queryset = queryset.order_by('-resulting_risk_score')
		elif ordering == 'next_action':
			queryset = queryset.order_by('-next_action')
		if mitigation:
			queryset = queryset.filter(mitigation = mitigation)
		return queryset

	def get_queryset(self):
		_type = self.request.GET.get('type')
		user = get_object_or_404(Users, id=self.request.user.id)
		if user.water_scheme.system_date_format == 'en':
			year = self.request.GET.get('year')
			if not year:
				year_interval = get_object_or_404(YearsInterval, start_date__year = datetime.date.today().year, scheme=user.water_scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year, scheme=user.water_scheme)

		if user.water_scheme.system_date_format == 'nep':
			year = self.request.GET.get('year')
			if not year:
				today_date = nepali_datetime.date.today().to_datetime_date()
				year_interval = get_object_or_404(YearsInterval, start_date__year = today_date.year,scheme=user.water_scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year,scheme=user.water_scheme)

		factors = get_factors_of(year_interval.year_num)
		if _type == 'not-schedule':
			return ComponentInfo.objects.filter(component__category__water_scheme = user.water_scheme)
		componant1 = ComponentInfo.objects.filter(component__category__water_scheme = user.water_scheme, interval_unit__in = ['Day', 'Month'],apply_date__lte = year_interval.end_date)
		componant2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = user.water_scheme) \
				& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.end_date) & Q(interval_unit = 'Year'))
		return componant1 | componant2

class ComponentInfoCreateView(CreateAPIView):
	"""
	API to create  Component Info by scheme administrative.
	custom parameter: lang     possible value: en or nep
	send query param 	?year=id also
	"""
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfo.objects.all()
	serializer_class = ComponentInfoCreateSerializer

	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return ComponentInfo.objects.filter(component__category__water_scheme__slug = user.water_scheme.slug)

class ComponentInfoUpdateView(UpdateAPIView):
	"""
	API to update  Component info by scheme administrative.
	custom parameter: lang     possible value: en or nep
	send ?year=id also
	"""
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfo.objects.all()
	serializer_class = ComponentInfoCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfo,id = self.kwargs['pk'],component__category__water_scheme__slug = user.water_scheme.slug)

class ComponentInfoRetriveView(RetrieveAPIView):
	"""
	API to update  Component info by scheme administrative.
	custom parameter: lang     possible value: en or nep
	pass query param ?year=id also
	"""
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfo.objects.all()
	serializer_class = ComponentInfoCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfo,id = self.kwargs['pk'],component__category__water_scheme__slug = user.water_scheme.slug)

class ComponentInfoDeleteView(DestroyAPIView):
	"""Delete particular component"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfo,id = self.kwargs['pk'],component__category__water_scheme = user.water_scheme)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		try:
			self.perform_destroy(instance)
			try:
				get_object_or_404(Components,id=instance.componant.id).delete()
			except:
				pass
			return Response(status=status.HTTP_204_NO_CONTENT)
		except:
			return JsonResponse({'error':'You cannot delete this componant. Delete its logs first before deleting it.'})
		
class ComponentLogCreateView(CreateAPIView):
	"""Creating Logs of components
	?type=not-schedule
	"""
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ComponentLogCreateSerializer

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog, component__component__category__water_scheme = user.water_scheme)

class ComponentLogUpdateView(RetrieveUpdateAPIView):
	"""Updating Logs of components and retreving"""
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ComponentLogCreateSerializer

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog,id = self.kwargs['pk'],component__component__category__water_scheme = user.water_scheme)

def get_factors_of(num):
	"""Return factor of integer number"""
	factor_list = [1]
	for i in range(1, num + 1):
		if num == 1:
			factor_list = [x for x in range(1,15)]
		elif num % i == 1:
			factor_list.append(i)
	return factor_list


def get_factor_of_year(num, apply_date, interval, prev):
	factor_list = [1]
	for i in range(1, num + 1):
		if num == 1:
			factor_list = [x for x in range(1,15)]
		elif apply_date[-1] != prev:
			for j in interval:
				factor_list.append(j)
				if num in factor_list:
					factor_list.remove(num)
		elif num % i == 1:
			factor_list.append(i)
	return set(factor_list)



def Convert(tup, di):
    for a, b in tup:
        di.setdefault(a, []).append(b)
    return di
    
class MaintenanceCostReport(APIView):
	"""
	Maintenance report 
	Query param to be used: this_year
	?this_year=True 
	"""
	def get(self, request, *args, **kwargs):
		this_year = request.GET.get('this_year',None)
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		year_interval = scheme.year_interval.all().order_by('year_num')
		if this_year:
			actual_cost = []
			from itertools import groupby
			this_year = datetime.date.today()
			year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year)
			for i in year_interval:
				from finance.api.utils import get_month_range_in_list
				months = get_month_range_in_list(i, scheme.system_date_format)
				diff = get_factors_of(i.year_num)

				expected_data_list = []
				component1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte  = i.end_date, interval_unit='Month').values('next_action','apply_date','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
				for comp in component1:
					apply_date = comp.get("apply_date")
					if apply_date.year == this_year.year:
						interval = month_maintanance_interval(apply_date)
					else:
						interval = 12
					data = {}
					next_action = str_to_datetime(str(comp.get('apply_date')))
					next_action_np = str(nepali_datetime.date.from_datetime_date(str_to_datetime(str(next_action))))
					maintenance_interval = comp.get('maintenance_interval')
					total_logs = int((interval/maintenance_interval))
					data['next_action'] = str(next_action)
					data['next_action_np']=next_action_np#comp.get('next_action_np')
					data['maintenance_cost'] = comp.get('maintenance_cost')
					data['labour_cost'] = comp.get('labour_cost')
					data['replacement_cost'] =comp.get('replacement_cost')
					data['material_cost'] = comp.get('material_cost')
					data['component_numbers'] = comp.get('component_numbers')
					data['maintenance_interval'] = maintenance_interval
					expected_data_list.append(data)
					total_logs = total_logs
					if total_logs >=1:
						next_add_action = next_action
						for logs in range(1,total_logs):
							data = {}
							if scheme.system_date_format == 'nep':
								date_np = add_month_to_date(str_to_datetime(next_add_action),maintenance_interval, 'nep')
								next_add_action=date_np.to_datetime_date()
								data['next_action_np'] = str(date_np)
								data['next_action'] = date_np.to_datetime_date()
							else:
								next_action = add_month_to_date(str_to_datetime(next_add_action), maintenance_interval, 'en')
								next_add_action=next_action#.to_datetime_date()
								data['next_action'] = str(next_action)
								data['next_action_np']= str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
							data['maintenance_cost'] = comp.get('maintenance_cost')
							data['labour_cost'] = comp.get('labour_cost')
							data['replacement_cost'] =comp.get('replacement_cost')
							data['material_cost'] = comp.get('material_cost')
							data['component_numbers'] = comp.get('component_numbers')
							data['maintenance_interval'] = maintenance_interval
							expected_data_list.append(data)

				component2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte  = i.end_date, interval_unit='Day').values('next_action','apply_date','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
				for comp in component2:
					apply_date = comp.get("apply_date")
					if apply_date.year == this_year.year:
						interval = days_maintanace_interval(apply_date)
					else:
						interval = 365
					data = {}
					next_action = comp.get('apply_date')
					next_action_np = str(nepali_datetime.date.from_datetime_date(next_action))
					maintenance_interval = comp.get('maintenance_interval')
					total_logs = int((interval/maintenance_interval))
					data['next_action'] = str(next_action)
					data['next_action_np']=next_action_np#comp.get('next_action_np')
					data['maintenance_cost'] = comp.get('maintenance_cost')
					data['labour_cost'] = comp.get('labour_cost')
					data['replacement_cost'] =comp.get('replacement_cost')
					data['material_cost'] = comp.get('material_cost')
					data['component_numbers'] = comp.get('component_numbers')
					data['maintenance_interval'] = maintenance_interval
					expected_data_list.append(data)
					total_logs = total_logs
					if total_logs >=1:
						next_add_action = next_action
						for logs in range(1,total_logs):
							data = {}
							if scheme.system_date_format == 'nep':
								date_np = add_days_to_date(str(next_add_action),maintenance_interval,'nep')
								next_add_action=date_np.to_datetime_date()
								data['next_action_np'] = str(date_np)
								data['next_action'] = date_np.to_datetime_date()
							else:
								next_action = add_days_to_date(str_to_datetime(next_add_action),maintenance_interval,'en')
								next_add_action=next_action
								data['next_action'] = str(next_action)
								data['next_action_np']= str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
							data['maintenance_cost'] = comp.get('maintenance_cost')
							data['labour_cost'] = comp.get('labour_cost')
							data['replacement_cost'] =comp.get('replacement_cost')
							data['material_cost'] = comp.get('material_cost')
							data['component_numbers'] = comp.get('component_numbers')
							data['maintenance_interval'] = maintenance_interval
							expected_data_list.append(data)

				component3 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,maintenance_interval__in =diff, apply_date__lte  = i.end_date,interval_unit='Year').values('apply_date','next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
				if component3:
					for comp2 in component3:
						data = {}
						next_action = str(comp2.get('apply_date'))
						data['next_action'] = next_action
						data['next_action_np']=comp2.get('next_action_np') #str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
						data['maintenance_cost'] = comp2.get('maintenance_cost')
						data['labour_cost'] = comp2.get('labour_cost')
						data['replacement_cost'] =comp2.get('replacement_cost')
						data['material_cost'] = comp2.get('material_cost')
						data['component_numbers'] = comp2.get('component_numbers')
						data['maintenance_interval'] = comp2.get('maintenance_interval')
						expected_data_list.append(data)

				inflation_rate = OtherExpenseInflationRate.objects.filter(water_scheme=scheme).last()
				try:
					_rate_inflation = inflation_rate.rate
				except:
					_rate_inflation = 0
				if scheme.system_date_format == 'en':
					actual_cost = list(ComponentInfoLog.objects.filter((Q(component__component__category__water_scheme = scheme) | Q(component1__category__water_scheme = scheme)), \
					maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date, log_type="Maintenance").order_by('maintenance_date__year','maintenance_date__month').values('maintenance_date__year','maintenance_date__month') \
					.annotate(labour_cost = Sum('labour_cost'),material_cost = Sum('material_cost'), \
					replacement_cost = Sum('replacement_cost'), unsegregated_cost = Sum('cost_total'),))
					print(actual_cost, "88888888")
					expected_data_list.sort(key=lambda x:x['next_action'][:7])
					expected_cost = []

					for k,v in groupby(expected_data_list, key=lambda x:x['next_action'][:7]):
					# for k, v in enumerate(expected_data_list):
						material_cost = 0
						labour_cost = 0
						replacement_cost = 0
						unsegregated_cost = 0
						
						for j in list(v):
							if j.get('material_cost'):
								material_cost += j.get('material_cost') * j.get('component_numbers')
							if j.get('labour_cost'):
								labour_cost += j.get('labour_cost') * j.get('component_numbers')
							if j.get('replacement_cost'):
								replacement_cost += j.get('replacement_cost') * j.get('component_numbers')
							if j.get('maintenance_cost'):
								unsegregated_cost += j.get('maintenance_cost') * j.get('component_numbers')
						
						#inflation in expected 
						labour_cost =labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						material_cost =material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						replacement_cost =replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						expected_cost.append({'next_action__year':k[0:4],'next_action__month':k[5:7],'unsegregated_cost':round(unsegregated_cost,0),'material_cost':round(material_cost,0),'labour_cost':round(labour_cost,0),'replacement_cost':round(replacement_cost,0)})

					
				else:
					actual_cost_list = list(ComponentInfoLog.objects.filter((Q(component__component__category__water_scheme = scheme) | Q(component1__category__water_scheme = scheme)), \
					maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date, log_type="Maintenance").order_by('maintenance_date__year', 'maintenance_date__month').values('maintenance_date_np', 'cost_total','material_cost','labour_cost','replacement_cost','labour_cost'))
					print(actual_cost_list, "8888888888888")
					actual_cost_list.sort(key=lambda x:x['maintenance_date_np'][:7])
					actual_cost = []
					for k,v in groupby(actual_cost_list, key=lambda x:x['maintenance_date_np'][:7]):
						material_cost = 0
						labour_cost = 0
						replacement_cost = 0
						unsegregated_cost = 0
						for j in list(v):
							if j.get('material_cost'):
								material_cost += j.get('material_cost')
							if j.get('labour_cost'):
								labour_cost += j.get('labour_cost')
							if j.get('replacement_cost'):
								replacement_cost += j.get('replacement_cost')
							if j.get('cost_total'):
								unsegregated_cost += j.get('cost_total')
						actual_cost.append({'maintenance_date__year':k[0:4],'maintenance_date__month':k[5:7],'unsegregated_cost':round(unsegregated_cost,0),'material_cost':round(material_cost,0),'labour_cost':round(labour_cost,0),'replacement_cost':round(replacement_cost,0)})
					
					expected_data_list.sort(key=lambda x:x['next_action_np'][:7])
					expected_cost = []
					for k,v in groupby(expected_data_list, key=lambda x:x['next_action_np'][:7]):
						material_cost = 0
						labour_cost = 0
						replacement_cost = 0
						unsegregated_cost = 0
						for j in list(v):
							if j.get('material_cost'):
								material_cost += j.get('material_cost') * j.get('component_numbers')
							if j.get('labour_cost'):
								labour_cost += j.get('labour_cost') * j.get('component_numbers')
							if j.get('replacement_cost'):
								replacement_cost += j.get('replacement_cost') * j.get('component_numbers')
							if j.get('maintenance_cost'):
								unsegregated_cost += j.get('maintenance_cost') * j.get('component_numbers')
						
						#inflation in expected 
						labour_cost =labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						material_cost =material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						replacement_cost =replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
						expected_cost.append({'next_action__year':k[0:4],'next_action__month':k[5:7],'unsegregated_cost':round(unsegregated_cost,0),'material_cost':round(material_cost,0),'labour_cost':round(labour_cost,0),'replacement_cost':round(replacement_cost,0)})

		else:
			actual_cost = []
			for i in year_interval:
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))
				
				actual = ComponentInfoLog.objects.filter((Q(component__component__category__water_scheme__slug = self.kwargs.get('water_scheme_slug')) | Q(component1__category__water_scheme__slug = self.kwargs.get('water_scheme_slug'))), \
				maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date, log_type="Maintenance") \
				.aggregate(Sum('labour_cost'), Sum('material_cost'), \
				Sum('replacement_cost'), Sum('cost_total'),)
				labour_cost = actual.get('labour_cost__sum')
				if labour_cost is None:
					labour_cost = 0
				
				material_cost = actual.get('material_cost__sum')
				if material_cost is None:
					material_cost = 0
				
				replacement_cost = actual.get('replacement_cost__sum')
				if replacement_cost is None:
					replacement_cost = 0
				
				unsegregated_cost = actual.get('cost_total__sum')
				if unsegregated_cost is None:
					unsegregated_cost = 0
				actual_cost_total = unsegregated_cost + replacement_cost + material_cost + labour_cost
				actual_cost.append({'date_from': start_date, 'date_to':end_date, 'labour_cost':round(labour_cost,0),'material_cost':round(material_cost,0),'replacement_cost':round(replacement_cost,0),'unsegregated_cost':round(unsegregated_cost,0),'actual_cost_total':round(actual_cost_total,0)})
			expected_cost = []
			inflation_rate = OtherExpenseInflationRate.objects.filter(water_scheme=scheme).last()
			try:
				_rate_inflation = inflation_rate.rate
			except:
				_rate_inflation = 0
			expected_data_month = []
			expected_data = []
			for i in year_interval:
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = (nepali_datetime.date.from_datetime_date(start_date))
					end_date = (nepali_datetime.date.from_datetime_date(end_date))

				data = {}
				expected_total_cost = 0
				labour_cost = 0
				material_cost =0
				replacement_cost =0
				unsegregated_cost =0
				component1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte  = i.end_date, interval_unit='Day')
				component2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte  = i.end_date, interval_unit='Month')#.values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
				#componant1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lte = 1, apply_date__lte = i.start_date)
				diff = get_factors_of(i.year_num)

				componant4 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = i.end_date, interval_unit='Year')
				if componant4:
					for z in componant4:
						apply_date_ = z.apply_date
						m_interval = z.maintenance_interval
						itteration = int((scheme.period-i.year_num)/m_interval)
						year_num = 0
						m_interval_year = 0
						for a in range(itteration+1):
							datas = {}
							datas['apply_date'] = apply_date_
							datas['maintenance_cost'] = z.maintenance_cost
							datas['labour_cost'] = z.labour_cost
							datas['replacement_cost'] =z.replacement_cost
							datas['material_cost'] = z.material_cost
							datas['component_numbers'] = z.component_numbers
							datas['maintenance_interval'] = m_interval
							datas['is_cost_seggregated'] = z.is_cost_seggregated
							datas['next_apply_date'] = apply_date_.replace(apply_date_.year+int(m_interval_year))
							datas['year_num']= i.year_num+year_num
							if i.start_date.year == apply_date_.year:
								expected_data.append(datas)
							m_interval_year+=m_interval
							year_num+=m_interval

				if component1:
					for x in component1:
						apply_date = x.apply_date
						if apply_date.year == start_date.year:
							interval = days_maintanace_interval(apply_date)
						else:
							interval = 365
						if x.labour_cost is not None:
							labour_cost += x.labour_cost * int(interval/ x.maintenance_interval) * x.component_numbers
						if x.material_cost is not None:
							material_cost += x.material_cost * int(interval/ x.maintenance_interval) *  x.component_numbers
						if x.replacement_cost is not None:
							replacement_cost += x.replacement_cost * int(interval/ x.maintenance_interval) *  x.component_numbers
						if x.maintenance_cost is not None:
							unsegregated_cost += x.maintenance_cost * int(interval/ x.maintenance_interval) *  x.component_numbers

				if component2:
					for y in component2:
						apply_date = y.apply_date
						if apply_date.year == start_date.year:
							interval = month_maintanance_interval(apply_date)
						else:
							interval=12
						if y.labour_cost is not None:
							labour_cost += y.labour_cost * int(interval/ y.maintenance_interval) * y.component_numbers
						if y.material_cost is not None:
							material_cost += y.material_cost * int(interval/ y.maintenance_interval) *  y.component_numbers
						if y.replacement_cost is not None:
							replacement_cost += y.replacement_cost * int(interval/ y.maintenance_interval) *  y.component_numbers
						if y.maintenance_cost is not None:
							unsegregated_cost += y.maintenance_cost * int(interval/ y.maintenance_interval) *  y.component_numbers

				#inflation in expected 
				labour_cost =labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
				material_cost =material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
				replacement_cost =replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
				unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
				data['date_from'] = str(start_date)
				data['date_to'] = str(end_date) 
				data['labour_cost'] = round(labour_cost, 0)
				data['material_cost'] = round(material_cost,0)
				data['replacement_cost'] = round(replacement_cost,0)
				data['unsegregated_cost'] = round(unsegregated_cost,0)
				expected_total_cost = labour_cost + material_cost + replacement_cost + unsegregated_cost
				data['expected_total_cost'] = round(expected_total_cost,0)
				expected_data_month.append(data)
			expected_data_year = []
			for year in year_interval:
				data_ = {}
				start_date = year.start_date
				end_date =year.end_date

				if scheme.system_date_format == 'nep':
					start_date = (nepali_datetime.date.from_datetime_date(start_date))
					end_date = (nepali_datetime.date.from_datetime_date(end_date))

				expected_total_cost = 0
				labour_cost = 0
				material_cost =0
				replacement_cost =0
				unsegregated_cost =0
				for costs in expected_data:
					if year.year_num == costs.get('year_num'):
						if costs.get('material_cost'):
							material_cost += costs.get('material_cost') * costs.get('component_numbers')
						if costs.get('labour_cost'):
							labour_cost += costs.get('labour_cost') * costs.get('component_numbers')
						if costs.get('replacement_cost'):
							replacement_cost += costs.get('replacement_cost') * costs.get('component_numbers')
						if costs.get('maintenance_cost'):
							unsegregated_cost += costs.get('maintenance_cost') * costs.get('component_numbers')
						
				#inflation in expected 
				labour_cost =labour_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
				material_cost =material_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
				replacement_cost =replacement_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
				unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),year.year_num-1))

				data_['date_from'] = str(start_date)
				data_['date_to'] = str(end_date) 
				data_['labour_cost'] = round(labour_cost, 0)
				data_['material_cost'] = round(material_cost,0)
				data_['replacement_cost'] = round(replacement_cost,0)
				data_['unsegregated_cost'] = round(unsegregated_cost,0)
				expected_total_cost = labour_cost + material_cost + replacement_cost + unsegregated_cost
				data_['expected_total_cost'] = round(expected_total_cost,0)
				expected_data_year.append(data_)

			for d in range(scheme.period):
				final_dict = {}
				dict1 = expected_data_year[d]
				dict2 = expected_data_month[d]
				if dict1['date_from'] == dict2['date_from']:
					final_dict['date_from'] = dict1['date_from']
					final_dict['date_to'] = dict1['date_to']
					final_dict['labour_cost'] = dict1['labour_cost']+dict2['labour_cost']
					final_dict['material_cost'] = dict1['material_cost']+dict2['material_cost']
					final_dict['replacement_cost'] = dict1['replacement_cost']+dict2['replacement_cost']
					final_dict['unsegregated_cost'] = dict1['unsegregated_cost']+dict2['unsegregated_cost']
					final_dict['expected_total_cost'] = dict1['expected_total_cost']+dict2['expected_total_cost']
				expected_cost.append(final_dict)

		data = {
		'actual_cost':actual_cost,
		'expected_cost':expected_cost}
		return Response(data = data, status = status.HTTP_200_OK)

class MaintenanceCostReportByCost(APIView):
	def get(self, request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		start_year = scheme.tool_start_date.year
		this_year = datetime.date.today()
		try:
			this_year_interval = scheme.year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()
			this_year_actual_cost = ComponentInfoLog.objects.filter((Q(component__component__category__water_scheme = scheme) | Q(component1__category__water_scheme = scheme)), maintenance_date__gte = this_year_interval.start_date, maintenance_date__lte = this_year_interval.end_date, log_type="Maintenance").aggregate(Sum('labour_cost'),Sum('material_cost'),Sum('replacement_cost'),Sum('cost_total'),)
			total = 0
			if this_year_actual_cost.get('labour_cost__sum') is not None:
				total += this_year_actual_cost.get('labour_cost__sum')
			if this_year_actual_cost.get('material_cost__sum') is not None:
				total += this_year_actual_cost.get('material_cost__sum')
			if this_year_actual_cost.get('replacement_cost__sum') is not None:
				total += this_year_actual_cost.get('replacement_cost__sum')
			if this_year_actual_cost.get('cost_total__sum') is not None:
				total += this_year_actual_cost.get('cost_total__sum')
			this_year_actual_cost['this_year_actual_cost_total'] = round(total,2)
		except:
			this_year_actual_cost = None

		all_time_actual_cost = ComponentInfoLog.objects.filter((Q(component__component__category__water_scheme = scheme) | Q(component1__category__water_scheme = scheme)), \
		maintenance_date__year__gte = start_year, log_type="Maintenance") \
		.aggregate(Sum('labour_cost'),Sum('material_cost'), \
			Sum('replacement_cost'),Sum('cost_total'),)
		total = 0
		if all_time_actual_cost.get('labour_cost__sum') is not None:
			total += all_time_actual_cost.get('labour_cost__sum')
		if all_time_actual_cost.get('material_cost__sum') is not None:
			total += all_time_actual_cost.get('material_cost__sum')
		if all_time_actual_cost.get('replacement_cost__sum') is not None:
			total += all_time_actual_cost.get('replacement_cost__sum')
		if all_time_actual_cost.get('cost_total__sum') is not None:
			total += all_time_actual_cost.get('cost_total__sum')
		all_time_actual_cost['all_time_actual_cost_total'] = round(total, 2)

		all_year_interval = scheme.year_interval.all()
		
		expected_list = []
		inflation_rate = OtherExpenseInflationRate.objects.filter(water_scheme=scheme).last()
		try:
			_rate_inflation = inflation_rate.rate
		except:
			_rate_inflation = 0
		expected_data = []
		for i in all_year_interval:
			diff = get_factors_of(i.year_num)
			componant1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = i.end_date, interval_unit = 'Day')
			if componant1:
				for j in componant1:
					apply_date = j.apply_date
					if apply_date.year == i.start_date.year:
						interval = days_maintanace_interval(apply_date)
					else:
						interval = 365
					
					if j.labour_cost:
						labour_cost = j.labour_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						labour_cost=0
					if j.material_cost:
						material_cost = j.material_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						material_cost = 0
					if j.replacement_cost:
						replacement_cost = j.replacement_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						replacement_cost = 0
					if j.maintenance_cost:
						unsegregated_cost = j.maintenance_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						unsegregated_cost = 0

					labour_cost =labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					material_cost =material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					replacement_cost=replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					datas = {
						'labour_cost':labour_cost,
						'material_cost':material_cost,
						'replacement_cost':replacement_cost,
						'unsegregated_cost':unsegregated_cost
					}
					expected_list.append(datas)

			componant2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = i.end_date, interval_unit = 'Month')
			if componant2:
				for k in componant2:
					apply_date = k.apply_date
					if apply_date.year == i.start_date.year:
						interval = month_maintanance_interval(apply_date)
					else:
						interval=12
					if k.labour_cost:
						labour_cost = k.labour_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						labour_cost = 0
					if k.material_cost:
						material_cost = k.material_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						material_cost=0
					if k.replacement_cost:
						replacement_cost = k.replacement_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						replacement_cost=0
					if k.maintenance_cost:
						unsegregated_cost = k.maintenance_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						unsegregated_cost = 0
					labour_cost =labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					material_cost =material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					replacement_cost=replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					datas = {
						'labour_cost':labour_cost,
						'material_cost':material_cost,
						'replacement_cost':replacement_cost,
						'unsegregated_cost':unsegregated_cost
					}
					expected_list.append(datas)
				

			componant4 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = i.end_date, interval_unit='Year')
			if componant4:
				for z in componant4:
					apply_date_ = z.apply_date
					m_interval = z.maintenance_interval
					itteration = int((scheme.period-i.year_num)/m_interval)
					year_num = 0
					m_interval_year = 0
					for a in range(itteration+1):
						datas = {}
						datas['apply_date'] = apply_date_
						datas['maintenance_cost'] = z.maintenance_cost
						datas['labour_cost'] = z.labour_cost
						datas['replacement_cost'] =z.replacement_cost
						datas['material_cost'] = z.material_cost
						datas['component_numbers'] = z.component_numbers
						datas['maintenance_interval'] = m_interval
						datas['is_cost_seggregated'] = z.is_cost_seggregated
						datas['next_apply_date'] = apply_date_.replace(apply_date_.year+int(m_interval_year))
						datas['year_num']= i.year_num+year_num
						if i.start_date.year == apply_date_.year:
							expected_data.append(datas)
						m_interval_year+=m_interval
						year_num+=m_interval

		for year in all_year_interval:
			start_date = year.start_date
			end_date =year.end_date

			if scheme.system_date_format == 'nep':
				start_date = (nepali_datetime.date.from_datetime_date(start_date))
				end_date = (nepali_datetime.date.from_datetime_date(end_date))

			labour_cost = 0
			material_cost =0
			replacement_cost =0
			unsegregated_cost =0
			for costs in expected_data:
				if year.year_num == costs.get('year_num'):
					if costs.get('material_cost'):
						material_cost += costs.get('material_cost') * costs.get('component_numbers')
					if costs.get('labour_cost'):
						labour_cost += costs.get('labour_cost') * costs.get('component_numbers')
					if costs.get('replacement_cost'):
						replacement_cost += costs.get('replacement_cost') * costs.get('component_numbers')
					if costs.get('maintenance_cost'):
						unsegregated_cost += costs.get('maintenance_cost') * costs.get('component_numbers')
					
			#inflation in expected 
			labour_cost =labour_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
			material_cost =material_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
			replacement_cost =replacement_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
			unsegregated_cost =unsegregated_cost*(pow(1+(_rate_inflation/100),year.year_num-1))

			datas = {
				'labour_cost':labour_cost,
				'material_cost':material_cost,
				'replacement_cost':replacement_cost,
				'unsegregated_cost':unsegregated_cost
			}
			expected_list.append(datas)

			
		labour_cost = 0
		material_cost =0
		replacement_cost =0
		unsegregated_cost =0
		for item in expected_list:
			labour_cost+= item.get('labour_cost')
			material_cost+=item.get('material_cost')
			replacement_cost += item.get('replacement_cost')
			unsegregated_cost += item.get('unsegregated_cost')

		all_time_expected_cost_total = material_cost+labour_cost+replacement_cost+unsegregated_cost
		all_time_expected_cost = {'labour_cost':round(labour_cost,0),
		'material_cost':round(material_cost,0),
		'replacement_cost':round(replacement_cost,0),
		'unsegregated_cost':round(unsegregated_cost,0),
		'all_time_expected_cost_total':round(all_time_expected_cost_total,2)}

		this_year_interval = scheme.year_interval.filter(start_date__lte = this_year, end_date__gte = this_year)
		expected_this_year = []
		for i in this_year_interval:
			diff = get_factors_of(i.year_num)
			componant1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = i.end_date, interval_unit = 'Day')
			if componant1:
				for j in componant1:
					apply_date = j.apply_date
					if apply_date.year == this_year.year:
						interval = days_maintanace_interval(apply_date)
					else:
						interval = 365
					if j.labour_cost:
						_labour_cost = j.labour_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						_labour_cost = 0
					if j.material_cost:
						_material_cost = j.material_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						_material_cost = 0
					if j.replacement_cost:
						_replacement_cost = j.replacement_cost * int(interval/j.maintenance_interval) * j.component_numbers
					else:
						_replacement_cost=0
					if j.maintenance_cost:
						_unsegregated_cost = j.maintenance_cost * int(interval/ j.maintenance_interval) * j.component_numbers
					else:
						_unsegregated_cost =0

					_labour_cost =_labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_material_cost =_material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_replacement_cost=_replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_unsegregated_cost =_unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_datas = {
						'_labour_cost':_labour_cost,
						'_material_cost':_material_cost,
						'_replacement_cost':_replacement_cost,
						'_unsegregated_cost':_unsegregated_cost
					}
					expected_this_year.append(_datas)

			componant2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = i.end_date, interval_unit = 'Month')
			if componant2:
				for k in componant2:
					apply_date = k.apply_date
					if apply_date.year == this_year.year:
						interval = month_maintanance_interval(apply_date)
					else:
						interval = 12
					if k.labour_cost:
						_labour_cost = k.labour_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						_labour_cost = 0
					if k.material_cost:
						_material_cost = k.material_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						_material_cost = 0
					if k.replacement_cost:
						_replacement_cost = k.replacement_cost * int(interval/k.maintenance_interval) * k.component_numbers
					else:
						_replacement_cost = 0
					if k.maintenance_cost:
						_unsegregated_cost = k.maintenance_cost * int(interval/ k.maintenance_interval) * k.component_numbers
					else:
						_unsegregated_cost = 0

					_labour_cost =_labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_material_cost =_material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_replacement_cost=_replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_unsegregated_cost =_unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
					_datas = {
						'_labour_cost':_labour_cost,
						'_material_cost':_material_cost,
						'_replacement_cost':_replacement_cost,
						'_unsegregated_cost':_unsegregated_cost
					}
					expected_this_year.append(_datas)

			componant3 = ComponentInfo.objects.filter(Q(interval_unit = 'Year') & Q(component__category__water_scheme = scheme) \
				& Q(maintenance_interval__in = diff) & Q(apply_date__lte = i.end_date)).aggregate(labour_cost = Sum(F('labour_cost')*F('component_numbers'),output_field=FloatField()),\
					material_cost = Sum(F('material_cost')*F('component_numbers'),output_field=FloatField()), \
					replacement_cost = Sum(F('replacement_cost')*F('component_numbers'),output_field=FloatField()),\
					maintenance_cost = Sum(F('maintenance_cost')*F('component_numbers'),output_field=FloatField()))

			if componant3.get('labour_cost') is None:
				_labour_cost = 0
			else:
				_labour_cost = componant3.get('labour_cost')

			if componant3.get('material_cost') is None:
				_material_cost = 0
			else:
				_material_cost = componant3.get('material_cost')

			if componant3.get('replacement_cost') is None:
				_replacement_cost = 0
			else:
				_replacement_cost = componant3.get('replacement_cost')

			if componant3.get('maintenance_cost') is None:
				_unsegregated_cost = 0
			else:
				_unsegregated_cost = componant3.get('maintenance_cost')

			_labour_cost =_labour_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
			_material_cost =_material_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
			_replacement_cost=_replacement_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
			_unsegregated_cost =_unsegregated_cost*(pow(1+(_rate_inflation/100),i.year_num-1))
			_datas = {
				'_labour_cost':_labour_cost,
				'_material_cost':_material_cost,
				'_replacement_cost':_replacement_cost,
				'_unsegregated_cost':_unsegregated_cost
			}
			expected_this_year.append(_datas)

		_labour_cost = 0
		_material_cost =0
		_replacement_cost =0
		_unsegregated_cost =0
		for ds in expected_this_year:
			_labour_cost+=ds.get('_labour_cost')
			_material_cost+=ds.get('_material_cost')
			_replacement_cost += ds.get('_replacement_cost')
			_unsegregated_cost += ds.get('_unsegregated_cost')
		all_time_expected_cost_total = _material_cost+_labour_cost+_replacement_cost+_unsegregated_cost
		this_year_expected_cost = {'labour_cost':round(_labour_cost,0),
		'material_cost':round(_material_cost,0),
		'replacement_cost':round(_replacement_cost,0),
		'unsegregated_cost':round(_unsegregated_cost,0),
		'all_time_expected_cost_total':round(all_time_expected_cost_total,2)}

		data = {
		'this_year_actual_cost':this_year_actual_cost,
		'this_year_expected_cost':this_year_expected_cost,
		'all_time_actual_cost':all_time_actual_cost,
		'all_time_expected_cost':all_time_expected_cost}
		return Response(data = data, status = status.HTTP_200_OK)


#config component log list
class ConfigComponentLogList(ListAPIView):
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ConfigComponentInfoLogListSerializer
	filterset_fields = ['log_type']

	def get_queryset(self, *args, **kwargs):
		user = get_object_or_404(Users, id = self.request.user.id)
		return ComponentInfoLog.objects.filter(Q(component__component__category__water_scheme = user.water_scheme) | Q(component1__category__water_scheme=user.water_scheme) | Q(component__component__category__water_scheme=user.water_scheme))

class ConfigComponentLogCreate(CreateAPIView):
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ConfigComponentInfoLogListSerializer

	def get_queryset(self, *args, **kwargs):
		user = get_object_or_404(Users, id = self.request.user.id)
		return ComponentInfoLog.objects.filter(Q(component__component__category__water_scheme = user.water_scheme) | Q(component1__category__water_scheme=user.water_scheme) | Q(component__component__category__water_scheme=user.water_scheme))

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		serializer.save()
		data = serializer.data
		img = request.FILES.getlist('componant_picture')
		try:
			if img:
				for i in img:
					img = compress(i)
					if img == "error":
						raise serializers.ValidationError("The file type is not supported!!")
					ComponentInfoLogImage.objects.create(component_image=img, component=get_object_or_404(ComponentInfoLog, id=data['id']))
			comp = data['id']
			img_list = ComponentInfoLogImage.objects.filter(component=comp).values('component_image')
			image_data=  []
			if img_list:
				if request.is_secure():
					protocol = 'https://'
				else:
					protocol = 'http://'
				domain = str(request.META['HTTP_HOST'])#+'medial/'+i
				for i in img_list:
					full_path = protocol+domain+"/"+'media/'+str(i.get('component_image'))
					image_data.append(full_path)
					data['component_image'] = image_data
			else:
				data['component_image'] = image_data
		except Exception as e:
			raise serializers.ValidationError(e)
		return Response(data, status=status.HTTP_201_CREATED)


class ConfigComponentLogUpdate(RetrieveUpdateAPIView):
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ConfigComponentInfoLogListSerializer
	lookup_field = 'pk'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog, id = self.kwargs['pk'])

	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', True)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)
		serializer.save()
		data = serializer.data
		lang = kwargs.get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		if data['is_cost_seggregated'] or data['is_cost_seggregated'] == True or data['is_cost_seggregated'] == 'true':
			data['cost_total'] = 0
		else:
			data['labour_cost'] = 0
			data['material_cost'] = 0
			data['replacement_cost'] =0
		try:
			img = request.FILES.getlist('componant_picture')
			if img:
				obj = ComponentInfoLogImage.objects.filter(component=get_object_or_404(ComponentInfoLog, id=data['id']))
				obj.delete()
				for i in img:
					img = compress(i)
					if img == "error":
						raise serializers.ValidationError("The file type is not supported!!")
					obj = ComponentInfoLogImage.objects.create(component_image=img, component=get_object_or_404(ComponentInfoLog, id=data['id']))
					obj.save()
				comp = data['id']
				img_list = ComponentInfoLogImage.objects.filter(component=comp).values('component_image')
				image_data=  []
				if img_list:
					if request.is_secure():
						protocol = 'https://'
					else:
						protocol = 'http://'

					domain = str(request.META['HTTP_HOST'])#+'medial/'+i
					for i in img_list:
						full_path = protocol+domain+"/"+'media/'+str(i.get('component_image'))
						image_data.append(full_path)
						data['component_image'] = image_data
				else:
					data['component_image'] = img_list
		except Exception as e:
			raise serializers.ValidationError(e)

		# print(data)
		# data = "Success"
		return Response(data, status=status.HTTP_201_CREATED)

	def patch(self, request, *args, **kwargs):
		return super().patch(request, *args, **kwargs)
	
	# def put(self, request, *args, **kwargs):
	# 	return super().partial_update(request, *args, **kwargs)


class ConfigComponentLogDelete(DestroyAPIView):
	permission_classes = [IsAuthenticated]
	queryset = ComponentInfoLog.objects.all()
	lookup_field = 'pk'
	
	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog,id = self.kwargs['pk'])

	def destroy(self, request, *args, **kwargs):
		delete_id = kwargs['pk'] 
		obj = ComponentInfoLogImage.objects.filter(component = delete_id)
		obj.delete()
		return super().destroy(request, *args, **kwargs)