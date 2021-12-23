from django.db import models as m
from config_pannel.models import *
from django.utils.translation import gettext_lazy as _
from users.models import Users
import os
from django.shortcuts import get_object_or_404



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
		NORMAL = 'Normal', 'Normal'

	class Impact(m.TextChoices):
		TotalLossOfFunction = 'Total Loss Of Function','Total Loss Of Function'
		ReductionofSystemFunctionality = 'Reduction of System Functionality','Reduction of System Functionality'
		ReductionofPArtsFunctionality = 'Reduction of Parts Functionality','Reduction of Parts Functionality'
		HardlyEffect = 'Hardly any Effect', 'Hardly any Effect'

	class Mitigation(m.TextChoices):
		PREVENTIVE = 'Preventive','Preventive'
		INSPECTION = 'Inspection','Inspection'
		REACTIVE = 'Reactive','Reactive'

	class Person(m.TextChoices):
		CARETAKER = 'Caretaker','Caretaker'
		TECHNICIAN = 'Technician','Technician'
		OTHER = 'Others','Others'

	component = m.ForeignKey(Components, on_delete = m.PROTECT, related_name='component_info')
	possible_failure = m.CharField(max_length=250, null=True, blank=True)
	description = m.CharField(max_length=250, null=True, blank=True)
	component_numbers = m.IntegerField(default=1)
	maintenance_cost = m.FloatField()
	labour_cost = m.FloatField(null=True, blank=True)
	material_cost = m.FloatField(null=True, blank=True)
	replacement_cost = m.FloatField(null=True, blank=True)
	maintenance_action = m.CharField(max_length=250)
	supply_belt = m.ForeignKey(SupplyBelts, on_delete = m.SET_NULL, related_name='asset_component_belts', null=True, blank=True)
	maintenance_interval = m.FloatField()
	impact_of_failure = m.CharField(max_length=100, choices = Impact.choices)
	possibility_of_failure = m.CharField(max_length=50, choices=Failure.choices)
	resulting_risk_score = m.FloatField()
	mitigation = m.CharField(max_length=50, choices=Mitigation.choices)
	responsible = m.CharField(max_length=50,choices=Person.choices)
	next_action = m.DateField(blank=True, null=True)
	next_action_np = m.CharField(max_length=13, blank=True, null=True)
	componant_picture = m.ImageField(upload_to = generate_path, null=True, blank=True)
	apply_date = m.DateField()
	created_at = m.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.component.name}-{self.component.category.water_scheme.scheme_name}'

	@property
	def estimated_cost(self):
		return 0
	# next_action__gte = start_month, next_action__lte = end_month
	
	@classmethod
	def get_maintenance_cost(cls,scheme,start_month, end_month,year_interval):
		count = 0
		import datetime
		from maintenance.api.utils import str_to_datetime, add_nep_month,add_months
		from maintenance.api.views import get_factors_of
		from django.db.models import Q
		from finance.api.utils import get_equivalent_date
		factors = get_factors_of(year_interval.year_num)

		expected_data_list = []
		component1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lte = 1, apply_date__lte  = year_interval.end_date).values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','maintenance_interval','component_numbers','next_action_np')
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
		
		data2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = scheme) \
	    			& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.start_date) & Q(maintenance_interval__gte = 1)).values('next_action','maintenance_cost','labour_cost','replacement_cost','material_cost','component_numbers')

		if scheme.system_date_format == 'nep':
			for data in expected_data_list:
				next_action = get_equivalent_date(data.get('next_action'), year_interval)
				data['next_action'] = next_action
			total1 = 0
			for data in expected_data_list:
				if data.get('next_action') >= start_month and data.get('next_action') <= end_month:
					if data.get('maintenance_cost'):
						total1 += data.get('maintenance_cost') * data.get('component_numbers')
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
					if data.get('maintenance_cost'):
						total2 += data.get('maintenance_cost') * data.get('component_numbers')
					if data.get('labour_cost'):
						total2 += data.get('labour_cost') * data.get('component_numbers')
			
					if data.get('replacement_cost'):
						total2 += data.get('replacement_cost') * data.get('component_numbers')
			
					if data.get('material_cost'):
						total2 += data.get('material_cost') * data.get('component_numbers')
			
			total = total1 + total2
			return total
		else:
			total1 = 0
			for data in expected_data_list:
				if str_to_datetime(data.get('next_action')).month == start_month.get('month'):
					if data.get('maintenance_cost'):
						total1 += data.get('maintenance_cost') * data.get('component_numbers')
					if data.get('labour_cost'):
						total1 += data.get('labour_cost') * data.get('component_numbers')
			
					if data.get('replacement_cost'):
						total1 += data.get('replacement_cost') * data.get('component_numbers')
			
					if data.get('material_cost'):
						total1 += data.get('material_cost') * data.get('component_numbers')
			total2 = 0
			for data in data2:
				if str_to_datetime(data.get('next_action')).month == start_month.get('month'):
					if data.get('maintenance_cost'):
						total2 += data.get('maintenance_cost') * data.get('component_numbers')
					if data.get('labour_cost'):
						total2 += data.get('labour_cost') * data.get('component_numbers')
			
					if data.get('replacement_cost'):
						total2 += data.get('replacement_cost') * data.get('component_numbers')
			
					if data.get('material_cost'):
						total2 += data.get('material_cost') * data.get('component_numbers')
			return total1 + total2


	@classmethod
	def get_estimated_cost(cls, year, scheme):
		from maintenance.api.views import get_factors_of
		from django.db.models import Q
		if scheme.system_date_format == 'en':
			year_interval = get_object_or_404(YearsInterval, id=year.id,scheme=scheme)

		if scheme.system_date_format == 'nep':
			year_interval = get_object_or_404(YearsInterval, id=year.id, scheme=scheme)

		factors = get_factors_of(year_interval.year_num)


		data1 = ComponentInfo.objects.filter(component__category__water_scheme = scheme, maintenance_interval__lt = 1, apply_date__lte = year_interval.start_date)

		data2 = ComponentInfo.objects.filter(Q(component__category__water_scheme = scheme) \
	    			& Q(maintenance_interval__in = factors) & Q(apply_date__lte = year_interval.start_date) & Q(maintenance_interval__gte = 1))

		total_estimated_cost =0
		for obj in data1:
			if obj.maintenance_interval <= 1:
				if obj.maintenance_cost:
					total_estimated_cost += obj.maintenance_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers
				if obj.replacement_cost:
					total_estimated_cost += obj.replacement_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers
				if obj.material_cost:
					total_estimated_cost += obj.material_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers
				if obj.labour_cost:
					total_estimated_cost += obj.labour_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers

		for obj in data2:
			if obj.maintenance_cost:
				total_estimated_cost += obj.maintenance_cost*obj.component_numbers
			if obj.replacement_cost:
				total_estimated_cost += obj.replacement_cost*obj.component_numbers
			if obj.material_cost:
				total_estimated_cost += obj.material_cost*obj.component_numbers
			if obj.labour_cost:
				total_estimated_cost += obj.labour_cost*obj.component_numbers
		return total_estimated_cost

def assetComponentLogFolder(instance, filename):
	return os.path.join("asset-component-log", instance.component.component.category.water_scheme.slug, filename)

class ComponentInfoLog(m.Model):
	component = m.ForeignKey(ComponentInfo, on_delete = m.PROTECT, related_name='asset_component_log')
	maintenance_date = m.DateField()
	maintenance_date_np = m.CharField(max_length=13)
	possible_failure = m.CharField(max_length=200)
	maintenance_action = m.CharField(max_length=250)
	duration = m.IntegerField(help_text='Duration in days')
	cost_total = m.FloatField()
	labour_cost = m.FloatField(null=True, blank=True)
	material_cost = m.FloatField(null=True, blank=True)
	replacement_cost = m.FloatField(null=True, blank=True)
	componant_picture = m.ImageField(upload_to = assetComponentLogFolder, null=True, blank=True)
	supply_belt = m.ForeignKey(SupplyBelts, on_delete=m.SET_NULL, null=True, blank=True, related_name='asset_comp_log')
	remarks = m.CharField(max_length=200, null=True, blank=True)

	def __str__(self):
		return f"{self.component.component.category.water_scheme.scheme_name}-{str(self.maintenance_date)}"


	@property
	def component_name(self):
		return self.component.component.name