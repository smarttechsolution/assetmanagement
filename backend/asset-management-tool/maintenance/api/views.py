from django.http.response import JsonResponse
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
from .utils import add_months,add_nep_month
from django.db.models import Sum, Avg
from rest_framework.response import Response
from rest_framework import generics, status, views
from django.db.models import Q, F, FloatField

class ComponentCategoryListView(ListAPIView):
	"""
	Asset Component category list for care taker and Scheme administrator after login
	"""
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
	queryset = AssetComponentCategory.objects.all()
	serializer_class = ComponentCategorySerializer

	def get_queryset(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return AssetComponentCategory.objects.filter(water_scheme__slug = user.water_scheme.slug)

class ComponentCategoryCreateView(CreateAPIView):
	"""Creating Asset Component  category by scheme administrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = AssetComponentCategory.objects.all()
	serializer_class = ComponentCategorySerializer

	def get_queryset(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return AssetComponentCategory.objects.filter(water_scheme__slug = user.water_scheme.slug)

class ComponentCategoryUpdateView(RetrieveUpdateAPIView):
	"""Updating component category by scheme administrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
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
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
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
		return Component.objects.filter(category__water_scheme__slug = user.water_scheme.slug)

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
	permission_classes = [IsAuthenticated, (IsSchemeAdministrator | IsCareTaker)]
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
	permission_classes = [IsAuthenticated, (IsCareTaker | IsSchemeAdministrator)]
	queryset = ComponentInfo.objects.all()
	serializer_class = ComponentInfoListSerializer
	filterset_fields = ('mitigation','supply_belt')
	OrderingFilter = ('next_action','resulting_risk_score','maintenance_cost',)

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
		componant1 = ComponentInfo.objects.filter(component__category__water_scheme = user.water_scheme, maintenance_interval__lt = 1, apply_date__lte = year_interval.start_date)
		componant2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = user.water_scheme) \
				& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.start_date))
		return componant1 | componant2

class ComponentInfoCreateView(CreateAPIView):
	"""
	API to create  Component Info by scheme administrative.
	custom parameter: lang     possible value: en or nep
	send query param 	?year=id also
	"""
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
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
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
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
	permission_classes = [IsAuthenticated,(IsCareTaker | IsSchemeAdministrator)]
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
	permission_classes = [IsAuthenticated, IsCareTaker]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ComponentLogCreateSerializer

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog, component__component__category__water_scheme = user.water_scheme)

class ComponentLogUpdateView(RetrieveUpdateAPIView):
	"""Updating Logs of components and retreving"""
	permission_classes = [IsAuthenticated, IsCareTaker]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ComponentLogCreateSerializer

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog,id = self.kwargs['pk'],component__component__category__water_scheme = user.water_scheme)

def get_factors_of(num):
	"""Return factor of integer number"""
	factor_list = []
	for i in range(1, num + 1):
		if num % i == 0:
			factor_list.append(i)
	return factor_list

def Convert(tup, di):
    for a, b in tup:
        di.setdefault(a, []).append(b)
    return di
    
class MaintenanceCostReport(APIView):
	"""
	Maintenance report 
	Query param to be used: this_year, supply_belt
	?this_year=True and or ?supply_belt=id
	git 
	"""
	def get(self, request, *args, **kwargs):
		this_year = request.GET.get('this_year',None)
		# supply_belt = request.GET.get('supply_belt', None)
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		year_interval = scheme.year_interval.all().order_by('year_num')
		
		if this_year:
			from itertools import groupby
			this_year = datetime.date.today()
			year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year)
			for i in year_interval:
				from finance.api.utils import get_month_range_in_list
				months = get_month_range_in_list(i, scheme.system_date_format)
				diff = get_factors_of(i.year_num)

				expected_data_list = []
				component1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lte = 1, apply_date__lte  = i.start_date).values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
				for comp in component1:
					data = {}
					next_action = comp.get('next_action')
					next_action_np = str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
					maintenance_interval = comp.get('maintenance_interval')
					total_logs = int(round(1/maintenance_interval,0))
					next_action_month_interval = int(round(12/total_logs,0))
					data['next_action'] = str(next_action)
					data['next_action_np']=next_action_np#comp.get('next_action_np')
					data['maintenance_cost'] = comp.get('maintenance_cost')
					data['labour_cost'] = comp.get('labour_cost')
					data['replacement_cost'] =comp.get('replacement_cost')
					data['material_cost'] = comp.get('material_cost')
					data['component_numbers'] = comp.get('component_numbers')
					data['maintenance_interval'] = maintenance_interval
					expected_data_list.append(data)
					total_logs = total_logs-1
					if total_logs >=1:
						add_interval = next_action_month_interval
						for logs in range(total_logs):
							data = {}
							if scheme.system_date_format == 'nep':
								date_np = add_nep_month(str(next_action_np),add_interval)
								data['next_action_np'] = str(date_np)
								data['next_action'] = date_np.to_datetime_date()
							else:
								next_action = str(add_months(str_to_datetime(next_action),add_interval))
								data['next_action'] = next_action
								data['next_action_np']= str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
							add_interval =add_interval+next_action_month_interval
							data['maintenance_cost'] = comp.get('maintenance_cost')
							data['labour_cost'] = comp.get('labour_cost')
							data['replacement_cost'] =comp.get('replacement_cost')
							data['material_cost'] = comp.get('material_cost')
							data['component_numbers'] = comp.get('component_numbers')
							data['maintenance_interval'] = maintenance_interval
							expected_data_list.append(data)
				component2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__gt = 1,maintenance_interval__in =diff, apply_date__lte  = i.start_date,).values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
				if component2:
					for comp2 in component2:
						data = {}
						next_action = str(comp2.get('next_action'))
						data['next_action'] = next_action
						data['next_action_np']=comp2.get('next_action_np') #str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
						data['maintenance_cost'] = comp2.get('maintenance_cost')
						data['labour_cost'] = comp2.get('labour_cost')
						data['replacement_cost'] =comp2.get('replacement_cost')
						data['material_cost'] = comp2.get('material_cost')
						data['component_numbers'] = comp2.get('component_numbers')
						data['maintenance_interval'] = comp2.get('maintenance_interval')
						expected_data_list.append(data)
				
				if scheme.system_date_format == 'en':
					# if supply_belt:
					# 	actual_cost = list(ComponentInfoLog.objects.filter(supply_belt_id = supply_belt, component__component__category__water_scheme = scheme, \
					# 	maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date).order_by('maintenance_date__year','maintenance_date__month').values('maintenance_date__year','maintenance_date__month') \
					# 	.annotate(labour_cost = Sum('labour_cost'),material_cost = Sum('material_cost'), \
					# 	replacement_cost = Sum('replacement_cost'), unsegregated_cost = Sum('cost_total'),))
					# else:
					actual_cost = list(ComponentInfoLog.objects.filter(component__component__category__water_scheme = scheme, \
					maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date).order_by('maintenance_date__year','maintenance_date__month').values('maintenance_date__year','maintenance_date__month') \
					.annotate(labour_cost = Sum('labour_cost'),material_cost = Sum('material_cost'), \
					replacement_cost = Sum('replacement_cost'), unsegregated_cost = Sum('cost_total'),))

					# if supply_belt:
					# 	expected_cost = list(ComponentInfo.objects.filter(supply_belt_id = supply_belt, component__category__water_scheme = scheme, \
					# 	next_action__gte = i.start_date, next_action__lte = i.end_date).order_by('next_action__year','next_action__month').values('next_action__year','next_action__month') \
					# 	.annotate(labour_cost = Sum('labour_cost'),material_cost = Sum('material_cost'), \
					# 		replacement_cost = Sum('replacement_cost'), unsegregated_cost = Sum('maintenance_cost'),))
					# else:
					
					expected_data_list.sort(key=lambda x:x['next_action'][:7])
					expected_cost = []
					for k,v in groupby(expected_data_list, key=lambda x:x['next_action'][:7]):
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
						expected_cost.append({'next_action__year':k[0:4],'next_action__month':k[5:7],'unsegregated_cost':unsegregated_cost,'material_cost':material_cost,'labour_cost':labour_cost,'replacement_cost':replacement_cost})
				else:
					actual_cost_list = list(ComponentInfoLog.objects.filter(component__component__category__water_scheme = scheme, \
					maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date).order_by('maintenance_date__year', 'maintenance_date__month').values('maintenance_date_np', 'cost_total','material_cost','labour_cost','replacement_cost','labour_cost'))
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
						actual_cost.append({'maintenance_date__year':k[0:4],'maintenance_date__month':k[5:7],'unsegregated_cost':unsegregated_cost,'material_cost':material_cost,'labour_cost':labour_cost,'replacement_cost':replacement_cost})
					
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
						expected_cost.append({'next_action__year':k[0:4],'next_action__month':k[5:7],'unsegregated_cost':unsegregated_cost,'material_cost':material_cost,'labour_cost':labour_cost,'replacement_cost':replacement_cost})

		else:
			actual_cost = []
			for i in year_interval:
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))
				
				# if supply_belt:
				# 	actual = ComponentInfoLog.objects.filter(supply_belt_id = supply_belt, component__component__category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), \
				# 	maintenance_date__gte = i.start_year, maintenance_date__lte = i.end_date) \
				# 	.aggregate(Sum('labour_cost'), Sum('material_cost'), \
				# 	Sum('replacement_cost'), Sum('cost_total'),)
				# else:
				actual = ComponentInfoLog.objects.filter(component__component__category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), \
				maintenance_date__gte = i.start_date, maintenance_date__lte = i.end_date) \
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
				actual_cost.append({'date_from': start_date, 'date_to':end_date, 'labour_cost':labour_cost,'material_cost':material_cost,'replacement_cost':replacement_cost,'unsegregated_cost':unsegregated_cost,'actual_cost_total':actual_cost_total})
			
			expected_cost = []
			for i in year_interval:
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))

				diff = get_factors_of(i.year_num)
				data = {}
				expected_total_cost = 0
				labour_cost = 0
				material_cost =0
				replacement_cost =0
				unsegregated_cost =0

				# if supply_belt:
				# 	componant1 = ComponentInfo.objects.filter(supply_belt_id = supply_belt, component__category__water_scheme = scheme, maintenance_interval__lt = 1, apply_date__gte = i.start_date, apply_date__lte = i.end_date)
				# 	componant2 = ComponentInfo.objects.filter(Q(supply_belt_id = supply_belt) & Q(component__category__water_scheme = scheme) \
				# 	& Q(maintenance_interval__in = diff) & Q(apply_date__gte = i.start_date)  & Q(apply_date__lte = i.start_end)).aggregate(Sum('labour_cost'),Sum('material_cost'), \
				# 	Sum('replacement_cost'), Sum('maintenance_cost'),)
				# else:
				componant1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lte = 1, apply_date__lte = i.start_date)
				
				componant2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,maintenance_interval__in = diff, apply_date__lte = i.start_date, maintenance_interval__gt=1).aggregate(labour_cost = Sum(F('labour_cost')*F('component_numbers'),output_field=FloatField()),\
					material_cost = Sum(F('material_cost')*F('component_numbers'),output_field=FloatField()), \
					replacement_cost = Sum(F('replacement_cost')*F('component_numbers'),output_field=FloatField()),\
					maintenance_cost = Sum(F('maintenance_cost')*F('component_numbers'),output_field=FloatField()),)
				if componant1:
					for x in componant1:
						if x.labour_cost is not None:
							labour_cost += x.labour_cost * int(round(1/ x.maintenance_interval,0)) * x.component_numbers
						if x.material_cost is not None:
							material_cost += x.material_cost * int(round(1/ x.maintenance_interval,0)) *  x.component_numbers
						if x.replacement_cost is not None:
							replacement_cost += x.replacement_cost * int(round(1/ x.maintenance_interval,0)) *  x.component_numbers
						if x.maintenance_cost is not None:
							unsegregated_cost += x.maintenance_cost * int(round(1/ x.maintenance_interval,0)) *  x.component_numbers

				if componant2.get('labour_cost') is None:
					labour_cost += 0
				else:
					labour_cost += componant2.get('labour_cost')

				if componant2.get('material_cost') is None:
					material_cost += 0
				else:
					material_cost += componant2.get('material_cost')

				if componant2.get('replacement_cost') is None:
					replacement_cost += 0
				else:
					replacement_cost += componant2.get('replacement_cost')

				if componant2.get('maintenance_cost') is None:
					unsegregated_cost += 0
				else:
					unsegregated_cost += componant2.get('maintenance_cost')
				data['date_from'] = start_date 
				data['date_to'] = end_date 
				data['labour_cost'] = round(labour_cost, 0)
				data['material_cost'] = round(material_cost,0)
				data['replacement_cost'] = round(replacement_cost,0)
				data['unsegregated_cost'] = round(unsegregated_cost,0)
				expected_total_cost = labour_cost + material_cost + replacement_cost + unsegregated_cost
				data['expected_total_cost'] = round(expected_total_cost,0)
				expected_cost.append(data)
		data = {
		'actual_cost':actual_cost,
		'expected_cost':expected_cost}
		return Response(data = data, status = status.HTTP_200_OK)

class MaintenanceCostReportByCost(APIView):
	def get(self, request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		start_year = scheme.system_operation_from.year
		end_year = scheme.system_operation_to.year
		this_year = datetime.date.today()
		this_year_interval = scheme.year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()

		this_year_actual_cost = ComponentInfoLog.objects.filter(component__component__category__water_scheme = scheme, maintenance_date__gte = this_year_interval.start_date, maintenance_date__lte = this_year_interval.end_date).aggregate(Sum('labour_cost'),Sum('material_cost'),Sum('replacement_cost'),Sum('cost_total'),)
		total = 0
		if this_year_actual_cost.get('labour_cost__sum') is not None:
			total += this_year_actual_cost.get('labour_cost__sum')
		if this_year_actual_cost.get('material_cost__sum') is not None:
			total += this_year_actual_cost.get('material_cost__sum')
		if this_year_actual_cost.get('replacement_cost__sum') is not None:
			total += this_year_actual_cost.get('replacement_cost__sum')
		if this_year_actual_cost.get('cost_total__sum') is not None:
			total += this_year_actual_cost.get('cost_total__sum')
		this_year_actual_cost['this_year_actual_cost_total'] = total

		all_time_actual_cost = ComponentInfoLog.objects.filter(component__component__category__water_scheme = scheme, \
		maintenance_date__year__gte = start_year, maintenance_date__year__lte = end_year) \
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
		all_time_actual_cost['all_time_actual_cost_total'] = total

		all_year_interval = scheme.year_interval.all()
		labour_cost = 0
		material_cost =0
		replacement_cost =0
		unsegregated_cost =0
		for i in all_year_interval:
			diff = get_factors_of(i.year_num)
			componant1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lt = 1, apply_date__lte = i.start_date)
			if componant1:
				for j in componant1:
					if j.labour_cost:
						labour_cost += j.labour_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers
					if j.material_cost:
						material_cost += j.material_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers
					if j.replacement_cost:
						replacement_cost += j.replacement_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers
					if j.maintenance_cost:
						unsegregated_cost += j.maintenance_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers

			componant2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = scheme) \
				& Q(maintenance_interval__in = diff) & Q(apply_date__lte = i.start_date)).aggregate(labour_const = Sum(F('labour_cost')*F('component_numbers'),output_field=FloatField()),\
					material_cost = Sum(F('material_cost')*F('component_numbers'),output_field=FloatField()), \
					replacement_cost = Sum(F('replacement_cost')*F('component_numbers'),output_field=FloatField()),\
					maintenance_cost = Sum(F('maintenance_cost')*F('component_numbers'),output_field=FloatField()),)

			if componant2.get('labour_cost') is None:
				labour_cost += 0
			else:
				labour_cost += componant2.get('labour_cost')

			if componant2.get('material_cost') is None:
				material_cost += 0
			else:
				material_cost += componant2.get('material_cost')

			if componant2.get('replacement_cost') is None:
				replacement_cost += 0
			else:
				replacement_cost += componant2.get('replacement_cost')

			if componant2.get('maintenance_cost') is None:
				unsegregated_cost += 0
			else:
				unsegregated_cost += componant2.get('maintenance_cost')
		all_time_expected_cost_total = material_cost+labour_cost+replacement_cost+unsegregated_cost
		all_time_expected_cost = {'labour_cost':round(labour_cost,2),
		'material_cost':round(material_cost,0),
		'replacement_cost':round(replacement_cost,0),
		'unsegregated_cost':round(unsegregated_cost,0),
		'all_time_expected_cost_total':round(all_time_expected_cost_total,0)}

		this_year_interval = scheme.year_interval.filter(start_date__lte = this_year, end_date__gte = this_year)
		_labour_cost = 0
		_material_cost =0
		_replacement_cost =0
		_unsegregated_cost =0
		for i in this_year_interval:
			diff = get_factors_of(i.year_num)
			componant1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lt = 1, apply_date__lte = i.start_date)
			if componant1:
				for j in componant1:
					if j.labour_cost:
						_labour_cost += j.labour_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers
					if j.material_cost:
						_material_cost += j.material_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers
					if j.replacement_cost:
						_replacement_cost += j.replacement_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers
					if j.maintenance_cost:
						_unsegregated_cost += j.maintenance_cost * int(round(1/ j.maintenance_interval,0)) * j.component_numbers

			componant2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = scheme) \
				& Q(maintenance_interval__in = diff) & Q(apply_date__lte = i.start_date)).aggregate(labour_const = Sum(F('labour_cost')*F('component_numbers'),output_field=FloatField()),\
					material_cost = Sum(F('material_cost')*F('component_numbers'),output_field=FloatField()), \
					replacement_cost = Sum(F('replacement_cost')*F('component_numbers'),output_field=FloatField()),\
					maintenance_cost = Sum(F('maintenance_cost')*F('component_numbers'),output_field=FloatField()))

			if componant2.get('labour_cost') is None:
				_labour_cost += 0
			else:
				_labour_cost += componant2.get('labour_cost')

			if componant2.get('material_cost') is None:
				_material_cost += 0
			else:
				_material_cost += componant2.get('material_cost')

			if componant2.get('replacement_cost') is None:
				_replacement_cost += 0
			else:
				_replacement_cost += componant2.get('replacement_cost')

			if componant2.get('maintenance_cost') is None:
				_unsegregated_cost += 0
			else:
				_unsegregated_cost += componant2.get('maintenance_cost')

		all_time_expected_cost_total = _material_cost+_labour_cost+_replacement_cost+_unsegregated_cost
		this_year_expected_cost = {'labour_cost':round(_labour_cost,0),
		'material_cost':round(_material_cost,0),
		'replacement_cost':round(_replacement_cost,0),
		'unsegregated_cost':round(_unsegregated_cost,0),
		'all_time_expected_cost_total':round(all_time_expected_cost_total,0)}

		data = {
		'this_year_actual_cost':this_year_actual_cost,
		'this_year_expected_cost':this_year_expected_cost,
		'all_time_actual_cost':all_time_actual_cost,
		'all_time_expected_cost':all_time_expected_cost}
		return Response(data = data, status = status.HTTP_200_OK)


#config component log list
class ConfigComponentLogList(ListAPIView):
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ConfigComponentInfoLogListSerializer

	def get_queryset(self, *args, **kwargs):
		user = get_object_or_404(Users, id = self.request.user.id)
		return ComponentInfoLog.objects.filter(component__component__category__water_scheme = user.water_scheme)

class ConfigComponentLogCreate(CreateAPIView):
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ConfigComponentInfoLogListSerializer

	def get_queryset(self, *args, **kwargs):
		user = get_object_or_404(Users, id = self.request.user.id)
		return ComponentInfoLog.objects.filter(component__component__category__water_scheme = user.water_scheme)

class ConfigComponentLogUpdate(RetrieveUpdateAPIView):
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
	queryset = ComponentInfoLog.objects.all()
	serializer_class = ConfigComponentInfoLogListSerializer
	lookup_field = 'pk'

	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog, id = self.kwargs['pk'],component__component__category__water_scheme = user.water_scheme)

class ConfigComponentLogDelete(DestroyAPIView):
	permission_classes = [IsAuthenticated,IsSchemeAdministrator]
	queryset = ComponentInfoLog.objects.all()
	lookup_field = 'pk'
	
	def get_object(self):
		user=get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ComponentInfoLog,id = self.kwargs['pk'],component__component__category__water_scheme = user.water_scheme)
