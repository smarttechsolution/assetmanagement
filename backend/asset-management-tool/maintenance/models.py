from django.db import models as m
from config_pannel.models import *
from django.utils.translation import gettext_lazy as _
from users.models import Users
import os
from django.shortcuts import get_object_or_404
from maintenance.api.utils import days_maintanace_interval, month_maintanance_interval


# Create your models here.
class AssetComponentCategory(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='asset_component_category')
	name = m.CharField(_("Name"), max_length = 250)

	def __str__(self):
		return f'{self.name}-{self.id}-{self.water_scheme.scheme_name}'



def generate_path(instance, filename):
    return os.path.join("asset-component", instance.component.category.water_scheme.slug, filename)

class Components(m.Model):
	category = m.ForeignKey(AssetComponentCategory, on_delete=m.PROTECT, related_name='cat_asset_component')
	name = m.CharField(max_length=250)

	def __str__(self):
		return f'{self.name}-{self.category.water_scheme.scheme_name}'


class ComponentInfo(m.Model):
	# class Actions(m.TextChoices):
	# 	REPLACE = 'Replace','REPLACE'
	# 	PAINT = 'Paint','PAINT'
	# 	REINFORCE = 'Reinforce','REINFORCE'

	class Failure(m.TextChoices):
		HIGH = 'High','High'
		MEDIUM = 'Medium','Medium'
		LOW = 'Low','Low'
		MINIMAL = 'Minimal', 'Minimal'

	class Impact(m.TextChoices):
		TotalLossOfFunction = 'Total Loss Of Function','Total Loss Of Function'
		ReductionofSystemFunctionality = 'Reduction of System Functionality','Reduction of System Functionality'
		ReductionofPArtsFunctionality = 'Reduction of Parts Functionality','Reduction of Parts Functionality'
		HardlyEffect = 'Hardly any Effect', 'Hardly any Effect'

	class Mitigation(m.TextChoices):
		PREVENTIVE = 'Preventive','Preventive'
		INSPECTION = 'Inspection','Inspection'
		REACTIVE = 'Reactive','Reactive'

	class Interval_Choices(m.TextChoices):
		DAY = 'Day','Day'
		MONTH = 'Month','Month'
		YEAR = 'Year','Year'

	component = m.ForeignKey(Components, on_delete = m.PROTECT, related_name='component_info')
	possible_failure = m.CharField(max_length=250, null=True, blank=True)
	description = m.CharField(max_length=250, null=True, blank=True)
	component_numbers = m.IntegerField(default=1)
	maintenance_cost = m.FloatField(blank=True, null=True)
	labour_cost = m.FloatField(null=True, blank=True)
	material_cost = m.FloatField(null=True, blank=True)
	replacement_cost = m.FloatField(null=True, blank=True)
	maintenance_action = m.CharField(max_length=250)
	maintenance_interval = m.FloatField()
	interval_unit = m.CharField(max_length=30, choices=Interval_Choices.choices)
	impact_of_failure = m.CharField(max_length=100, choices = Impact.choices)
	possibility_of_failure = m.CharField(max_length=50, choices=Failure.choices)
	resulting_risk_score = m.FloatField()
	mitigation = m.CharField(max_length=50, choices=Mitigation.choices)
	responsible = m.CharField(max_length=50)
	next_action = m.DateField(blank=True, null=True)
	next_action_np = m.CharField(max_length=13, blank=True, null=True)
	componant_picture = m.ImageField(upload_to = generate_path, null=True, blank=True)
	apply_date = m.DateField()
	created_at = m.DateTimeField(auto_now_add=True)
	is_cost_seggregated = m.BooleanField(default=False)

	def __str__(self):
		return f'{self.component.name}-{self.component.category.water_scheme.scheme_name}'

	@property
	def seggregated_or_unseggregated_cost(self):
		if self.is_cost_seggregated:
			return self.replacement_cost + self.material_cost + self.labour_cost
		else:
			return self.maintenance_cost
	
	@classmethod
	def get_maintenance_cost(cls,scheme,start_month, end_month,year_interval):
		count = 0
		import datetime
		from maintenance.api.utils import str_to_datetime, add_nep_month,add_months, add_month_to_date, add_days_to_date
<<<<<<< HEAD
		from maintenance.api.views import get_factors_of
=======
		from maintenance.api.views import get_factors_of, get_factor_of_year
>>>>>>> ams-final
		from django.db.models import Q
		from finance.api.utils import get_equivalent_date
		factors = get_factors_of(year_interval.year_num)
		this_year = datetime.datetime.today()
		expected_data_list = []
<<<<<<< HEAD
		component1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = year_interval.end_date, interval_unit = 'Day').values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np','is_cost_seggregated')
=======
		component1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = year_interval.end_date, interval_unit = 'Day').values('next_action','apply_date','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np','is_cost_seggregated')
>>>>>>> ams-final
		for comp in component1:
			apply_date = comp.get("apply_date")
			if apply_date.year == this_year.year:
				interval = days_maintanace_interval(apply_date)
			else:
				interval = 365
			data = {}
			next_action = comp.get('apply_date')
			next_action_np = str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
			maintenance_interval = comp.get('maintenance_interval')
<<<<<<< HEAD
			total_logs = int(365/maintenance_interval)
=======
			total_logs = int(interval/maintenance_interval)
>>>>>>> ams-final
			# next_action_month_interval = int(round(12/total_logs,0))
			data['next_action'] = str(next_action)
			data['next_action_np']=next_action_np#comp.get('next_action_np')
			data['maintenance_cost'] = comp.get('maintenance_cost')
			data['labour_cost'] = comp.get('labour_cost')
			data['replacement_cost'] =comp.get('replacement_cost')
			data['material_cost'] = comp.get('material_cost')
			data['component_numbers'] = comp.get('component_numbers')
			data['maintenance_interval'] = maintenance_interval
			data['is_cost_seggregated'] = comp.get('is_cost_seggregated')
<<<<<<< HEAD
=======
			data['total_logs'] = total_logs

>>>>>>> ams-final
			expected_data_list.append(data)
			total_logs = total_logs-1
			if total_logs >=1:
				next_add_action = next_action
				for logs in range(total_logs):
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
<<<<<<< HEAD
					data['maintenance_cost'] = comp.get('maintenance_cost')
					data['labour_cost'] = comp.get('labour_cost')
					data['replacement_cost'] =comp.get('replacement_cost')
					data['material_cost'] = comp.get('material_cost')
					data['component_numbers'] = comp.get('component_numbers')
					data['maintenance_interval'] = maintenance_interval
					expected_data_list.append(data)
		
		component2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = year_interval.end_date, interval_unit = 'Month').values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np','is_cost_seggregated')
		for comp in component2:
			data = {}
			next_action = comp.get('next_action')
			next_action_np = str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
			maintenance_interval = comp.get('maintenance_interval')
			total_logs = int(12/maintenance_interval)
			data['next_action'] = str(next_action)
			data['next_action_np']=next_action_np#comp.get('next_action_np')
			data['maintenance_cost'] = comp.get('maintenance_cost')
			data['labour_cost'] = comp.get('labour_cost')
			data['replacement_cost'] =comp.get('replacement_cost')
			data['material_cost'] = comp.get('material_cost')
			data['component_numbers'] = comp.get('component_numbers')
			data['maintenance_interval'] = maintenance_interval
			data['is_cost_seggregated'] = comp.get('is_cost_seggregated')
			expected_data_list.append(data)
			total_logs = total_logs-1
			if total_logs >=1:
				next_add_action = next_action
				for logs in range(total_logs):
					data = {}
					if scheme.system_date_format == 'nep':
						date_np = add_month_to_date(str_to_datetime(next_add_action),maintenance_interval, 'nep')
						next_add_action=date_np.to_datetime_date()
						data['next_action_np'] = str(date_np)
						data['next_action'] = date_np.to_datetime_date()
					else:
						next_action = add_month_to_date(str_to_datetime(next_add_action), maintenance_interval, 'en')
						next_add_action=next_action
						data['next_action'] = str(next_action)
						data['next_action_np']= str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))					
=======
					# expected_data_list.append(data)
					
>>>>>>> ams-final
					data['maintenance_cost'] = comp.get('maintenance_cost')
					data['labour_cost'] = comp.get('labour_cost')
					data['replacement_cost'] =comp.get('replacement_cost')
					data['material_cost'] = comp.get('material_cost')
					data['component_numbers'] = comp.get('component_numbers')
					data['maintenance_interval'] = maintenance_interval
					data['is_cost_seggregated'] = comp.get('is_cost_seggregated')
					expected_data_list.append(data)
		
		component2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = year_interval.end_date, interval_unit = 'Month').values('next_action','apply_date','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np','is_cost_seggregated')
		for comp in component2:
			apply_date = comp.get('apply_date')
			if apply_date.year == this_year.year:
				interval = month_maintanance_interval(apply_date)
			else:
				interval=12
			data = {}
			next_action = comp.get('apply_date')
			next_action_np = str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
			maintenance_interval = comp.get('maintenance_interval')
			total_logs = int(interval/maintenance_interval)
			data['next_action'] = str(next_action)
			data['next_action_np']=next_action_np#comp.get('next_action_np')
			data['maintenance_cost'] = comp.get('maintenance_cost')
			data['labour_cost'] = comp.get('labour_cost')
			data['replacement_cost'] =comp.get('replacement_cost')
			data['material_cost'] = comp.get('material_cost')
			data['component_numbers'] = comp.get('component_numbers')
			data['maintenance_interval'] = maintenance_interval
			data['is_cost_seggregated'] = comp.get('is_cost_seggregated')
			data['total_logs'] = total_logs
			expected_data_list.append(data)
			total_logs = total_logs-1
			if total_logs >=1:
				next_add_action = next_action
				for logs in range(total_logs):
					data = {}
					if scheme.system_date_format == 'nep':
						date_np = add_month_to_date(str_to_datetime(next_add_action),maintenance_interval, 'nep')
						next_add_action=date_np.to_datetime_date()
						data['next_action_np'] = str(date_np)
						data['next_action'] = date_np.to_datetime_date()
					else:
						next_action = add_month_to_date(str_to_datetime(next_add_action), maintenance_interval, 'en')
						next_add_action=next_action
						data['next_action'] = str(next_action)
						data['next_action_np']= str(nepali_datetime.date.from_datetime_date(str_to_datetime(next_action)))
					# expected_data_list.append(data)
								
					data['maintenance_cost'] = comp.get('maintenance_cost')
					data['labour_cost'] = comp.get('labour_cost')
					data['replacement_cost'] =comp.get('replacement_cost')
					data['material_cost'] = comp.get('material_cost')
					data['component_numbers'] = comp.get('component_numbers')
					data['maintenance_interval'] = maintenance_interval
					data['is_cost_seggregated'] = comp.get('is_cost_seggregated')
					expected_data_list.append(data)
		
		data2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = scheme) \
<<<<<<< HEAD
	    			& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.start_date) & Q(interval_unit = 'Year')).values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','component_numbers','is_cost_seggregated')

=======
	    			& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.end_date) & Q(interval_unit = 'Year')).values('next_action','apply_date','maintenance_cost','labour_cost','replacement_cost','material_cost','component_numbers','is_cost_seggregated')
		
		if data2:
			for comp2 in data2:
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
				data['is_cost_seggregated'] = comp2.get('is_cost_seggregated')
				expected_data_list.append(data)
				
>>>>>>> ams-final
		if scheme.system_date_format == 'nep':
			for data in expected_data_list:
				next_action = get_equivalent_date(data.get('next_action'), year_interval)
				data['next_action'] = next_action
			total1 = 0
			for data in expected_data_list:
				if data.get('next_action') >= start_month and data.get('next_action') <= end_month:
<<<<<<< HEAD
					if not data.get('is_cost_seggregated'):
						if data.get('maintenance_cost'):
							total1 += data.get('maintenance_cost') * data.get('component_numbers')
					else:
						if data.get('labour_cost'):
							total1 += data.get('labour_cost') * data.get('component_numbers')
				
						if data.get('replacement_cost'):
							total1 += data.get('replacement_cost') * data.get('component_numbers')
				
						if data.get('material_cost'):
							total1 += data.get('material_cost') * data.get('component_numbers')
			
			for data in data2:
				next_action = get_equivalent_date(data.get('next_action'), year_interval)
				data['next_action'] = next_action
			
			total2 = 0
			for data in data2:
				if data.get('next_action') >= start_month and data.get('next_action') <= end_month:
					if not data.get('is_cost_seggregated'):
						if data.get('maintenance_cost'):
							total2 += data.get('maintenance_cost') * data.get('component_numbers')
					else:
						if data.get('labour_cost'):
							total2 += data.get('labour_cost') * data.get('component_numbers')
				
						if data.get('replacement_cost'):
							total2 += data.get('replacement_cost') * data.get('component_numbers')
				
						if data.get('material_cost'):
							total2 += data.get('material_cost') * data.get('component_numbers')
			
			total = total1 + total2
			return total
=======

					if not data.get('is_cost_seggregated'):
						if data.get('maintenance_cost'):
							total1 += data.get('maintenance_cost') * data.get('component_numbers')#*data.get('total_logs')
					else:
						if data.get('labour_cost'):
							total1 += data.get('labour_cost') * data.get('component_numbers')#*data.get('total_logs')
				
						if data.get('replacement_cost'):
							total1 += data.get('replacement_cost') * data.get('component_numbers')#*data.get('total_logs')
				
						if data.get('material_cost'):
							total1 += data.get('material_cost') * data.get('component_numbers')#*data.get('total_logs')
			
			# for data in data2:
			# 	next_action = get_equivalent_date(data.get('next_action'), year_interval)
			# 	data['next_action'] = next_action
			
			# total2 = 0
			# for data in data2:
			# 	if data.get('next_action') >= start_month and data.get('next_action') <= end_month:
			# 		if not data.get('is_cost_seggregated'):
			# 			if data.get('maintenance_cost'):
			# 				total2 += data.get('maintenance_cost') * data.get('component_numbers')
			# 		else:
			# 			if data.get('labour_cost'):
			# 				total2 += data.get('labour_cost') * data.get('component_numbers')
				
			# 			if data.get('replacement_cost'):
			# 				total2 += data.get('replacement_cost') * data.get('component_numbers')
				
			# 			if data.get('material_cost'):
			# 				total2 += data.get('material_cost') * data.get('component_numbers')
			
			#total = total1 #+ total2
			return total1
>>>>>>> ams-final
		else:
			total1 = 0
			for data in expected_data_list:
				if str_to_datetime(data.get('next_action')).month == start_month.get('month'):
					if not data.get('is_cost_seggregated'):
						if data.get('maintenance_cost'):
<<<<<<< HEAD
							total1 += data.get('maintenance_cost') * data.get('component_numbers')
					else:
						if data.get('labour_cost'):
							total1 += data.get('labour_cost') * data.get('component_numbers')
				
						if data.get('replacement_cost'):
							total1 += data.get('replacement_cost') * data.get('component_numbers')
				
						if data.get('material_cost'):
							total1 += data.get('material_cost') * data.get('component_numbers')
			total2 = 0
			for data in data2:
				if str_to_datetime(data.get('next_action')).month == start_month.get('month'):
					if not data.get('is_cost_seggregated'):
						if data.get('maintenance_cost'):
							total2 += data.get('maintenance_cost') * data.get('component_numbers')
					else:
						if data.get('labour_cost'):
							total2 += data.get('labour_cost') * data.get('component_numbers')
				
						if data.get('replacement_cost'):
							total2 += data.get('replacement_cost') * data.get('component_numbers')
				
						if data.get('material_cost'):
							total2 += data.get('material_cost') * data.get('component_numbers')
			return total1 + total2

=======
							total1 += data.get('maintenance_cost') * data.get('component_numbers')#*data.get('total_logs')
					else:
						if data.get('labour_cost'):
							total1 += data.get('labour_cost') * data.get('component_numbers')#*data.get('total_logs')
				
						if data.get('replacement_cost'):
							total1 += data.get('replacement_cost') * data.get('component_numbers')#*data.get('total_logs')
				
						if data.get('material_cost'):
							total1 += data.get('material_cost') * data.get('component_numbers')#*data.get('total_logs')
			# total2 = 0
			# for data in data2:
			# 	if str_to_datetime(data.get('next_action')).month == start_month.get('month'):
			# 		if not data.get('is_cost_seggregated'):
			# 			if data.get('maintenance_cost'):
			# 				total2 += data.get('maintenance_cost') * data.get('component_numbers')
			# 		else:
			# 			if data.get('labour_cost'):
			# 				total2 += data.get('labour_cost') * data.get('component_numbers')
				
			# 			if data.get('replacement_cost'):
			# 				total2 += data.get('replacement_cost') * data.get('component_numbers')
				
			# 			if data.get('material_cost'):
			# 				total2 += data.get('material_cost') * data.get('component_numbers')
			return total1 #+ total2
>>>>>>> ams-final

	@classmethod
	def get_estimated_cost(cls, year, scheme):
		from maintenance.api.views import get_factors_of, get_factor_of_year
		from django.db.models import Q
		if scheme.system_date_format == 'en':
			year_interval = get_object_or_404(YearsInterval, id=year.id,scheme=scheme)

		if scheme.system_date_format == 'nep':
			year_interval = get_object_or_404(YearsInterval, id=year.id, scheme=scheme)

		factors = get_factors_of(year_interval.year_num)
<<<<<<< HEAD


		data1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = year_interval.start_date, interval_unit = 'Day')
		data3 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = year_interval.start_date, interval_unit = 'Month')
=======
		data1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = year_interval.end_date, interval_unit = 'Day')
		data3 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, apply_date__lte = year_interval.end_date, interval_unit = 'Month')
>>>>>>> ams-final

		# data2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = scheme) \
	 #    			& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.start_date) & Q(interval_unit = 'Year'))
		
		data2 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,maintenance_interval__in =factors, apply_date__lte  = year_interval.start_date,interval_unit='Year')
		
		total_estimated_cost =0
		for obj in data1:
<<<<<<< HEAD
			# if not obj.is_cost_seggregated:
			if obj.maintenance_cost is not None:
				total_estimated_cost += obj.maintenance_cost*int(365/obj.maintenance_interval) * obj.component_numbers
			# else:
			if obj.replacement_cost is not None:
				total_estimated_cost += obj.replacement_cost*int(365/obj.maintenance_interval) * obj.component_numbers
			if obj.material_cost is not None:
				total_estimated_cost += obj.material_cost*int(365/obj.maintenance_interval) * obj.component_numbers
			if obj.labour_cost is not None:
				total_estimated_cost += obj.labour_cost*int(365/obj.maintenance_interval) * obj.component_numbers

		for obj in data3:
			# if not obj.is_cost_seggregated:
			if obj.maintenance_cost is not None:
				total_estimated_cost += obj.maintenance_cost*int(12/obj.maintenance_interval) * obj.component_numbers
			# else:
			if obj.replacement_cost is not None:
				total_estimated_cost += obj.replacement_cost*int(12/obj.maintenance_interval) * obj.component_numbers
			if obj.material_cost is not None:
				total_estimated_cost += obj.material_cost*int(12/obj.maintenance_interval) * obj.component_numbers
			if obj.labour_cost is not None:
				total_estimated_cost += obj.labour_cost*int(12/obj.maintenance_interval) * obj.component_numbers

		for obj in data2:
			# if obj.is_cost_seggregated:
			if obj.maintenance_cost is not None:
				total_estimated_cost += obj.maintenance_cost*obj.component_numbers
			# else:
			if obj.replacement_cost is not None:
				total_estimated_cost += obj.replacement_cost*obj.component_numbers
			if obj.material_cost is not None:
				total_estimated_cost += obj.material_cost*obj.component_numbers
			if obj.labour_cost is not None:
				total_estimated_cost += obj.labour_cost*obj.component_numbers
		return total_estimated_cost
=======
			apply_date = obj.apply_date
			if apply_date.year == year_interval.start_date.year:
				interval = days_maintanace_interval(apply_date)
			else:
				interval = 365
			# if not obj.is_cost_seggregated:
			if obj.maintenance_cost is not None:
				total_estimated_cost += obj.maintenance_cost*int(interval/obj.maintenance_interval) * obj.component_numbers
			# else:
			if obj.replacement_cost is not None:
				total_estimated_cost += obj.replacement_cost*int(interval/obj.maintenance_interval) * obj.component_numbers
			if obj.material_cost is not None:
				total_estimated_cost += obj.material_cost*int(interval/obj.maintenance_interval) * obj.component_numbers
			if obj.labour_cost is not None:
				total_estimated_cost += obj.labour_cost*int(interval/obj.maintenance_interval) * obj.component_numbers

		for obj in data3:
			# if not obj.is_cost_seggregated:
			apply_date = obj.apply_date
			if apply_date.year == year_interval.start_date.year:
				interval = month_maintanance_interval(apply_date)
			else:
				interval=12
			if obj.maintenance_cost is not None:
				total_estimated_cost += obj.maintenance_cost*int(interval/obj.maintenance_interval) * obj.component_numbers
			# else:
			if obj.replacement_cost is not None:
				total_estimated_cost += obj.replacement_cost*int(interval/obj.maintenance_interval) * obj.component_numbers
			if obj.material_cost is not None:
				total_estimated_cost += obj.material_cost*int(interval/obj.maintenance_interval) * obj.component_numbers
			if obj.labour_cost is not None:
				total_estimated_cost += obj.labour_cost*int(interval/obj.maintenance_interval) * obj.component_numbers

		
		componant4 = ComponentInfo.objects.filter(component__category__water_scheme = scheme,apply_date__lte = year_interval.end_date, interval_unit='Year')
		
		expected_data = []
		if componant4:
			for z in componant4:
				apply_date_ = z.apply_date
				m_interval = z.maintenance_interval
				itteration = int((scheme.period-year_interval.year_num)/m_interval)
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
					datas['year_num']= year_interval.year_num+year_num
					if year_interval.start_date.year == apply_date_.year:
						expected_data.append(datas)	
					m_interval_year+=m_interval
					year_num+=m_interval
		return total_estimated_cost, expected_data
>>>>>>> ams-final

def assetComponentLogFolder(instance, filename):
	return os.path.join("asset-component-log", instance.component1.category.water_scheme.slug, filename)

class ComponentInfoImage(m.Model):
	component = m.ForeignKey(ComponentInfo,null=True, blank=True, on_delete = m.PROTECT, related_name='asset_component_image')
	component_image = models.ImageField(upload_to = assetComponentLogFolder, null=True, blank=True)

class ComponentInfoLog(m.Model):
	class LogsType(m.TextChoices):
		MAINTENANCE_LOG = 'Maintenance','Maintenance'
		ISSUE_LOG = 'Issue','Issue'
<<<<<<< HEAD
	component = m.ForeignKey(ComponentInfo, on_delete = m.PROTECT, related_name='asset_component_log')
=======
	class Interval_Choices(m.TextChoices):
		DAY = 'Day','Day'
		MONTH = 'Month','Month'
		YEAR = 'Year','Year'
	component = m.ForeignKey(ComponentInfo, on_delete = m.PROTECT, related_name='asset_component_log', null=True, blank=True)
	component1 = m.ForeignKey(Components, on_delete=m.PROTECT, related_name='asset_component1', null=True, blank=True)
>>>>>>> ams-final
	maintenance_date = m.DateField()
	maintenance_date_np = m.CharField(max_length=13)
	possible_failure = m.CharField(max_length=200)
	maintenance_action = m.CharField(max_length=250)
	duration = m.IntegerField()#help_text='Duration in days'
	interval_unit = m.CharField(max_length=30, default=Interval_Choices.YEAR, choices=Interval_Choices.choices)
	cost_total = m.FloatField()
	labour_cost = m.FloatField(null=True, blank=True)
	material_cost = m.FloatField(null=True, blank=True)
	replacement_cost = m.FloatField(null=True, blank=True)
	componant_picture = m.ImageField(upload_to = assetComponentLogFolder, null=True, blank=True)
<<<<<<< HEAD
	remarks = m.CharField(max_length=200, null=True, blank=True)
	log_type = m.CharField(max_length=25, choices=LogsType.choices)
	is_cost_seggregated = m.BooleanField(default=False)

=======
	# component_image = m.ForeignKey(ComponentInfoImage, null=True, blank=True, on_delete=m.PROTECT)
	remarks = m.CharField(max_length=200, null=True, blank=True)
	log_type = m.CharField(max_length=25, choices=LogsType.choices)
	is_cost_seggregated = m.BooleanField(default=False)
	log_status = m.BooleanField(default=False)
>>>>>>> ams-final

	def __str__(self):
		if self.component1:
			value = self.component1.category.water_scheme.scheme_name
		elif self.component:
			value = self.component.component.category.water_scheme.scheme_name
		else:
			value=None
		return f"{value}-{str(self.maintenance_date)}"


	@property
	def component_name(self):
		if self.component1:
			return self.component1.name
		elif self.component:
			return self.component.component.name

	@property
	def total(self):
		if self.is_cost_seggregated:
			total = 0
			if self.material_cost:
				total += self.material_cost
			if self.replacement_cost:
				total += self.replacement_cost
			if self.labour_cost:
				total += self.labour_cost
			return total
		else:
			return self.cost_total


def assetComponentLogImageFolder(instance, filename):
	return os.path.join("asset-component-log", instance.component.component1.category.water_scheme.slug, filename)

class ComponentInfoLogImage(m.Model):
	component = m.ForeignKey(ComponentInfoLog,null=True, blank=True, on_delete = m.PROTECT, related_name='asset_component_log_image')
	component_image = models.ImageField(upload_to = assetComponentLogImageFolder, null=True, blank=True)