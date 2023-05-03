from rest_framework import serializers
from ..models import *
import nepali_datetime
from asset_management_system.utils import english_to_nepali_converter
from django.shortcuts import get_object_or_404
import datetime
from .utils import add_months, add_year,str_to_datetime,add_nep_year

class ComponentCategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = AssetComponentCategory
		fields = ['id','name']

	def validate(self, attrs):
		scheme=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if not self.instance:
			if AssetComponentCategory.objects.filter(name = attrs.get('name'), water_scheme=scheme).exists():
				raise serializers.ValidationError('Category with this name already exists.')
		else:
			if AssetComponentCategory.objects.filter(name = attrs.get('name'), water_scheme=scheme).exclude(pk=self.instance.pk).exists():
				raise serializers.ValidationError('Category with this name already exists.')
		attrs['water_scheme']=get_object_or_404(Users, id=self.context['request'].user.id).water_scheme
		return attrs

	def create(self, validate_data):
		return AssetComponentCategory.objects.create(**validate_data)



class ComponentsSerializer(serializers.ModelSerializer):
	category = ComponentCategorySerializer(read_only=True)
	class Meta:
		model = Components
		fields = ['id','name', 'category']

class ComponentCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Components
		fields = ['name', 'category']

	def validate(self, attrs):
		scheme=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if not self.instance:
			if Components.objects.filter(name = attrs.get('name'), category__water_scheme=scheme).exists():
				raise serializers.ValidationError('Component with this name already exists.')
		else:
			if Components.objects.filter(name = attrs.get('name'), category__water_scheme=scheme).exclude(pk=self.instance.pk).exists():
				raise serializers.ValidationError('Component with this name already exists.')
		return attrs


class ComponentInfoListSerializer(serializers.ModelSerializer):
	component = ComponentsSerializer(read_only=True, many=False)
	log_entry = serializers.SerializerMethodField('get_log_entry')

	class Meta:
		model = ComponentInfo
		fields = ['component',
		'id',
		'possible_failure',
		'description',
		'component_numbers',
		'maintenance_cost',
		'maintenance_action',
		'next_action',
		'mitigation',
		'componant_picture',
		'resulting_risk_score',
		'maintenance_interval',
		'interval_unit',
		'log_entry',
		'responsible',
		'impact_of_failure',
		'possibility_of_failure',
		'apply_date',
		'labour_cost',
		'material_cost',
		'replacement_cost',
		'seggregated_or_unseggregated_cost']

	def get_log_entry(self, obj):
		year = self.context.get('request').query_params.get('year')
		if year:
			year_interval=YearsInterval.objects.get(id=year)
			return obj.asset_component_log.filter(maintenance_date__gte=year_interval.start_date, maintenance_date__lte=year_interval.end_date).count()
		else:
			return obj.asset_component_log.all().count()

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(ComponentInfoListSerializer, self).to_representation(data)

		if self.context['request'].user.is_authenticated:
			scheme = get_object_or_404(Users, id=self.context['request'].user.id).water_scheme
		else:
			scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))
		if scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['apply_date'])))
			if data.get('next_action'):
				data['next_action'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['next_action'])))

		if lang == 'nep':
			data['maintenance_cost'] = english_to_nepali_converter(str(data.get('maintenance_cost')))
			data['next_action'] = english_to_nepali_converter(str(data.get('next_action')))
			data['apply_date'] = english_to_nepali_converter(str(data.get('apply_date')))
			data['resulting_risk_score']=english_to_nepali_converter(data.get('resulting_risk_score'))
			data['maintenance_interval'] = english_to_nepali_converter(data.get('maintenance_interval'))
			data['log_entry'] = english_to_nepali_converter(data.get('log_entry'))
		return data

data = {
	'High':4,
	'Medium':3,
	'Low':2,
	'Minimal': 1,
	'Total Loss Of Function':4,
	'Reduction of System Functionality':3,
	'Reduction of Parts Functionality':2,
	'Hardly any Effect':1
}

def get_resulting_risk_score(impact, possibility):
	result = data[impact]*data[possibility]
	return result

class ComponentInfoCreateSerializer(serializers.ModelSerializer):
	log_entry = serializers.SerializerMethodField('get_log_entry', read_only=True)
	possible_total_logs = serializers.SerializerMethodField('get_possible_total_logs', read_only=True)
	existing_logs = serializers.SerializerMethodField('get_existing_log_ids', read_only=True)
	estimated_cost = serializers.SerializerMethodField('get_estimated_cost', read_only=True)
	resulting_risk_score = serializers.ReadOnlyField()
	main_component = serializers.SerializerMethodField('main_component_name', read_only=True)
	next_action = serializers.CharField(required=False)
	apply_date = serializers.CharField()

	user=None

	class Meta:
		model = ComponentInfo
		fields = ['component',
		'id',
		'possible_failure',
		'component_numbers',
		'description',
		'maintenance_cost',
		'labour_cost',
		'material_cost',
		'replacement_cost',
		'maintenance_action',
		'maintenance_interval',
		'interval_unit',
		'impact_of_failure',
		'possibility_of_failure',
		'resulting_risk_score',
		'mitigation',
		'responsible',
		'next_action',
		'componant_picture',
		'log_entry',
		'possible_total_logs',
		'existing_logs',
		'estimated_cost',
		'apply_date',
		'main_component',
		'is_cost_seggregated',
		]
	
	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language should be either en or nep')
<<<<<<< HEAD
=======

		maintenance_cost = str(attrs['maintenance_cost'])
		labour_cost = str(attrs['labour_cost'])
		material_cost = str(attrs['material_cost'])
		replacement_cost = str(attrs['replacement_cost'])
		maintenance_interval = str(attrs['maintenance_interval'])
		if int(maintenance_interval.split('.')[-1])>1:
			raise serializers.ValidationError("Maintanance Interval should be a number not a decimal number.")

		if len(maintenance_cost.split('.')[-1])>2 or len(labour_cost.split('.')[-1])>2 or len(material_cost.split('.')[-1])>2 or len(replacement_cost.split('.')[-1])>2:
			raise serializers.ValidationError("Only Accept 2 digits after decimal point")

		if attrs['maintenance_cost']<0 or attrs['labour_cost']<0 or attrs['material_cost']<0 or attrs['replacement_cost']<0 or attrs['maintenance_interval']<0 or attrs['component_numbers']<0:
			raise serializers.ValidationError("Negative value can't be entered.")

>>>>>>> ams-final
		self.user = get_object_or_404(Users, id=self.context['request'].user.id)
		
		if attrs['is_cost_seggregated'] or attrs['is_cost_seggregated'] == True or attrs['is_cost_seggregated'] == 'true':
			attrs['maintenance_cost'] = 0
		else:
			attrs['labour_cost'] = 0
			attrs['material_cost'] = 0
			attrs['replacement_cost'] =0

<<<<<<< HEAD
=======
		# attrs['next_action'] = ""
		
>>>>>>> ams-final
		maintenance_interval = attrs.get('maintenance_interval')
		
		apply_date = attrs.get('apply_date')
		next_action = attrs.get('next_action')
		if not next_action:
			next_action = apply_date

		if self.user.water_scheme.system_date_format == 'nep':
			date_list = str(next_action).split('-')
			date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
			date_en = date_nep.to_datetime_date()
			attrs['next_action_np']=next_action
			attrs['next_action']=date_en

			apply_date = str(apply_date).split('-')
			apply_date =  nepali_datetime.date(int(apply_date[0]), int(apply_date[1]), int(apply_date[2]))
			date_en = apply_date.to_datetime_date()
			attrs['apply_date']=date_en
		else:
			attrs['next_action']= str_to_datetime(next_action)
			attrs['apply_date']=str_to_datetime(apply_date)
			attrs['next_action_np'] = nepali_datetime.date.from_datetime_date(str_to_datetime(next_action))

		if maintenance_interval <= 1:
			number_of_maintenance = float(1)/maintenance_interval
			next_action_period = float(12)/number_of_maintenance
			future_date = add_months(str_to_datetime(attrs.get('apply_date')), int(round(next_action_period,0)))
		
			if future_date < attrs.get('next_action'):
				if self.user.water_scheme.system_date_format == 'nep':
					future_date = nepali_datetime.date.from_datetime_date(future_date)
				raise serializers.ValidationError('Your next action must be earlier than '+ str(future_date) )
			
			if attrs.get('next_action') < attrs.get('apply_date'):
				raise serializers.ValidationError('Your next action must be later then apply date.')
		else:
			if self.user.water_scheme.system_date_format == 'nep':
				try:
					apply_date = str_to_datetime(attrs.get('apply_date'))
					apply_date_np = nepali_datetime.date.from_datetime_date(apply_date)
					if attrs["interval_unit"] == "Day":
						maintenance_interval = maintenance_interval/30
					elif attrs["interval_unit"] == "Month":
						maintenance_interval = maintenance_interval/12
					future_date = add_nep_year(str(apply_date_np), int(maintenance_interval))
					data_list = str(attrs.get('next_action_np')).split('-')
					next_action_np = nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
					if future_date <= next_action_np:
						raise serializers.ValidationError('Your next action must be earlier than '+ str(future_date) )
				except Exception as e:
					raise serializers.ValidationError(f"Error Found As: {str(e)} ")

			else:
				future_date = add_year(str_to_datetime(attrs.get('apply_date')), int(maintenance_interval))
				if future_date <= attrs.get('next_action'):
					raise serializers.ValidationError('Your next action must be earlier than '+ str(future_date) )

			if attrs.get('next_action') < attrs.get('apply_date'):
				raise serializers.ValidationError('Your next action must be later then apply date.')
		attrs['resulting_risk_score'] = get_resulting_risk_score(attrs.get('impact_of_failure'),attrs.get('possibility_of_failure'))
		return attrs

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(ComponentInfoCreateSerializer, self).to_representation(data)
		user = get_object_or_404(Users, id=self.context['request'].user.id)
		if user.water_scheme.system_date_format =='nep':
			if data.get('next_action'):
				data['next_action'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('next_action'))))
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		if lang == 'nep':
			data['maintenance_cost'] = english_to_nepali_converter(str(data.get('maintenance_cost')))
			data['labour_cost'] = english_to_nepali_converter(str(data.get('labour_cost')))
			data['material_cost'] = english_to_nepali_converter(str(data.get('material_cost')))
			data['replacement_cost'] = english_to_nepali_converter(str(data.get('replacement_cost')))
			if data.get('next_action'):
				data['next_action'] = english_to_nepali_converter(data.get('next_action'))
			data['apply_date'] = english_to_nepali_converter(data.get('apply_date'))
			data['resulting_risk_score']=english_to_nepali_converter(data.get('resulting_risk_score'))
			data['maintenance_interval']=english_to_nepali_converter(data.get('maintenance_interval'))
			data['log_entry']=english_to_nepali_converter(data.get('log_entry'))
			data['possible_total_logs']=english_to_nepali_converter(data.get('possible_total_logs'))
			data['estimated_cost']=english_to_nepali_converter(data.get('estimated_cost'))
			data['component_numbers'] = english_to_nepali_converter(data.get('component_numbers'))
		return data

	def get_log_entry(self, obj):
		year = self.context.get('request').query_params.get('year')
		if not year:
			return obj.asset_component_log.all().count()
		else:
			year_interval=YearsInterval.objects.get(id=year)
			return obj.asset_component_log.filter(maintenance_date__gte=year_interval.start_date, maintenance_date__lte=year_interval.end_date).count()
	
	def main_component_name(self,obj):
		return obj.component.name

	def get_possible_total_logs(self, obj):
		from .views import get_factors_of
		scheme = obj.component.category.water_scheme
		year = self.context.get('request').query_params.get('year')
		# maintenance_interval = attrs.get('maintenance_interval')
		# print(maintenance_interval, " maintannance")
		# print(main)
		if scheme.system_date_format == 'en':
			if not year:
				year_interval = get_object_or_404(YearsInterval, start_date__year = datetime.date.today().year, scheme=scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year,scheme=scheme)

		if scheme.system_date_format == 'nep':
			if not year:
				today_date = nepali_datetime.date.today().to_datetime_date()
				year_interval = get_object_or_404(YearsInterval, start_date__year = today_date.year, scheme=scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year,scheme=scheme)

		factors = get_factors_of(year_interval.year_num)
		total_possible_logs =0
		if obj.interval_unit == 'Day':
			total_possible_logs += int((365/obj.maintenance_interval))
		elif obj.interval_unit == 'Month':
			total_possible_logs += int((12/obj.maintenance_interval))
		else:
			total_possible_logs += ComponentInfo.objects.filter(id=obj.id, maintenance_interval__in = factors, interval_unit = 'Year').count()
		return total_possible_logs
		# if obj.maintenance_interval <= 1:
		# 	total_possible_logs += int(round(1/obj.maintenance_interval,0))
		# total_possible_logs += ComponentInfo.objects.filter(id=obj.id, maintenance_interval__in = factors, maintenance_interval__gt=1).count()
		# return total_possible_logs


	def get_estimated_cost(self, obj):
		from .views import get_factors_of
		scheme = obj.component.category.water_scheme
		year = self.context.get('request').query_params.get('year')
		if scheme.system_date_format == 'en':
			if not year:
				year_interval = get_object_or_404(YearsInterval, start_date__year = datetime.date.today().year,scheme=scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year,scheme=scheme)

		if scheme.system_date_format == 'nep':
			if not year:
				today_date = nepali_datetime.date.today().to_datetime_date()
				year_interval = get_object_or_404(YearsInterval, start_date__year = today_date.year, scheme=scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year, scheme=scheme)

		factors = get_factors_of(year_interval.year_num)

		total_estimated_cost =0
		if obj.maintenance_interval <= 1:
			if not obj.is_cost_seggregated:
				total_estimated_cost += obj.maintenance_cost* int(round(1/obj.maintenance_interval,0)) * obj.component_numbers
			else:
				if obj.replacement_cost:
					total_estimated_cost += obj.replacement_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers
				if obj.material_cost:
					total_estimated_cost += obj.material_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers
				if obj.labour_cost:
					total_estimated_cost += obj.labour_cost*int(round(1/obj.maintenance_interval,0)) * obj.component_numbers

		data = ComponentInfo.objects.filter(id=obj.id, maintenance_interval__in = factors, maintenance_interval__gt=1)
		if data:
			if not data[0].is_cost_seggregated:
				if data[0].maintenance_cost:
					total_estimated_cost += obj.maintenance_cost * obj.component_numbers
			else:
				if data[0].replacement_cost:
					total_estimated_cost += obj.replacement_cost * obj.component_numbers
				if data[0].material_cost:
					total_estimated_cost += obj.material_cost * obj.component_numbers
				if data[0].labour_cost:
					total_estimated_cost += obj.labour_cost * obj.component_numbers
		return total_estimated_cost

	def get_existing_log_ids(self, obj):
		scheme = obj.component.category.water_scheme
		year = self.context.get('request').query_params.get('year')
		if scheme.system_date_format == 'en':
			if not year:
				year_interval = get_object_or_404(YearsInterval, start_date__year = datetime.date.today().year,scheme=scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year,scheme=scheme)

		if scheme.system_date_format == 'nep':
			if not year:
				today_date = nepali_datetime.date.today().to_datetime_date()
				year_interval = get_object_or_404(YearsInterval, start_date__year = today_date.year, scheme=scheme)
			else:
				year_interval = get_object_or_404(YearsInterval, id=year, scheme=scheme)
		return obj.asset_component_log.filter(maintenance_date__gte = year_interval.start_date, maintenance_date__lte=year_interval.end_date).values('id')


class ComponentLogCreateSerializer(serializers.ModelSerializer):
	maintenance_date= serializers.CharField()
	class Meta:
		model = ComponentInfoLog
		fields = ['id',
		'component',
		'component1',
		'maintenance_date',
		'possible_failure',
		'maintenance_action',
		'log_type',
		'duration',
		'interval_unit',
		'cost_total',
		'labour_cost',
		'material_cost',
		'replacement_cost',
		'componant_picture',
		'remarks',
<<<<<<< HEAD
		'is_cost_seggregated'
=======
		'is_cost_seggregated',
		'log_status'
>>>>>>> ams-final
		]

	def validate(self, attrs):
		from .views import get_factors_of
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		user = get_object_or_404(Users, id=self.context['request'].user.id)
		component_info = get_object_or_404(ComponentInfo, id = attrs.get('component').id)
<<<<<<< HEAD
		
=======
>>>>>>> ams-final
		if attrs['is_cost_seggregated'] or attrs['is_cost_seggregated'] == True or attrs['is_cost_seggregated'] == 'true':
			attrs['maintenance_cost'] = 0
		else:
			attrs['labour_cost'] = 0
			attrs['material_cost'] = 0
			attrs['replacement_cost'] =0
<<<<<<< HEAD

=======
		if not attrs['component']:
			attrs['component'] = None
		
>>>>>>> ams-final
		scheme = component_info.component.category.water_scheme
		if user.water_scheme.system_date_format == 'nep':
			date_list = str(attrs.get('maintenance_date')).split('-')
			date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
			date_en = date_nep.to_datetime_date()
			attrs['maintenance_date_np']=attrs.get('maintenance_date')
			attrs['maintenance_date']=date_en
		else:
			attrs['maintenance_date'] = str_to_datetime(attrs.get('maintenance_date'))
			attrs['maintenance_date_np'] = nepali_datetime.date.from_datetime_date(attrs.get('maintenance_date'))

		types = self.context.get('request').query_params.get('type')
		if not types=='not-schedule':
			year = get_object_or_404(YearsInterval, start_date__lte = attrs.get('maintenance_date'), end_date__gte = attrs.get('maintenance_date'),scheme=scheme)
			diff = get_factors_of(year.year_num)
			obj = get_object_or_404(ComponentInfo, id = attrs.get('component').id)
			total_log = 0
			if obj.interval_unit == 'Day':
				total_log += int(365/obj.maintenance_interval)
			elif obj.interval_unit == 'Month':
				total_log += int(12/obj.maintenance_interval)
			else:
				total_log += ComponentInfo.objects.filter(id=obj.id, maintenance_interval__in = diff,interval_unit = 'Year').count()

			existing_log = ComponentInfoLog.objects.filter(component1=component_info, maintenance_date__gte = year.start_date, maintenance_date__lte = year.end_date).count()
			if not self.instance:
				if existing_log >= total_log:
					raise serializers.ValidationError('You cannot create more than '+ str(total_log) + ' logs for scheduled maintenance.')
		return attrs

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(ComponentLogCreateSerializer, self).to_representation(data)
		user = get_object_or_404(Users, id=self.context['request'].user.id)
		if user.water_scheme.system_date_format == 'nep':
			data['maintenance_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('maintenance_date'))))
		if lang == 'nep':
			data['duration'] = english_to_nepali_converter(str(data.get('duration')))
			data['maintenance_date'] = english_to_nepali_converter(data.get('maintenance_date'))
			data['cost_total']=english_to_nepali_converter(data.get('cost_total'))
			data['labour_cost']=english_to_nepali_converter(data.get('labour_cost'))
			data['material_cost']=english_to_nepali_converter(data.get('material_cost'))
			data['replacement_cost']=english_to_nepali_converter(data.get('replacement_cost'))
		return data

class ConfigComponentInfoLogListSerializer(serializers.ModelSerializer):
	maintenance_date= serializers.CharField()
	component_name = serializers.ReadOnlyField()
	component_info = serializers.IntegerField(write_only=True, required=False)
	class Meta:
		model = ComponentInfoLog
		fields = ['id',
		'component_info',
		'component1',
		'component_name',
		'maintenance_date',
		'possible_failure',
		'maintenance_action',
		'duration',
		'interval_unit',
		'cost_total',
		'labour_cost',
		'material_cost',
		'replacement_cost',
		'componant_picture',
		'remarks',
		'is_cost_seggregated',
		'log_type',
<<<<<<< HEAD
=======
		'total',
		'log_status',
>>>>>>> ams-final
		]

	def validate(self, attrs):
		from .views import get_factors_of
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		self.context.get('request').parser_context.get('kwargs')["partial"] = True
		cost_total = str(attrs['cost_total'])
		labour_cost = str(attrs['labour_cost'])
		material_cost = str(attrs['material_cost'])
		replacement_cost = str(attrs['replacement_cost'])
		maintenance_interval = str(attrs['duration'])
		# print(int(maintenance_interval.split('.')[-1]), "+++++++++++++++++++++")
		# if int(maintenance_interval.split('.')[-1])>1:

		# 	raise serializers.ValidationError("Maintanance Interval should be a number not a decimal number.")
		try:
			if attrs['component_info']:
				attrs['component'] =get_object_or_404(ComponentInfo, id=attrs['component_info']) 
				attrs.pop('component_info')
		except Exception as e:
			print(e, "___")
		
		if len(cost_total.split('.')[-1])>2 or len(labour_cost.split('.')[-1])>2 or len(material_cost.split('.')[-1])>2 or len(replacement_cost.split('.')[-1])>2:
			raise serializers.ValidationError("Only Accept 2 digits after decimal point")

		if attrs['cost_total']<0 or attrs['labour_cost']<0 or attrs['material_cost']<0 or attrs['replacement_cost']<0 or attrs['duration']<0:
			raise serializers.ValidationError("Negative value can't be entered.")

		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		if attrs['is_cost_seggregated'] or attrs['is_cost_seggregated'] == True or attrs['is_cost_seggregated'] == 'true':
<<<<<<< HEAD
			attrs['maintenance_cost'] = 0
=======
			attrs['cost_total'] = 0
>>>>>>> ams-final
		else:
			attrs['labour_cost'] = 0
			attrs['material_cost'] = 0
			attrs['replacement_cost'] =0
<<<<<<< HEAD

		user = get_object_or_404(Users, id=self.context['request'].user.id)
		
=======
		user = get_object_or_404(Users, id=self.context['request'].user.id)
		

>>>>>>> ams-final
		if user.water_scheme.system_date_format == 'nep':
			date_list = str(attrs.get('maintenance_date')).split('-')
			date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
			date_en = date_nep.to_datetime_date()
			attrs['maintenance_date_np']=attrs.get('maintenance_date')
			attrs['maintenance_date']=date_en
		else:
			attrs['maintenance_date'] = str_to_datetime(attrs.get('maintenance_date'))
			attrs['maintenance_date_np'] = nepali_datetime.date.from_datetime_date(attrs.get('maintenance_date'))	
		return attrs


	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(ConfigComponentInfoLogListSerializer, self).to_representation(data)
		user = get_object_or_404(Users, id=self.context['request'].user.id)
		if user.water_scheme.system_date_format == 'nep':
			data['maintenance_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('maintenance_date'))))
		comp = data['id']
		img_list = ComponentInfoLogImage.objects.filter(component=comp).values('component_image')
		image_data=  []
		if img_list:
			if self.context['request'].is_secure():
				protocol = 'https://'
			else:
				protocol = 'http://'
			domain = str(self.context.get('request').META['HTTP_HOST'])#+'medial/'+i
			for i in img_list:
				full_path = protocol+domain+"/"+'media/'+str(i.get('component_image'))
				image_data.append(full_path)
				data['component_image'] = image_data
		else:
			data['component_image'] = image_data

		if lang == 'nep':
			data['duration'] = english_to_nepali_converter(str(data.get('duration')))
			data['maintenance_date'] = english_to_nepali_converter(data.get('maintenance_date'))
			data['cost_total']=english_to_nepali_converter(data.get('cost_total'))
			data['labour_cost']=english_to_nepali_converter(data.get('labour_cost'))
			data['material_cost']=english_to_nepali_converter(data.get('material_cost'))
			data['replacement_cost']=english_to_nepali_converter(data.get('replacement_cost'))
		return data
