from rest_framework import serializers
from config_pannel.models import *
from django.shortcuts import get_object_or_404
from users.models import Users
from asset_management_system.utils import english_to_nepali_converter
import nepali_datetime
import datetime
from .utils import *
from django.db.models import Sum, Q, fields
class WaterSourceSerializer(serializers.ModelSerializer):
	class Meta:
		model = WaterSource
		fields = ['id','name',]
class WaterSchemeSerializer(serializers.ModelSerializer):
	water_source = WaterSourceSerializer(many=True)
	system_built_date = serializers.CharField()
	system_operation_to = serializers.CharField()
	system_operation_from = serializers.CharField()
	tool_start_date = serializers.CharField()
	class Meta:
		model = WaterScheme
		fields = ['id',
			'scheme_name',
			'location',
			'water_source',
			'system_built_date',
			'system_operation_from',
			'system_operation_to',
			'daily_target',
			'tool_start_date',
			'period',
			'system_date_format',
			'currency',
			]

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')

		if attrs.get('system_date_format') == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('system_built_date')))
			attrs['system_built_date']=date_en

			date_en = convert_nep_date_to_english(str(attrs.get('system_operation_from')))
			attrs['system_operation_from']=date_en

			date_en = convert_nep_date_to_english(str(attrs.get('system_operation_to')))
			attrs['system_operation_to']=date_en

			date_en = convert_nep_date_to_english(str(attrs.get('tool_start_date')))
			attrs['tool_start_date']=date_en
		return attrs


	def create(self, validated_data):
		water_source = validated_data.pop('water_source')
		scheme = WaterScheme.objects.create(**validated_data)
		for i in water_source:
			WaterSource.objects.create(water_scheme_id = scheme.id, name = i.get('name'))
		return scheme

	def update(self, instance, validated_data):
		water_source = validated_data.pop('water_source')
		instance.scheme_name = validated_data.get('scheme_name')
		instance.location = validated_data.get('location')
		instance.system_built_date = validated_data.get('system_built_date')
		instance.system_operation_from =validated_data.get('system_operation_from')
		instance.system_operation_to =validated_data.get('system_operation_to')
		instance.daily_target =validated_data.get('daily_target')
		instance.tool_start_date =validated_data.get('tool_start_date')
		instance.period =validated_data.get('period')
		instance.system_date_format = validated_data.get('system_date_format')
		instance.currency = validated_data.get('currency')
		instance.save()
		WaterSource.objects.filter(water_scheme_id=instance.id).delete()
		for i in water_source:
			WaterSource.objects.create(water_scheme_id = instance.id, name = i.get('name'))
		return WaterScheme.objects.get(id=instance.id)

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(WaterSchemeSerializer, self).to_representation(data)
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if scheme.system_date_format == 'nep':
			data['system_built_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_built_date'))))
			data['system_operation_from'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_operation_from'))))
			data['system_operation_to'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_operation_to'))))
			data['tool_start_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('tool_start_date'))))
		if lang == 'nep':
			data['system_built_date'] = english_to_nepali_converter(data['system_built_date'])
			data['system_operation_from'] = english_to_nepali_converter(data['system_operation_from'])
			data['system_operation_to'] = english_to_nepali_converter(data['system_operation_to'])
		return data
class WaterSchemeListSerializer(serializers.ModelSerializer):
	water_source = WaterSourceSerializer(many=True)
	class Meta:
		model = WaterScheme
		fields = '__all__'

	def to_representation(self, data):
		data = super(WaterSchemeListSerializer, self).to_representation(data)
		if data['system_date_format'] == 'nep':
			data['system_built_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_built_date'))))
			data['system_operation_from'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_operation_from'))))
			data['system_operation_to'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_operation_to'))))
			data['tool_start_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('tool_start_date'))))
		return data

class WaterSchemeDataSerializer(serializers.ModelSerializer):
	class Meta:
		model = WaterSchemeData
		fields = ['id','beneficiary_household', 'beneficiary_population', 'public_taps', 'institutional_connection', 'apply_date']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')

		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = WaterSchemeData.objects.filter(water_scheme=scheme).last()

		if data and not self.instance:
			if data.apply_date >= str_to_datetime(attrs['apply_date']):
				raise serializers.ValidationError('Data for this date is already applied. Choose another date.')
			WaterSchemeData.objects.filter(id=data.id).update(apply_upto=attrs['apply_date'])

		if scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date']=date_en
		attrs['water_scheme']=scheme

		# apply_date_validation = apply_date_validation(attrs.get('apply_date'), scheme.tool_start_date)
		# if not apply_date_validation:
		# 	raise serializers.ValidationError('Apply date should be later than tool start date.')

		if self.instance:
			qs=WaterSchemeData.objects.filter(water_scheme=scheme)
			next_qs = qs.filter(apply_date__gt=attrs.get('apply_date')).order_by('pk').first()
			previous = qs.filter(apply_date__lt=attrs.get('apply_date')).order_by('-pk').first()
	        
			if next_qs and previous:
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			    self.instance.apply_upto=next_qs.apply_date
			    self.instance.save()

			elif next_qs and not previous:
				self.instance.apply_upto=next_qs.apply_date
				self.instance.save()

			elif previous and not next_qs :
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			else:
				self.instance.apply_upto=None
				self.instance.save()
		return attrs

	def to_representation(self, data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = super(WaterSchemeDataSerializer, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data


class SupplyBeltsSerializer(serializers.ModelSerializer):
	class Meta:
		model = SupplyBelts
		exclude = ['water_scheme']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		attrs['water_scheme']=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		return attrs

	def create(self, validated_data):
		return SupplyBelts.objects.create(**validated_data)

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(SupplyBeltsSerializer, self).to_representation(data)
		if lang == 'nep':
			data['public_taps'] = english_to_nepali_converter(str(data.get('public_taps')))
			data['institutional_connection']=english_to_nepali_converter(data.get('institutional_connection'))
			data['beneficiary_household']=english_to_nepali_converter(data.get('beneficiary_household'))
			data['beneficiary_population']=english_to_nepali_converter(data.get('beneficiary_population'))
		return data
class WaterTariffFixedSerializers(serializers.ModelSerializer):
	apply_date = serializers.CharField()
	class Meta:
		model = WaterTeriff
		fields = ['id',
		'terif_type',
		'rate_for_institution',
		'rate_for_household',
		'apply_date',
		'estimated_paying_connection_household',
		'estimated_paying_connection_institution',
		]

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		try:
			water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			water_scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))

		if water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date']=date_en

		existing_tariff = WaterTeriff.objects.filter(water_scheme=water_scheme).last()
		if existing_tariff and not self.instance:
			if existing_tariff.apply_date >= str_to_datetime(attrs['apply_date']):#datetime.strptime(, '%Y-%m-%d').date():
				raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
			WaterTeriff.objects.filter(id=existing_tariff.id).update(apply_upto=attrs['apply_date'])

		if self.instance:
			qs=WaterTeriff.objects.filter(water_scheme=water_scheme)
			next_qs = qs.filter(apply_date__gt=attrs.get('apply_date')).order_by('pk').first()
			previous = qs.filter(apply_date__lt=attrs.get('apply_date')).order_by('-pk').first()
			
			if next_qs and previous:
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			    self.instance.apply_upto=next_qs.apply_date
			    self.instance.save()
			elif next_qs and not previous:
				self.instance.apply_upto=next_qs.apply_date
				self.instance.save()
			elif previous and not next_qs :
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			else:
				self.instance.apply_upto=None
				self.instance.save()

		attrs['water_scheme']=water_scheme
		attrs['terif_type']='Fixed'
		return attrs

	def create(self, validated_data):
		return WaterTeriff.objects.create(**validated_data)

	def to_representation(self, data):
		try:
			water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			water_scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))
		data = super(WaterTariffFixedSerializers, self).to_representation(data)
		if water_scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data

class UseBasedUnitRangeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UseBasedUnitRange
		fields = '__all__'

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		# water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = UseBasedUnitRange.objects.filter(tariff_id = attrs['tariff'])
		
		total = 0
		if not self.instance:
			for i in data:
				total += i.estimated_paying_connection
		else:
			for i in data:
				if not i.id == self.instance.id:
					total += i.estimated_paying_connection
		total = total + attrs['estimated_paying_connection']
		if total > 100:
			raise serializers.ValidationError('Total estimated paying connection should exceed 100 in total.')
		return attrs
class UseBasedUnitRangeSerializer2(serializers.ModelSerializer):
	class Meta:
		model = UseBasedUnitRange
		exclude = ['tariff']

class CreateWaterTariffUsedBasedSerializers(serializers.ModelSerializer):
	used_based_units = UseBasedUnitRangeSerializer2(many=True)
	apply_date = serializers.CharField()
	class Meta:
		model = WaterTeriff
		fields = ['apply_date','used_based_units']
	
	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme

		if water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date']=date_en

		existing_tariff = WaterTeriff.objects.filter(water_scheme=water_scheme).last()
		if existing_tariff and not self.instance:
			if existing_tariff.apply_date > str_to_datetime(attrs['apply_date']):#datetime.strptime(, '%Y-%m-%d').date():
				raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
			if existing_tariff.apply_date == str_to_datetime(attrs['apply_date']):
				data=UseBasedUnitRange.objects.filter(tariff_id = existing_tariff.id)
				total = 0
				for j in data:
					total += j.estimated_paying_connection 
				total = total + attrs.get('estimated_paying_connection')
				if total > 100:
					raise serializers.ValidationError('Estimated paying connection exceed 100.')
			WaterTeriff.objects.filter(id=existing_tariff.id).update(apply_upto=attrs['apply_date'])

		attrs['water_scheme']=water_scheme
		attrs['terif_type']='Use Based'
		return attrs

	def to_representation(self, data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = super(CreateWaterTariffUsedBasedSerializers, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data
	
	def create(self, validated_data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		used_based_units = validated_data.pop('used_based_units')
		existing_tariff = WaterTeriff.objects.filter(water_scheme=scheme).last()
		apply_date = validated_data.get('apply_date')
		try:
			if existing_tariff.apply_date == apply_date:
				for i in used_based_units:
					data = UseBasedUnitRange.objects.filter(tariff_id = existing_tariff.id)
					total = 0
					for j in data:
						total += j.estimated_paying_connection + i.get('estimated_paying_connection')

					if not total > 100:
						UseBasedUnitRange.objects.create(tariff_id = existing_tariff.id, unit_from = i.get('unit_from'),
						unit_to=i.get('unit_to'),
						rate=i.get('rate'),
						estimated_paying_connection=i.get('estimated_paying_connection'))
				return existing_tariff
			else:
				teriff = WaterTeriff.objects.create(**validated_data)
				for i in used_based_units:
					data = UseBasedUnitRange.objects.filter(tariff_id = teriff.id)
					total = 0
					for j in data:
						total += j.estimated_paying_connection + i.get('estimated_paying_connection')

					if not total > 100:
						UseBasedUnitRange.objects.create(tariff_id = teriff.id, unit_from = i.get('unit_from'),
						unit_to=i.get('unit_to'),
						rate=i.get('rate'),
						estimated_paying_connection=i.get('estimated_paying_connection'))
				return teriff
		except:
			teriff = WaterTeriff.objects.create(**validated_data)
			for i in used_based_units:
				data = UseBasedUnitRange.objects.filter(tariff_id = teriff.id)
				total = 0
				for j in data:
					total += j.estimated_paying_connection + i.get('estimated_paying_connection')

				if not total > 100:
					UseBasedUnitRange.objects.create(tariff_id = teriff.id, unit_from = i.get('unit_from'),
					unit_to=i.get('unit_to'),
					rate=i.get('rate'),
					estimated_paying_connection=i.get('estimated_paying_connection'))
			return teriff
class WaterTariffUsedSerializers(serializers.ModelSerializer):
	used_based_units = UseBasedUnitRangeSerializer(required=True,many=True)
	class Meta:
		model = WaterTeriff
		fields = ['terif_type',
		'apply_date',
		'used_based_units',
		]

	def to_representation(self, data):
		water_scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))
		data = super(WaterTariffUsedSerializers, self).to_representation(data)
		if water_scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data
class WaterTariffUsedCreateSerializers(serializers.ModelSerializer):
	used_based_units = UseBasedUnitRangeSerializer(read_only=True,many=True)
	apply_date = serializers.CharField()
	class Meta:
		model = WaterTeriff
		fields = [
		'id',
		'terif_type',
		'apply_date',
		'used_based_units',
		]

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme

		if water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date']=date_en

		# existing_tariff = WaterTeriff.objects.filter(water_scheme=water_scheme).last()
		# if existing_tariff and not self.instance:
		# 	if existing_tariff.apply_date >= attrs['apply_date']:
		# 		raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
		# 	WaterTeriff.objects.filter(id=existing_tariff.id).update(apply_upto=attrs['apply_date'])

		if self.instance:
			qs=WaterTeriff.objects.filter(water_scheme=scheme)
			next_qs = qs.filter(apply_date__gt=attrs.get('apply_date')).order_by('pk').first()
			previous = qs.filter(apply_date__lt=attrs.get('apply_date')).order_by('-pk').first()
	        
			if next_qs and previous:
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			    self.instance.apply_upto=next_qs.apply_date
			    self.instance.save()
			elif next_qs and not previous:
				self.instance.apply_upto=next_qs.apply_date
				self.instance.save()
			elif previous and not next_qs :
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			else:
				self.instance.apply_upto=None
				self.instance.save()
		# 	tariff = WaterTeriff.objects.order_by('id')
		# 	if tariff.count() >= 2:
		# 		if tariff[1].apply_date >= attrs['apply_date']:
		# 			raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
		# 		WaterTeriff.objects.filter(id=tariff[1].id).update(apply_upto = attrs['apply_date'])
		attrs['water_scheme']=water_scheme
		attrs['terif_type']='Use Based'
		return attrs

	def to_representation(self, data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = super(WaterTariffUsedCreateSerializers, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data
class WaterSupplyScheduleSerializers(serializers.ModelSerializer):
	class Meta:
		model = WaterSupplySchedule
		exclude = ['water_scheme']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		
		if self.context['request'].user.is_authenticated:
			scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		else:
			scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))

		attrs['water_scheme']= scheme
		return attrs

	def create(self, validated_data):
		return WaterSupplySchedule.objects.create(**validated_data)
class QualityTestParameterSerializer(serializers.ModelSerializer):
	class Meta:
		model = QualityTestParameter
		exclude = ['water_scheme']

	def validate(self, attrs):
		attrs['water_scheme']=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		return attrs

	def create(self, validated_data):
		return QualityTestParameter.objects.create(**validated_data)


from datetime import datetime, timedelta
def date_range(start, end):
    delta = end - start  # as timedelta
    days = [start + timedelta(days=i) for i in range(delta.days + 1)]
    return days

class GetWaterSupplyRecordSerializers(serializers.ModelSerializer):
	class Meta:
		model = WaterSupplyRecord
		fields = ['id', 'total_supply', 'estimated_household', 'estimated_beneficiaries', 'supply_belts', 'is_daily']


class CreateWaterSupplyRecordSerializers(serializers.ModelSerializer):
	date_from = serializers.CharField(write_only=True)
	date_to = serializers.CharField(required=False, write_only=True)
	class Meta:
		model = WaterSupplyRecord
		fields = ['id', 'date_from', 'date_to', 'total_supply', 'estimated_household', 'estimated_beneficiaries', 'supply_belts', 'is_daily']
	
	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('date_from')))
			attrs['date_from']=date_en
			if attrs.get('date_to'):
				date_en = convert_nep_date_to_english(str(attrs.get('date_to')))
				attrs['date_to']=date_en
		else:
			attrs['date_from'] = str_to_datetime(attrs.get('date_from'))
			if attrs.get('date_to'):
				attrs['date_to'] = str_to_datetime(attrs.get('date_to'))
		attrs['water_scheme']=scheme
		return attrs

	def create(self, validated_data):
		date_from = validated_data.pop('date_from')
		if validated_data.get('date_to'):
			date_to = validated_data.pop('date_to')
			total_days = date_range(date_from,date_to)

			for i in range(len(total_days)):
				date = date_from + timedelta(days=i)
				date_np = nepali_datetime.date.from_datetime_date(date)
				if WaterSupplyRecord.objects.filter(supply_date=date).exists():
					WaterSupplyRecord.objects.filter(supply_date=date).update(**validated_data)
				else:
					WaterSupplyRecord.objects.create(supply_date=date,supply_date_np = date_np, **validated_data)
		else:
			if WaterSupplyRecord.objects.filter(supply_date=date_from).exists():
				WaterSupplyRecord.objects.filter(supply_date=date_from).update(**validated_data)
			else:
				date_from_np = nepali_datetime.date.from_datetime_date(date_from)
				WaterSupplyRecord.objects.create(supply_date=date_from, supply_date_np = date_from_np, **validated_data)
		return WaterSupplyRecord.objects.get(supply_date=date_from)

class TestParameterSerializer(serializers.ModelSerializer):
	class Meta:
		model = QualityTestParameter
		fields = ['id','parameter_name', 'unit']

class WaterTestResultParamtersSerializers(serializers.ModelSerializer):
	name = serializers.SerializerMethodField()
	unit = serializers.SerializerMethodField()

	class Meta:
		model = WaterTestResultParamters
		fields = ['parameter', 'value', 'name', 'unit']
	
	def get_name(self,obj):
		return obj.parameter.parameter_name

	def get_unit(self,obj):
		return obj.parameter.unit

class GetWaterTestResultsSerializers(serializers.ModelSerializer):
	test_result_parameter = WaterTestResultParamtersSerializers(read_only=True, many=True)

	class Meta:
		model = WaterTestResults
		fields = ['id', 'supply_belts', 'test_result_parameter']


class CreateWaterTestResultsSerializers(serializers.ModelSerializer):
	test_result_parameter = WaterTestResultParamtersSerializers(required=True, many=True)
	date_from = serializers.CharField(write_only=True)
	date_to = serializers.CharField(required=False, write_only=True)
	class Meta:
		model = WaterTestResults
		fields = ['id', 'date_from', 'date_to', 'supply_belts','test_result_parameter']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('date_from')))
			attrs['date_from']=date_en
			if attrs.get('date_to'):
				date_en = convert_nep_date_to_english(str(attrs.get('date_to')))
				attrs['date_to']=date_en
		else:
			attrs['date_from'] = str_to_datetime(attrs.get('date_from'))
			if attrs.get('date_to'):
				attrs['date_to'] = str_to_datetime(attrs.get('date_to'))
		attrs['water_scheme']=scheme
		return attrs

	def create(self, validated_data):
		date_from = validated_data.pop('date_from')
		test_result_parameter = validated_data.pop('test_result_parameter')
		if validated_data.get('date_to'):
			date_to = validated_data.pop('date_to')
			total_days = date_range(date_from,date_to)

			for i in range(len(total_days)):
				date = date_from + timedelta(days=i)
				if WaterTestResults.objects.filter(date=date).exists():
					WaterTestResults.objects.filter(date=date).delete()
				date_np = nepali_datetime.date.from_datetime_date(date)
				result = WaterTestResults.objects.create(date = date, date_np = date_np, **validated_data)
				for i in test_result_parameter:
					WaterTestResultParamters.objects.create(test_result = result,
						parameter = i.get('parameter'),
						value = i.get('value'))
		else:
			if WaterTestResults.objects.filter(date=date_from).exists():
				WaterTestResults.objects.filter(date=date_from).delete()
			date_np = nepali_datetime.date.from_datetime_date(date_from)
			result = WaterTestResults.objects.create(date=date_from, date_np = date_np, **validated_data)
			for i in test_result_parameter:
				WaterTestResultParamters.objects.create(test_result = result,
						parameter = i.get('parameter'),
						value = i.get('value'))
		return WaterTestResults.objects.get(date=date_from)

class OtherExpenseSerializers(serializers.ModelSerializer):
	apply_date = serializers.CharField()
	class Meta:
		model = OtherExpense
		exclude = ['water_scheme',]

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(OtherExpenseSerializers, self).to_representation(data)

		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if scheme.system_date_format =='nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))

		if lang == 'nep':
			data['yearly_expense'] = english_to_nepali_converter(data.get('yearly_expense'))
			data['apply_date'] = english_to_nepali_converter(data.get('apply_date'))
		return data

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')

		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		
		if scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date'] = date_en

		attrs['water_scheme'] = scheme
		return attrs

	def create(self, validated_data):
		return OtherExpense.objects.create(**validated_data)


class InflationRateSerializer(serializers.ModelSerializer):
	class Meta:
		model = OtherExpenseInflationRate
		exclude = ['water_scheme']


	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(InflationRateSerializer, self).to_representation(data)
		if lang == 'nep':
			data['rate'] = english_to_nepali_converter(data.get('rate'))
		return data

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')

		attrs['water_scheme']=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		return attrs

	def create(self, validated_data):
		return OtherExpenseInflationRate.objects.create(**validated_data)


class YearIntervalSerializer(serializers.ModelSerializer):
	is_present_year=serializers.ReadOnlyField()
	class Meta:
		model = YearsInterval
		fields = ['id','start_date', 'end_date','year_num','is_present_year',]

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')

		scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')
		scheme = get_object_or_404(WaterScheme, slug=scheme)
		data = super(YearIntervalSerializer, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['start_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['start_date'])))
			data['end_date']= str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['end_date'])))

		if lang == 'nep':
			data['start_date'] = english_to_nepali_converter(str_to_datetime(data['start_date']))
			data['end_date']=english_to_nepali_converter(str_to_datetime(data['end_date']))
		return data

class NotificationPeriodSerializer(serializers.ModelSerializer):
	initial_date=serializers.CharField()
	scheme = None
	class Meta:
		model = NotificationPeriod
		fields = ['id','initial_date', 'income_notification_period', 'expenditure_notification_period', 'test_result_notification_period','supply_record_notification_period']
	
	def validate(self, attrs):
		try:
			self.scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			self.scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')
		
		# if not self.instance:
		# 	if NotificationPeriod.objects.filter(water_scheme =scheme).exists():
		# 		raise serializers.ValidationError('Data already exists')
		
		if self.scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('initial_date')))
			attrs['initial_date']=date_en
			
		attrs['water_scheme']=self.scheme
		return attrs

	def create(self, validated_data):
		if NotificationPeriod.objects.filter(water_scheme =self.scheme).exists():
			NotificationPeriod.objects.filter(water_scheme =self.scheme).update(initial_date=validated_data.get('initial_date'),
				income_notification_period=validated_data.get('income_notification_period'),
				expenditure_notification_period = validated_data.get('supply_record_notification_period'),
				test_result_notification_period= validated_data.get('supply_record_notification_period') ,
				supply_record_notification_period = validated_data.get('supply_record_notification_period'))
			return NotificationPeriod.objects.filter(water_scheme =self.scheme).last()
		return NotificationPeriod.objects.create(**validated_data)
	
	def to_representation(self, data):
		try:
			scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')

		data = super(NotificationPeriodSerializer, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['initial_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['initial_date'])))

		return data
class NotificationStoreSerializer(serializers.ModelSerializer):
	class Meta:
		model = NotificationStore
		fields = '__all__'