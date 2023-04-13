from rest_framework import serializers
from ..models import (Income,
	Expenditure,
	IncomeCategory,
	ExpenseCategory,
	CashBookImage,
	CashBookClosingMonth,
	CashBookImage,
	)
import datetime
import nepali_datetime
from asset_management_system.utils import english_to_nepali_converter, get_week_day
from django.shortcuts import get_object_or_404
from users.models import Users
from config_pannel.models import WaterScheme
from .utils import str_to_datetime, convert_nep_date_to_english,default_income_category,default_expense_category,get_month_range

class IncomeCategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = IncomeCategory
		fields = ['id','name']

	def validate(self, attrs):
		scheme=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if attrs.get('name') == 'Water Sales':
			raise serializers.ValidationError('Default category water sales cannot be changed.')
		if not self.instance:
			if IncomeCategory.objects.filter(name = attrs.get('name'), water_scheme=scheme).exists():
				raise serializers.ValidationError('Category with this name already exists.')
		else:
			if IncomeCategory.objects.filter(name = attrs.get('name'), water_scheme=scheme).exclude(pk=self.instance.pk).exists():
				raise serializers.ValidationError('Category with this name already exists.')

		attrs['water_scheme']=scheme
		return attrs

	def create(self, validate_data):
		return IncomeCategory.objects.create(**validate_data)
		
	def to_representation(self, data):
		data = super(IncomeCategorySerializer, self).to_representation(data)
		try:
			scheme=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')
			scheme = get_object_or_404(WaterScheme, slug=scheme)
		if scheme.system_date_format == 'nep' and data['name'] == 'Water Sales':
			category = default_income_category(scheme, data['name'])
			data['e_name'] = data['name']
			data['name'] = category
		else:
			data['e_name']=data['name']
		return data

class ExpenseCategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = ExpenseCategory
		fields = ['id','name']

	def validate(self, attrs):
		scheme=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		if attrs.get('name') == 'Maintenance':
			raise serializers.ValidationError('Default category water sales cannot be changed.')

		if not self.instance:
			if ExpenseCategory.objects.filter(name = attrs.get('name'), water_scheme=scheme).exists():
				raise serializers.ValidationError('Category with this name already exists.')
		else:
			if ExpenseCategory.objects.filter(name = attrs.get('name'), water_scheme=scheme).exclude(pk=self.instance.pk).exists():
				raise serializers.ValidationError('Category with this name already exists.')
		attrs['water_scheme']=scheme
		return attrs

	def create(self, validate_data):
		return ExpenseCategory.objects.create(**validate_data)

	def to_representation(self, data):
		data = super(ExpenseCategorySerializer, self).to_representation(data)
		try:
			scheme=get_object_or_404(Users, id = self.context['request'].user.id).water_scheme
		except:
			scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')
			scheme = get_object_or_404(WaterScheme, slug=scheme)
		
		if scheme.system_date_format == 'nep' and data['name'] == 'Maintenance':
			category = default_expense_category(scheme, data['name'])
			data['e_name'] = data['name']
			data['name'] = category
		else:
			data['e_name']=data['name']
		return data

class IncomeListSerializer(serializers.ModelSerializer):
	date_np = serializers.ReadOnlyField()
	category = IncomeCategorySerializer(read_only = True)

	class Meta:
		model = Income
		fields = ['id','category','date','title','income_amount','water_supplied','date_np']

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(IncomeListSerializer, self).to_representation(data)
		scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')
		scheme = get_object_or_404(WaterScheme, slug=scheme)
		if scheme.system_date_format == 'nep':
			data['date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['date'])))
		if lang == 'nep':
			data['date_np'] = english_to_nepali_converter(data['date_np'])
			data['income_amount'] = english_to_nepali_converter(str(data.get('income_amount')))
			data['water_supplied'] = english_to_nepali_converter(str(data.get('water_supplied')))
		return data

class IncomeCreateSerializer(serializers.ModelSerializer):
	date_np = serializers.ReadOnlyField()
	date = serializers.CharField()
	user=None
	class Meta:
		model = Income
		fields = ['id','category','date','title','income_amount','water_supplied','date_np']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language should be either en or nep')
		
		self.user = get_object_or_404(Users, id=self.context['request'].user.id)

		income_amount = str(attrs['income_amount'])
		try:
			water_supplied = str(attrs['water_supplied'])
		except:
			water_supplied = 0.0
		if len(income_amount.split('.')[-1])>2 or len(str(water_supplied).split('.')[-1])>2:
			raise serializers.ValidationError("Only Accept 2 digits after decimal point")

		if attrs['income_amount']<0 or float(water_supplied)<0:
			raise serializers.ValidationError("Negative value can't be entered.")

		if self.user.water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('date')))
			date_np = attrs.get('date')
			date_list = str(attrs.get('date')).split('-')
			month_range = get_month_range(int(date_list[0]), int(date_list[1]))
			
			if Income.objects.filter(closed_date__gte = month_range.get('month_start'), closed_date__lte = month_range.get('month_end'), category__water_scheme = self.user.water_scheme).exists():
				if OtherExpenseInflationRate.objects.filter(water_scheme=self.user.water_scheme).last().dis_allow_edit:
					raise serializers.ValidationError('The closed month data editing is dis-allowed.')

		if self.user.water_scheme.system_date_format == 'en':
			date_en = str_to_datetime(attrs.get('date'))
			date_np = nepali_datetime.date.from_datetime_date(date_en)

			if Income.objects.filter(closed_date__month__gte = date_en.month,category__water_scheme = self.user.water_scheme).exists():
				if OtherExpenseInflationRate.objects.filter(water_scheme=self.user.water_scheme).last().dis_allow_edit:
					raise serializers.ValidationError('The closed month data editing is dis-allowed.')
		attrs['date_en'] = date_en
		attrs['date_np'] = date_np

		if self.user.water_scheme.tool_start_date > attrs.get('date_en'):
			raise serializers.ValidationError('Date should not be before tool start date')
		return attrs

	def create(self, validate_data, *args, **kwargs):
		return Income.objects.create(category = validate_data.get('category'),
			date = validate_data.get('date_en'),
			title = validate_data.get('title'),
			income_amount = validate_data.get('income_amount'),
			water_supplied = validate_data.get('water_supplied'),
			date_np = validate_data.get('date_np'))

	def update(self, instance, validate_data, *args, **kwargs):
		Income.objects.filter(id=instance.id).update(category = validate_data.get('category'),
			date = validate_data.get('date_en'),
			title = validate_data.get('title'),
			income_amount = validate_data.get('income_amount'),
			water_supplied = validate_data.get('water_supplied'),
			date_np = validate_data.get('date_np'))
		return Income.objects.get(id=instance.id)

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(IncomeCreateSerializer, self).to_representation(data)

		data['date_np'] = str(data.get('date_np'))
		if self.user.water_scheme.system_date_format == 'nep':
			data['date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['date'])))

		if lang == 'nep':
			data['income_amount'] = english_to_nepali_converter(str(data.get('income_amount')))
			data['water_supplied'] = english_to_nepali_converter(str(data.get('water_supplied')))
		return data

class ExpenseListSerializer(serializers.ModelSerializer):
	date_np = serializers.ReadOnlyField()
	category = ExpenseCategorySerializer(read_only = True)

	class Meta:
		model = Expenditure
		fields = ['id','category','date','title','income_amount','remarks','date_np']

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(ExpenseListSerializer, self).to_representation(data)

		scheme = self.context.get('request').parser_context.get('kwargs').get('water_scheme_slug')
		scheme = get_object_or_404(WaterScheme, slug=scheme)
		if scheme.system_date_format == 'nep':
			data['date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['date'])))

		if lang == 'nep':
			data['date_np'] = english_to_nepali_converter(data['date_np'])
			data['income_amount'] = english_to_nepali_converter(str(data.get('income_amount')))
		return data

class ExpenseCreateSerializer(serializers.ModelSerializer):
	date_np = serializers.ReadOnlyField()
	date = serializers.CharField()
	user=None
	class Meta:
		model = Expenditure
		fields = ['id','category','date','title','income_amount','labour_cost','consumables_cost','replacement_cost','remarks','date_np']

	def validate(self, attrs):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		if not lang in ('en', 'nep'):
			raise serializers.ValidationError('Language suhould be either en or nep')
		try:
			income_amount = attrs['income_amount']
			labour_cost = attrs['labour_cost']
			consumables_cost = attrs['consumables_cost']
			replacement_cost = attrs['replacement_cost']
		except:
			income_amount = attrs['income_amount']
			labour_cost = 0
			consumables_cost = 0
			replacement_cost = 0
		if len(str(income_amount).split('.')[-1])>2 or len(str(labour_cost).split('.')[-1])>2 or len(str(consumables_cost).split('.')[-1])>2 or len(str(replacement_cost).split('.')[-1])>2:
			raise serializers.ValidationError("Only Accept 2 digits after decimal point")

		if income_amount<0 or labour_cost<0 or consumables_cost<0 or replacement_cost<0:
			raise serializers.ValidationError("Negative value can't be entered.")

		self.user= get_object_or_404(Users, id= self.context['request'].user.id)
		if self.user.water_scheme.system_date_format == 'nep':
			date_en = convert_nep_date_to_english(str(attrs.get('date')))
			date_np = attrs.get('date')
			date_list = str(attrs.get('date')).split('-')
			month_range = get_month_range(int(date_list[0]), int(date_list[1]))

			if Expenditure.objects.filter(closed_date__gte = month_range.get('month_start'), closed_date__lte = month_range.get('month_end'), category__water_scheme = self.user.water_scheme).exists():
				if OtherExpenseInflationRate.objects.filter(water_scheme=self.user.water_scheme).last().dis_allow_edit:
					raise serializers.ValidationError('The closed month data editing is  dis-allowed.')

		if self.user.water_scheme.system_date_format == 'en':
			date_en = str_to_datetime(attrs.get('date'))
			date_np = nepali_datetime.date.from_datetime_date(date_en)

			if Expenditure.objects.filter(closed_date__month__gte = date_en.month,category__water_scheme = self.user.water_scheme).exists():
				if OtherExpenseInflationRate.objects.filter(water_scheme=self.user.water_scheme).last().dis_allow_edit:
					raise serializers.ValidationError('The closed month data editing is dis-allowed.')
	
		attrs['date_en'] = date_en
		attrs['date_np'] = date_np
		if self.user.water_scheme.tool_start_date > attrs.get('date_en'):
			raise serializers.ValidationError('Date should not be before tool start date')
		return attrs

	def create(self, validate_data, *args, **kwargs):
		return Expenditure.objects.create(category = validate_data.get('category'),
			date = validate_data.get('date_en'),
			title = validate_data.get('title'),
			income_amount = validate_data.get('income_amount'),
			labour_cost = validate_data.get('labour_cost'),
			consumables_cost = validate_data.get('consumables_cost'),
			replacement_cost = validate_data.get('replacement_cost'),
			remarks = validate_data.get('remarks'),
			date_np = validate_data.get('date_np'))

	def update(self, instance, validate_data, *args, **kwargs):
		Expenditure.objects.filter(id=instance.id).update(category = validate_data.get('category'),
			date = validate_data.get('date_en'),
			title = validate_data.get('title'),
			income_amount = validate_data.get('income_amount'),
			labour_cost = validate_data.get('labour_cost'),
			consumables_cost = validate_data.get('consumables_cost'),
			replacement_cost = validate_data.get('replacement_cost'),
			remarks = validate_data.get('remarks'),
			date_np = validate_data.get('date_np'))
		return Expenditure.objects.get(id=instance.id)

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(ExpenseCreateSerializer, self).to_representation(data)
		data['date_np'] = str(data.get('date_np'))
		if self.user.water_scheme.system_date_format == 'nep':
			data['date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['date'])))
		if lang == 'nep':
			data['income_amount'] = english_to_nepali_converter(str(data.get('income_amount')))
			data['labour_cost'] = english_to_nepali_converter(str(data.get('labour_cost')))
			data['consumables_cost'] = english_to_nepali_converter(str(data.get('consumables_cost')))
			data['material_cost'] = english_to_nepali_converter(str(data.get('material_cost')))
		return data

class CloseIncomeExpenseSerializer(serializers.ModelSerializer):
	image = serializers.ImageField(required=False)
	date = serializers.CharField()
	class Meta:
		model = CashBookClosingMonth
		fields = ['date','image']

class CashBookClosingMonthSerializer(serializers.ModelSerializer):
	date_np = serializers.ReadOnlyField()
	date = serializers.CharField()
	class Meta:
		model = CashBookClosingMonth
		fields = ['date','date_np']

	def to_representation(self, data):
		lang = self.context.get('request').parser_context.get('kwargs').get('lang')
		data = super(CashBookClosingMonthSerializer, self).to_representation(data)
		user_id = self.context['request'].user.id
		user = get_object_or_404(Users,id=user_id)
		if user.water_scheme.system_date_format == 'nep':
			data['date'] = str(nepali_datetime.date.from_datetime_date(str_to_datetime(data['date'])))

		if lang == 'nep':
			data['date_np'] = data['date']
			data['date'] = english_to_nepali_converter(data['date'])
		return data

class CashBookImageSerializer(serializers.ModelSerializer):
	class Meta:
		model = CashBookImage
		fields = ['image']