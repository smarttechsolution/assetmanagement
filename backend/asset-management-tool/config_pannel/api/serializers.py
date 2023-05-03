from xml.dom import ValidationErr
from rest_framework import serializers
from config_pannel.models import *
from django.shortcuts import get_object_or_404
from users.models import Users
from asset_management_system.utils import english_to_nepali_converter
import nepali_datetime
import datetime
from .utils import *
from django.db.models import Sum, Q, fields

# class WaterSourceSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = WaterSource
# 		fields = ['id','name',]

class WaterSchemeSerializer(serializers.ModelSerializer):
	# water_source = WaterSourceSerializer(many=True)
	system_built_date = serializers.CharField()
	tool_start_date = serializers.CharField()
	class Meta:
		model = WaterScheme
		fields = ['id',
			'scheme_name',
			'location',
			'water_source',
			'system_built_date',
			'longitude',
			'latitude',
			'daily_target',
			'tool_start_date',
			'period',
			'system_date_format',
			'currency',
			]

	def validate(self, attrs):
		daily_target = attrs['daily_target']
		period = attrs['period']
		latitude = attrs['latitude']
		longitude = attrs['longitude']

		if daily_target<0 or period<0:
			raise serializers.ValidationError("Negative value can't be entered.")

		if len(str(daily_target).split('.')[-1])>2 or len(str(period).split('.')[-1])>2:
			raise serializers.ValidationError("Only Accept 2 digits after decimal point.") 

		if len(str(longitude).split('.')[-1])>5 or len(str(latitude).split('.')[-1])>5:
			raise serializers.ValidationError("Only Accept 5 digits after decimal point.")

		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')

		if attrs.get('system_date_format') == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('system_built_date')))
			attrs['system_built_date']=date_en

			date_en = convert_nep_date_to_english(str(attrs.get('tool_start_date')))
			attrs['tool_start_date']=date_en
		return attrs


	# def create(self, validated_data):
	# 	# water_source = validated_data.pop('water_source')
	# 	scheme = WaterScheme.objects.create(**validated_data)
	# 	# for i in water_source:
	# 	# 	WaterSource.objects.create(water_scheme_id = scheme.id, name = i.get('name'))
	# 	return scheme

	# def update(self, instance, validated_data):
	# 	water_source = validated_data.pop('water_source')
	# 	instance.scheme_name = validated_data.get('scheme_name')
	# 	instance.location = validated_data.get('location')
	# 	instance.system_built_date = validated_data.get('system_built_date')
	# 	instance.longitude =validated_data.get('longitude')
	# 	instance.latitude =validated_data.get('latitude')
	# 	instance.daily_target =validated_data.get('daily_target')
	# 	instance.tool_start_date =validated_data.get('tool_start_date')
	# 	instance.period =validated_data.get('period')
	# 	instance.system_date_format = validated_data.get('system_date_format')
	# 	instance.currency = validated_data.get('currency')
	# 	instance.save()
	# 	WaterSource.objects.filter(water_scheme_id=instance.id).delete()
	# 	for i in water_source:
	# 		WaterSource.objects.create(water_scheme_id = instance.id, name = i.get('name'))
	# 	return WaterScheme.objects.get(id=instance.id)

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(WaterSchemeSerializer, self).to_representation(data)
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if scheme.system_date_format == 'nep':
			data['system_built_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_built_date'))))
			data['tool_start_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('tool_start_date'))))
		if lang == 'nep':
			data['system_built_date'] = english_to_nepali_converter(data['system_built_date'])
			data['longitude'] = english_to_nepali_converter(data['longitude'])
			data['latitude'] = english_to_nepali_converter(data['latitude'])
		return data

class WaterSchemeListSerializer(serializers.ModelSerializer):
	# water_source = WaterSourceSerializer(many=True)
	class Meta:
		model = WaterScheme
		fields = '__all__'

	def to_representation(self, data):
		from decouple import config
		data = super(WaterSchemeListSerializer, self).to_representation(data)
		domain_url = self.context['request'].build_absolute_uri('/')[:-1]
		full_url = domain_url+"/help/"
		data["web_dashboard_link"] = f"{config('FRONTEND_DOMAIN_URL')}/#/scheme/{data['slug']}/home"
		data["help_url"] = full_url
		if data['system_date_format'] == 'nep':
			data['system_built_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('system_built_date'))))
			data['tool_start_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('tool_start_date'))))
		return data

class WaterSchemeDataSerializer(serializers.ModelSerializer):
	class Meta:
		model = WaterSchemeData
		fields = ['id','household_connection', 'public_connection','commercial_connection', 'institutional_connection', 'apply_date']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		hc = attrs['household_connection']
		pc = attrs['public_connection']
		cc = attrs['commercial_connection']
		ic = attrs['institutional_connection']

		if hc<0 or pc<0 or cc<0 or ic<0:
			raise serializers.ValidationError("Negative value can't be entered.")

		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = WaterSchemeData.objects.filter(water_scheme=scheme).last()

		if data and not self.instance:
			if data.apply_date == str_to_datetime(attrs['apply_date']):
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



class WaterTariffFixedSerializers(serializers.ModelSerializer):
	apply_date = serializers.CharField()
	class Meta:
		model = WaterTeriff
		fields = ['id',
		'terif_type',
		'rate_for_institution',
		'rate_for_household',
		'rate_for_public',
		'rate_for_commercial',
		'apply_date',
		'estimated_paying_connection_household',
		'estimated_paying_connection_institution',
		'estimated_paying_connection_public',
		'estimated_paying_connection_commercial',
		]

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')

		if attrs['estimated_paying_connection_household']>100 or attrs['estimated_paying_connection_institution']>100 \
			or attrs['estimated_paying_connection_public']>100 or attrs['estimated_paying_connection_commercial']>100:
			raise serializers.ValidationError("Value should not exceed 100%")

		epch = attrs['estimated_paying_connection_household']
		epci = attrs['estimated_paying_connection_institution']
		epcp = attrs['estimated_paying_connection_public']
		epcc = attrs['estimated_paying_connection_commercial']
		rfi = attrs['rate_for_institution']
		rfh = attrs['rate_for_household']
		rfp = attrs['rate_for_public']
		rfc = attrs['rate_for_commercial'] 
		if epcc<0 or epch<0 or epci<0 or epcp<0 or rfi<0 or rfh<0 or rfp<0 or rfc<0:
			raise serializers.ValidationError("Negative value can't be entered.")

		if len(str(epch).split('.')[-1])>2 or len(str(epci).split('.')[-1])>2 or len(str(epcp).split('.')[-1])>2 or len(str(epcc).split('.')[-1])>2 \
			or len(str(rfi).split('.')[-1])>2 or len(str(rfh).split('.')[-1])>2 or len(str(rfp).split('.')[-1])>2 or len(str(rfc).split('.')[-1])>2:
			raise serializers.ValidationError("Only Accept 2 digits after decimal point") 

		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		try:
			water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			water_scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))

		if water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date']=date_en

		# existing_tariff = WaterTeriff.objects.filter(water_scheme=water_scheme).last()
		# if existing_tariff and not self.instance:
		# 	if existing_tariff.apply_date >= str_to_datetime(attrs['apply_date']):#datetime.strptime(, '%Y-%m-%d').date():
		# 		raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
		# 	WaterTeriff.objects.filter(id=existing_tariff.id).update(apply_upto=attrs['apply_date'])

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
				a = qs.filter(apply_date__gt=attrs.get('apply_date')).order_by('-pk')[1]
				self.instance.apply_upto=a.apply_date#next_qs.apply_date
				self.instance.save()
			elif previous and not next_qs :
			    previous.apply_upto = attrs.get('apply_date')
			    previous.save()
			else:
				self.instance.apply_upto=None
				self.instance.save()
		# import pdb; pdb.set_trace()
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
			raise serializers.ValidationError('Total estimated paying connection should not exceed 100 in total.')
		return attrs

class UseBasedUnitRangeSerializer2(serializers.ModelSerializer):
	class Meta:
		model = UseBasedUnitRange
		exclude = ['id','tariff']

class CreateWaterTariffUsedBasedSerializers(serializers.ModelSerializer):
	used_based_units = UseBasedUnitRangeSerializer2(many=True)
	apply_date = serializers.CharField()
	class Meta:
		model = WaterTeriff
		fields = ['id','apply_date','used_based_units']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language should be either en or nep')
		water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		for i in attrs['used_based_units']:
			unit_from = i['unit_from']
			unit_to = i['unit_to']
			rate = i['rate']
			estimated_paying_connection = i['estimated_paying_connection']
			if unit_from<0 or unit_to<0 or rate<0 or estimated_paying_connection<0:
				raise serializers.ValidationError("Negative value can't be entered.")
			
			if len(str(rate).split('.')[-1])>2 or len(str(estimated_paying_connection).split('.')[-1])>2:
				raise serializers.ValidationError(" Only Accept 2 digits after decimal point")

		previous_unit = []
		if len(attrs['used_based_units'])>1:
			for j in attrs['used_based_units']:
				unit_from = j['unit_from']
				unit_to = j['unit_to']
				try:
					previous_unit_to= previous_unit[-1]
				except:
					previous_unit_to = 0
				if previous_unit_to>unit_from or unit_from>=unit_to:
					raise serializers.ValidationError("The Unit up to and including: should always be higher than unit starting from.")
				previous_unit.append(unit_to)
				for k in previous_unit:
					if unit_from == k:
						raise serializers.ValidationError("should not repeat the first number of a range with the last number of the previous range.")

		if water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
			attrs['apply_date']=date_en

		existing_tariff = WaterTeriff.objects.filter(water_scheme=water_scheme).last()
		if existing_tariff and not self.instance:
			if existing_tariff.apply_date >= str_to_datetime(attrs['apply_date']):#datetime.strptime(, '%Y-%m-%d').date():
				raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
			# if existing_tariff.apply_date == str_to_datetime(attrs['apply_date']):
				# data=UseBasedUnitRange.objects.filter(tariff_id = existing_tariff.id)
				# total = 0
				# for j in data:
				# 	total += j.estimated_paying_connection 
		new_epc = 0
		for k in attrs.get('used_based_units'):
			new_epc += k.get('estimated_paying_connection')

		# total = total + new_epc
		if new_epc > 100:
			raise serializers.ValidationError('Estimated paying connection exceed 100.')
			# WaterTeriff.objects.filter(id=existing_tariff.id).update(apply_upto=attrs['apply_date'])

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
		existing_tariff = WaterTeriff.objects.filter(water_scheme=scheme).update(apply_upto=validated_data['apply_date'])
		# apply_date = validated_data.get('apply_date')
		# try:
		# 	if existing_tariff.apply_date == apply_date:
		# 		for i in used_based_units:
		# 			data = UseBasedUnitRange.objects.filter(tariff_id = existing_tariff.id)
		# 			total = 0
		# 			for j in data:
		# 				total += j.estimated_paying_connection + i.get('estimated_paying_connection')

		# 			if not total > 100:
		# 				UseBasedUnitRange.objects.create(tariff_id = existing_tariff.id, unit_from = i.get('unit_from'),
		# 				unit_to=i.get('unit_to'),
		# 				rate=i.get('rate'),
		# 				estimated_paying_connection=i.get('estimated_paying_connection'))
		# 		return existing_tariff
		# 	else:
		# 		teriff = WaterTeriff.objects.create(**validated_data)
		# 		for i in used_based_units:
		# 			data = UseBasedUnitRange.objects.filter(tariff_id = teriff.id)
		# 			total = 0
		# 			for j in data:
		# 				total += j.estimated_paying_connection + i.get('estimated_paying_connection')

		# 			if not total > 100:
		# 				UseBasedUnitRange.objects.create(tariff_id = teriff.id, unit_from = i.get('unit_from'),
		# 				unit_to=i.get('unit_to'),
		# 				rate=i.get('rate'),
		# 				estimated_paying_connection=i.get('estimated_paying_connection'))
		# 		return teriff
		# except:
		teriff = WaterTeriff.objects.create(**validated_data)
		for i in used_based_units:
			# data = UseBasedUnitRange.objects.filter(tariff_id = teriff.id)
			# total = 0
			# for j in data:
			# 	total += j.estimated_paying_connection + i.get('estimated_paying_connection')

			# if not total > 100:
			UseBasedUnitRange.objects.create(tariff_id = teriff.id, unit_from = i.get('unit_from'),
			unit_to=i.get('unit_to'),
			rate=i.get('rate'),
			estimated_paying_connection=i.get('estimated_paying_connection'))
		return teriff

	def update(self, instance, validated_data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		used_based_units = validated_data.pop('used_based_units')
		# tariff = WaterTeriff.objects.filter(water_scheme=scheme, id=instance.id)
		apply_date = validated_data.get('apply_date')
		instance.apply_date = apply_date
		instance.save()

		# next_qs = WaterTeriff.objects.filter(pk__gt=instance.pk).order_by('pk').first()
		previous = WaterTeriff.objects.filter(pk__lt=instance.pk).order_by('-pk').first()
        
		if previous:
			previous.apply_upto = instance.apply_date
			previous.save()

		data = UseBasedUnitRange.objects.filter(tariff_id = instance.id).delete()
		for i in used_based_units:
			# total = 0
			# for j in data:
			# 	total += j.estimated_paying_connection + i.get('estimated_paying_connection')

			# if not total > 100:
			UseBasedUnitRange.objects.create(tariff_id = instance.id, unit_from = i.get('unit_from'),
			unit_to=i.get('unit_to'),
			rate=i.get('rate'),
			estimated_paying_connection=i.get('estimated_paying_connection'))
		return instance


<<<<<<< HEAD
				if not total > 100:
					UseBasedUnitRange.objects.create(tariff_id = teriff.id, unit_from = i.get('unit_from'),
					unit_to=i.get('unit_to'),
					rate=i.get('rate'),
					estimated_paying_connection=i.get('estimated_paying_connection'))
			return teriff

=======
>>>>>>> ams-final
class WaterTariffUsedSerializers(serializers.ModelSerializer):
	used_based_units = UseBasedUnitRangeSerializer(required=True,many=True)
	class Meta:
		model = WaterTeriff
		fields = ['id',
		'terif_type',
		'apply_date',
		'used_based_units',
		]

	def to_representation(self, data):
		water_scheme = get_object_or_404(WaterScheme, slug = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug'))
		data = super(WaterTariffUsedSerializers, self).to_representation(data)
		if water_scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data
<<<<<<< HEAD

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
=======
>>>>>>> ams-final

# class WaterTariffUsedCreateSerializers(serializers.ModelSerializer):
# 	used_based_units = UseBasedUnitRangeSerializer(read_only=True,many=True)
# 	apply_date = serializers.CharField()
# 	class Meta:
# 		model = WaterTeriff
# 		fields = [
# 		'id',
# 		'terif_type',
# 		'apply_date',
# 		'used_based_units',
# 		]

# 	def validate(self, attrs):
# 		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
# 		if not lang in ('en', 'nep'):
# 			raise serializers.ValidationError('Language suhould be either en or nep')
# 		water_scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme

# 		if water_scheme.system_date_format == 'nep':
# 			date_en = convert_nep_date_to_english(str(attrs.get('apply_date')))
# 			attrs['apply_date']=date_en

# 		# existing_tariff = WaterTeriff.objects.filter(water_scheme=water_scheme).last()
# 		# if existing_tariff and not self.instance:
# 		# 	if existing_tariff.apply_date >= attrs['apply_date']:
# 		# 		raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
# 		# 	WaterTeriff.objects.filter(id=existing_tariff.id).update(apply_upto=attrs['apply_date'])

# 		if self.instance:
# 			qs=WaterTeriff.objects.filter(water_scheme=scheme)
# 			next_qs = qs.filter(apply_date__gt=attrs.get('apply_date')).order_by('pk').first()
# 			previous = qs.filter(apply_date__lt=attrs.get('apply_date')).order_by('-pk').first()
	        
# 			if next_qs and previous:
# 			    previous.apply_upto = attrs.get('apply_date')
# 			    previous.save()
# 			    self.instance.apply_upto=next_qs.apply_date
# 			    self.instance.save()
# 			elif next_qs and not previous:
# 				self.instance.apply_upto=next_qs.apply_date
# 				self.instance.save()
# 			elif previous and not next_qs :
# 			    previous.apply_upto = attrs.get('apply_date')
# 			    previous.save()
# 			else:
# 				self.instance.apply_upto=None
# 				self.instance.save()
# 		# 	tariff = WaterTeriff.objects.order_by('id')
# 		# 	if tariff.count() >= 2:
# 		# 		if tariff[1].apply_date >= attrs['apply_date']:
# 		# 			raise serializers.ValidationError('Tariff for this date is already applied. Choose another date.')
# 		# 		WaterTeriff.objects.filter(id=tariff[1].id).update(apply_upto = attrs['apply_date'])
# 		attrs['water_scheme']=water_scheme
# 		attrs['terif_type']='Use Based'
# 		return attrs

# 	def to_representation(self, data):
# 		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
# 		data = super(WaterTariffUsedCreateSerializers, self).to_representation(data)
# 		if scheme.system_date_format == 'nep':
# 			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
# 		return data

<<<<<<< HEAD
	def to_representation(self, data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = super(WaterTariffUsedCreateSerializers, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['apply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data.get('apply_date'))))
		return data

=======
>>>>>>> ams-final
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
		val_check = str(attrs['NDWQS_standard'])
		split_value = val_check.split('-')
		if len(split_value) <= 2:
			for i in split_value:
				try:
					float(i)
				except:
					raise serializers.ValidationError("Numeric Value required!")
		else:
			raise serializers.ValidationError("Enter Value in range eg. (0-5)")
		try:
			if float(val_check)<0:
				raise serializers.ValidationError("Negative value can't be entered.")
		except:
			pass
		attrs['water_scheme']=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		
		return attrs

	def create(self, validated_data):
		return QualityTestParameter.objects.create(**validated_data)

	def to_representation(self, instance):
		
		data =  super().to_representation(instance)
		ndwqs = data.get("NDWQS_standard")
		split_val = ndwqs.split('-')
		try:
			if len(split_val) == 2:
				data["ndwqs1"] = float(split_val[0])
				data["ndwqs2"] = float(split_val[1])
			else:
				data["ndwqs1"] = float(ndwqs)
		except:
			data["ndwqs1"] = None
			data["ndwqs2"] = None

		return data
		

from datetime import datetime, timedelta
def date_range(start, end):
    delta = end - start  # as timedelta
    days = [start + timedelta(days=i) for i in range(delta.days + 1)]
    return days

class GetWaterSupplyRecordSerializers(serializers.ModelSerializer):
	class Meta:
		model = WaterSupplyRecord
		fields = ['id', 'total_supply', 'is_daily']


class CreateWaterSupplyRecordSerializers(serializers.ModelSerializer):
	date_from = serializers.CharField(write_only=True)
	date_to = serializers.CharField(required=False, write_only=True)
	class Meta:
		model = WaterSupplyRecord
		fields = ['id', 'date_from', 'date_to', 'total_supply', 'is_daily']
	
	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		total_supply = attrs['total_supply']
		if len(str(total_supply).split('.')[-1])>2:
			raise serializers.ValidationError(" Only Accept 2 digits after decimal point")
		if total_supply<0:
			raise serializers.ValidationError("Negative value can't be entered.")
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
		try:
			return WaterSupplyRecord.objects.get(supply_date=date_from)
		except:
			raise serializers.ValidationError(f"Record already exist on {date_from} Date")

class TestParameterSerializer(serializers.ModelSerializer):
	class Meta:
		model = QualityTestParameter
		fields = ['id','parameter_name', 'unit']

class WaterTestResultParamtersSerializers(serializers.ModelSerializer):
	name = serializers.SerializerMethodField()
	unit = serializers.SerializerMethodField()
	NDWQS = serializers.SerializerMethodField()

	class Meta:
		model = WaterTestResultParamters
		fields = ['parameter', 'value', 'name', 'unit', 'NDWQS']
		
	def get_name(self,obj):
		return obj.parameter.parameter_name

	def get_unit(self,obj):
		return obj.parameter.unit

	def get_NDWQS(self,obj):
		return obj.parameter.NDWQS_standard

class GetWaterTestResultsSerializers(serializers.ModelSerializer):
	test_result_parameter = WaterTestResultParamtersSerializers(read_only=True, many=True)

	class Meta:
		model = WaterTestResults
		fields = ['id','test_result_parameter']


class CreateWaterTestResultsSerializers(serializers.ModelSerializer):
	test_result_parameter = WaterTestResultParamtersSerializers(required=True, many=True)
	date_from = serializers.CharField(write_only=True)
	date_to = serializers.CharField(required=False, write_only=True, allow_blank=True, allow_null=True)
	class Meta:
		model = WaterTestResults
		fields = ['id', 'date_from', 'date_to','test_result_parameter']

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
			validated_data.pop('date_to')
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
		val_check = str(attrs['yearly_expense'])
		if len(val_check.split('.')[-1])>2:
			raise serializers.ValidationError(" Only Accept 2 digits after decimal point")
		if attrs['yearly_expense']<0:
			raise serializers.ValidationError("Negative value can't be entered.")
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

		val_check = str(attrs['rate'])
		if len(val_check.split('.')[-1])>1:
			raise serializers.ValidationError(" Only Accept 1 digits after decimal point")

		if attrs['rate']<0:
			raise serializers.ValidationError("Negative value can't be entered.")
		attrs['water_scheme']=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		return attrs

	def create(self, validated_data):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if OtherExpenseInflationRate.objects.filter(water_scheme =scheme).exists():
			OtherExpenseInflationRate.objects.filter(water_scheme =scheme).update(rate=validated_data.get('rate'),
				dis_allow_edit = validated_data.get('dis_allow_edit'))
			return OtherExpenseInflationRate.objects.filter(water_scheme =scheme).last()
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
		fields = ['id','initial_date', 'income_notification_period', 'expenditure_notification_period', 'test_result_notification_period','supply_record_notification_period','maintenance_notify_before','maintenance_notify_after']
	
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
				supply_record_notification_period = validated_data.get('supply_record_notification_period'),
				maintenance_notify_before = validated_data.get('maintenance_notify_before'),
				maintenance_notify_after = validated_data.get('maintenance_notify_after'),
				)
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


class ConfigWaterSupplyRecordSerializers(serializers.ModelSerializer):
	class Meta:
		model = WaterSupplyRecord
		fields = ['id','supply_date', 'total_supply']

	def validate(self, attrs):
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
<<<<<<< HEAD
		
=======
		val_check = str(attrs['total_supply'])
		if len(val_check.split('.')[-1])>2:
			raise serializers.ValidationError(" Only Accept 2 digits after decimal point")
		if attrs['total_supply']<0:
			raise serializers.ValidationError("Negative value can't be entered.")
>>>>>>> ams-final
		if scheme.system_date_format == 'nep':
			attrs['supply_date_np'] = attrs.get('supply_date')
			supply_date_en = convert_nep_date_to_english(str(attrs.get('supply_date')))
			attrs['supply_date']=supply_date_en
		else:
			supply_date = str_to_datetime(attrs.get('supply_date'))
			attrs['supply_date_np'] = nepali_datetime.date.from_datetime_date(supply_date)
		attrs['water_scheme']=scheme
		return attrs

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = super(ConfigWaterSupplyRecordSerializers, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['supply_date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['supply_date'])))
			if lang == 'nep':
				data['total_supply'] = english_to_nepali_converter(data['total_supply'])
				data['supply_date'] = english_to_nepali_converter(data['supply_date'])
		return data



class ConfigWaterResultsSerializers(serializers.ModelSerializer):
	test_result_parameter = WaterTestResultParamtersSerializers(required=True, many=True)
	class Meta:
		model = WaterTestResults
		fields = ['id','date','test_result_parameter']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
<<<<<<< HEAD
		
=======
		for i in attrs['test_result_parameter']:
			if i['value']:
				if len(str(i['value']).split('.')[-1])>2:
					raise serializers.ValidationError("Only Accept 2 digits after decimal point") 
				if i['value']<0:
					raise serializers.ValidationError("Negative value can't be entered.")
>>>>>>> ams-final
		if scheme.system_date_format == 'nep':
			attrs['date_np'] = attrs.get('date',None)
			date_en = convert_nep_date_to_english(str(attrs.get('date')))
			attrs['date']=date_en
		else:
			date = str_to_datetime(attrs.get('date'))
			attrs['date_np'] = nepali_datetime.date.from_datetime_date(date)
		attrs['water_scheme_id']=scheme.id
		return attrs

	def create(self, validated_data):
		test_result_parameter = validated_data.pop('test_result_parameter')

		result = WaterTestResults.objects.create(**validated_data)

		for i in test_result_parameter:
			WaterTestResultParamters.objects.create(test_result_id = result.id,parameter = i.get('parameter'), value = i.get('value'))
		return WaterTestResults.objects.get(id=result.id)

	def update(self, instance, validated_data):
		test_result_parameter = validated_data.pop('test_result_parameter')

		WaterTestResults.objects.filter(id=instance.id).update(**validated_data)
		instance.test_result_parameter.all().delete()
		
		for i in test_result_parameter:
			WaterTestResultParamters.objects.create(test_result_id = instance.id,parameter = i.get('parameter'), value = i.get('value'))
		return WaterTestResults.objects.get(id=instance.id)





	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		scheme = get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		data = super(ConfigWaterResultsSerializers, self).to_representation(data)
		if scheme.system_date_format == 'nep':
			data['date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['date'])))
			# if lang == 'nep':
			# 	data['date'] = english_to_nepali_converter(data['date'])
		return data


		# if validated_data.get('date_to'):
		# 	date_to = validated_data.pop('date_to')
		# 	total_days = date_range(date_from,date_to)

		# 	for i in range(len(total_days)):
		# 		date = date_from + timedelta(days=i)
		# 		if WaterTestResults.objects.filter(date=date).exists():
		# 			WaterTestResults.objects.filter(date=date).delete()
		# 		date_np = nepali_datetime.date.from_datetime_date(date)
		# 		result = WaterTestResults.objects.create(date = date, date_np = date_np, **validated_data)
		# 		for i in test_result_parameter:
		# 			WaterTestResultParamters.objects.create(test_result = result,
		# 				parameter = i.get('parameter'),
		# 				value = i.get('value'))
		# else:
		# 	if WaterTestResults.objects.filter(date=date_from).exists():
		# 		WaterTestResults.objects.filter(date=date_from).delete()
		# 	date_np = nepali_datetime.date.from_datetime_date(date_from)
		# 	result = WaterTestResults.objects.create(date=date_from, date_np = date_np, **validated_data)
		# 	for i in test_result_parameter:
		# 		WaterTestResultParamters.objects.create(test_result = result,
		# 				parameter = i.get('parameter'),
		# 				value = i.get('value'))
		# return WaterTestResults.objects.get(date=date_from)