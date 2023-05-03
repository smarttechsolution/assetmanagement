from maintenance.models import ComponentInfo
from .serializers import *
from rest_framework.generics import (CreateAPIView,
	ListAPIView,
	RetrieveUpdateAPIView,
	DestroyAPIView,)
from rest_framework.views import APIView
from rest_framework import generics, status, views
from rest_framework.decorators import action
import datetime
import nepali_datetime
from rest_framework.response import Response
from ..models import Income,Expenditure
from rest_framework.permissions import IsAuthenticated
from .permission import IncomeDeletePermission,ExpenseDeletePermission
from rest_framework import viewsets
from users.api.permission import IsSchemeAdministrator, IsCareTaker
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from asset_management_system.utils import english_to_nepali_converter,get_week_day
from users.models import Users
from django.db.models import Sum, Avg
from config_pannel.models import WaterScheme,WaterSupplyRecord
from .utils import *
from django.db.models.functions import Round


class IncomeCategoryListView(ListAPIView):
	"""
	Income category list for care taker and Scheme administrator after login
	"""
	queryset = IncomeCategory.objects.all()
	serializer_class = IncomeCategorySerializer

	def get_queryset(self, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		return IncomeCategory.objects.filter(water_scheme = scheme)


class IncomeCategoryCreateView(CreateAPIView):
	"""Creating income category by scheme administrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = IncomeCategory.objects.all()
	serializer_class = IncomeCategorySerializer

	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return IncomeCategory.objects.filter(water_scheme__slug = user.water_scheme.slug)

class IncomeCategoryUpdateView(RetrieveUpdateAPIView):
	"""Updating income category by scheme administrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = IncomeCategory.objects.all()
	serializer_class = IncomeCategorySerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(IncomeCategory, id = self.kwargs['pk'],water_scheme__slug = user.water_scheme.slug)

class IncomeCategoryDeleteView(DestroyAPIView):
	"""Deleting income category by scheme admininstrator"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(IncomeCategory,id = self.kwargs['pk'],water_scheme = user.water_scheme)
	
	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		if instance.name == 'Water Sales':
			return Response({'error':'Cannot default category Water Sales.'}, status=status.HTTP_403_FORBIDDEN)
		try:
			self.perform_destroy(instance)
			return Response(status=status.HTTP_204_NO_CONTENT)
		except:
			return Response({'error':'Delete related income to delete this income category.'}, status=status.HTTP_403_FORBIDDEN)

class ExpenseCategoryListView(ListAPIView):
	"""Listing expenditure category"""
	queryset = ExpenseCategory.objects.all()
	serializer_class = ExpenseCategorySerializer

	def get_queryset(self):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		return ExpenseCategory.objects.filter(water_scheme = scheme)

class ExpenseCategoryCreateView(CreateAPIView):
	"""Creating expenditure category"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = ExpenseCategory.objects.all()
	serializer_class = ExpenseCategorySerializer

	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return ExpenseCategory.objects.filter(water_scheme__slug = user.water_scheme.slug)

class ExpenseCategoryUpdateView(RetrieveUpdateAPIView):
	"""Updating expenditure category"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = ExpenseCategory.objects.all()
	serializer_class = ExpenseCategorySerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ExpenseCategory, id = self.kwargs['pk'], water_scheme__slug = user.water_scheme.slug)

class ExpenseCategoryDeleteView(DestroyAPIView):
	"""Deleting Expenditure category"""
	permission_classes = [IsAuthenticated, IsSchemeAdministrator]
	queryset = ExpenseCategory.objects.all()
	serializer_class = ExpenseCategorySerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(ExpenseCategory,id = self.kwargs['pk'], water_scheme = user.water_scheme)
	
	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		if instance.name == 'Maintenance':
			return Response({'error':'Cannot default category Maintenance.'}, status=status.HTTP_403_FORBIDDEN)
		try:
			self.perform_destroy(instance)
			return Response(status=status.HTTP_204_NO_CONTENT)
		except:
			return Response({'error':'Delete related expenditure to delete this expenditure category.'}, status=status.HTTP_403_FORBIDDEN)


class IncomeListView(ListAPIView):
	"""
	Listing Income group by income category.
	By default current month data is sent in response.
	To get data of different month send query param month and year as below.
	
	# /income/nep/list/?year=2021&month=2
	year and month should be integer and should be valid year and month number 
	based on lang parameter sent.

	# for week view send query param---> week=True
	/income/nep/list/?week=True&start=2021-01-01&end=2021-01-28
	"""
	queryset = Income.objects.all()
	serializer_class = IncomeListSerializer

	def get_queryset(self):
		scheme = get_water_scheme(self.kwargs.get('water_scheme_slug'))
		week = self.request.GET.get('week',None)
		if week:
			current_week = get_week_day()
			start = self.request.GET.get('start',current_week.get('start'))
			end = self.request.GET.get('end', current_week.get('end'))
			week_start = datetime.datetime.strptime(str(start), '%Y-%m-%d').date()
			week_end = datetime.datetime.strptime(str(end), '%Y-%m-%d').date()

		if scheme.system_date_format == 'en':
			month = int(self.request.GET.get('month', datetime.date.today().month))
			year = int(self.request.GET.get('year', datetime.date.today().year))
			if week:
				return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'),date__gte=week_start, date__lt = week_end).order_by('date')
			return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__month = month, date__year = year).order_by('date')

		if scheme.system_date_format == 'nep':
			date_nep = nepali_datetime.date.today()
			month = int(self.request.GET.get('month', date_nep.month))
			year = int(self.request.GET.get('year', date_nep.year))
			month_range = get_month_range(year,month)
			if week:
				week_start = nepali_datetime.date(int(week_start.year),int(week_start.month),int(week_start.day)).to_datetime_date()
				week_end = nepali_datetime.date(week_end.year,week_end.month,week_end.day).to_datetime_date()
				return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=week_start, date__lt = week_end).order_by('date')
			return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte = month_range.get('month_start'), date__lte=month_range.get('month_end')).order_by('date')

class IncomeAllListdView(ListAPIView):
	"""
	query?date_from=2021-08-01&date_to=2021-08-01
	"""
	queryset = Income.objects.all()
	serializer_class = IncomeListSerializer

	def get_queryset(self):
		scheme = get_water_scheme(self.kwargs.get('water_scheme_slug'))
		date_from = self.request.GET.get('date_from',None)
		date_to = self.request.GET.get('date_to', None)

		if scheme.system_date_format == 'nep':
			if date_from:
				date_from = convert_nep_date_to_english(date_from)
			if date_to:
				date_to = convert_nep_date_to_english(date_to)
		if date_from and date_to:
			return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=date_from, date__lte = date_to).order_by('date')
		elif date_from and not date_to:
			return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date=date_from).order_by('date')
		else:
			return Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug')).order_by('date')

class ExpenseAllListdView(ListAPIView):
	"""
	query?date_from=2021-08-01&date_to=2021-08-01
	"""
	queryset = Expenditure.objects.all()
	serializer_class = ExpenseListSerializer

	def get_queryset(self):
		scheme = get_water_scheme(self.kwargs.get('water_scheme_slug'))
		date_from = self.request.GET.get('date_from',None)
		date_to = self.request.GET.get('date_to', None)

		if scheme.system_date_format == 'nep':
			if date_from:
				date_from = convert_nep_date_to_english(date_from)
			if date_to:
				date_to = convert_nep_date_to_english(date_to)
		if date_from and date_to:
			return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=date_from, date__lte = date_to).order_by('date')
		elif date_from and not date_to:
			return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date=date_from).order_by('date')
		else:
			return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug')).order_by('date')



class MonthIncomeTotal(APIView):
	"""
	Return previous and present month total income by income category.
	To get data of different month send query param month and year as below.
	
	# /present-previous-month/income-total/{lang}/?year=2021&month=2

	send same query param (year and month) value as in list income endpoint while switching year month
	"""
	# permission_classes = [IsAuthenticated, (IsCareTaker | IsSchemeAdministrator)]
	def get(self,request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		lang = self.kwargs.get('lang')
		if scheme.system_date_format == 'en':
			month = int(self.request.GET.get('month', datetime.date.today().month))
			year = int(self.request.GET.get('year', datetime.date.today().year))
			prev_year_month = get_prev_year_month(year,month)

			previous_month_income = Income.objects.filter(category__water_scheme = scheme,
				date__month = prev_year_month.get('prev_month'),
				date__year = prev_year_month.get('prev_year')).values('category__name').annotate(total_income_amount = Round(Sum('income_amount')))

			present_month_income = Income.objects.filter(category__water_scheme = scheme,
				date__month = month,
				date__year = year).values('category__name').annotate(total_income_amount = Round(Sum('income_amount')))

		if scheme.system_date_format == 'nep':
			date_nep = nepali_datetime.date.today()
			month = int(self.request.GET.get('month', date_nep.month))
			year = int(self.request.GET.get('year', date_nep.year))
			present_year_month_range = get_month_range(year, month)
			prev_year_month_range_np = get_prev_year_month_np(year,month)

			previous_month_income = Income.objects.filter(category__water_scheme = scheme,
				date__gte = prev_year_month_range_np.get('month_start'),
				date__lte = prev_year_month_range_np.get('month_end')).values('category__name').annotate(total_income_amount = Round((Sum('income_amount'))))

			present_month_income = Income.objects.filter(category__water_scheme = scheme,
				date__gte = present_year_month_range.get('month_start'),
				date__lte = present_year_month_range.get('month_end')).values('category__name').annotate(total_income_amount = Round(Sum('income_amount')))

		previous_month = []
		for i in previous_month_income:
			income_category = default_income_category(scheme,i.get('category__name'))
			if lang == 'nep':
				previous_month.append({'income_category_name':income_category,'total_income_amount':english_to_nepali_converter(round(i.get('total_income_amount')))})
			else:
				previous_month.append({'income_category_name':income_category,'total_income_amount':round(i.get('total_income_amount'))})

		present_month = []
		for i in present_month_income:
			income_category = default_income_category(scheme,i.get('category__name'))
			if lang == 'nep':
				present_month.append({'income_category_name':income_category,'total_income_amount':english_to_nepali_converter(round(i.get('total_income_amount')))})
			else:
				present_month.append({'income_category_name':income_category,'total_income_amount':round(i.get('total_income_amount'))})

		context = {'previous_month_data':previous_month,'present_month_data':present_month}
		return Response(context, status=status.HTTP_200_OK)


class IncomeCreateView(CreateAPIView):
	"""
	API to create income by care taker.
	custom parameter: lang     possible value: en or nep
	"""
	permission_classes = [IsAuthenticated]
	queryset = Income.objects.all()
	serializer_class = IncomeCreateSerializer

	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return Income.objects.filter(category__water_scheme__slug = user.water_scheme.slug)

class IncomeUpdateView(RetrieveUpdateAPIView):
	"""
	API to update income by care taker
	custom parameter: lang     possible value: en or nep
	"""
	permission_classes = [IsAuthenticated]
	queryset = Income.objects.all()
	serializer_class = IncomeCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Income,id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

class IncomeDeleteView(DestroyAPIView):
	"""Delete particular Income if particulat income is not closed and by caretaker"""
	permission_classes = [IsAuthenticated]
	queryset = Income.objects.all()
	serializer_class = IncomeCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Income,id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		dis_allow_edit = OtherExpenseInflationRate.objects.all().last()
		if instance.closed_date and dis_allow_edit.dis_allow_edit:
			return Response({'message':'The closed month data is not allowed to delete.'},status=status.HTTP_403_FORBIDDEN)
		self.perform_destroy(instance)
		return Response({'message':'Successfully deleted income.'},status=status.HTTP_204_NO_CONTENT)

class CloseIncomeExpenseView(APIView):
	"""Close income of particular year particular month"""
	queryset = CashBookClosingMonth.objects.all()
	permission_classes = [IsAuthenticated]
	serializer_class = CloseIncomeExpenseSerializer

	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return CashBookClosingMonth.objects.filter(water_scheme = user.water_scheme)

	def post(self, request, *args, **kwargs):
		lang = self.kwargs.get('lang')
		if not lang in ('en', 'nep'):
			return Response({'error':'Language suhould be either en or nep'}, status=status.HTTP_403_FORBIDDEN)

		date = request.data.get('date')
		if not date:
			return Response({'error':'Date required'}, status=status.HTTP_403_FORBIDDEN)

		import datetime
		date_date = datetime.datetime.strptime(date, '%Y-%m-%d').date()

		serializers = CloseIncomeExpenseSerializer(data = request.data)
		serializers.is_valid(raise_exception=True)

		user = get_object_or_404(Users, id = self.request.user.id)
		if user.water_scheme.system_date_format == 'nep':
			date_list = str(date_date).split('-')
			date_np =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
			date_en = date_np.to_datetime_date()
			month_range = get_month_range(int(date_list[0]), int(date_list[1]))

			if Income.objects.filter(date__gte=month_range.get('month_start'), date__lte = month_range.get('month_end'), closed_date__gte=month_range.get('month_start'), closed_date__lte = month_range.get('month_end')).exists():
				return Response({'error':'Transaction for this month has been already closed or your input is invalid.'}, status=status.HTTP_403_FORBIDDEN)

			date  = CashBookClosingMonth.objects.create(water_scheme = user.water_scheme, date = date_en)
			try:
				if self.request.data.getlist('image'):
					for i in self.request.data.getlist('image'):
						CashBookImage.objects.create(closing_date=date,image=i)
			except:
				pass
		else:
			if Income.objects.filter(date__year=date_date.year, date__month = date_date.month, closed_date__year=date_date.year, closed_date__month = date_date.month).exists():
				return Response({'error':'Transaction for this month has been already closed or your input is invalid.'}, status=status.HTTP_403_FORBIDDEN)

			date  = CashBookClosingMonth.objects.create(water_scheme = user.water_scheme, date = serializers.data.get('date'))
			try:
				if self.request.data.getlist('image'):
					for i in self.request.data.getlist('image'):
						CashBookImage.objects.create(closing_date=date,image=i)
			except:
				pass
		return Response({'data':serializers.data}, status=status.HTTP_200_OK)

class ExpenseListView(ListAPIView):
	"""Listing Expenditure group by expense category.
	By default current month data is sent in response.
	To get data of different month send query param month and year as below.
	
	# /expenditure/nep/list/?year=2021&month=2
	year and month should be integer and should be valid year and month number 
	based on lang parameter sent.

	for week view pass week parameter as --> week=True
	/expenditure/nep/list/?week=True&start=2021-01-01&end=2021-01-07
	"""
	# permission_classes = [IsAuthenticated, (IsCareTaker | IsSchemeAdministrator)]
	queryset = Expenditure.objects.all()
	serializer_class = ExpenseListSerializer

	def get_queryset(self):
		lang = self.kwargs.get('lang')
		scheme = get_water_scheme(self.kwargs.get('water_scheme_slug'))
		week = self.request.GET.get('week',None)
		if week:
			current_week = get_week_day()
			start = self.request.GET.get('start',current_week.get('start'))
			end = self.request.GET.get('end', current_week.get('end'))
			week_start = datetime.datetime.strptime(str(start), '%Y-%m-%d').date()
			week_end = datetime.datetime.strptime(str(end), '%Y-%m-%d').date()

		if scheme.system_date_format == 'en':
			month = int(self.request.GET.get('month', datetime.date.today().month))
			year = int(self.request.GET.get('year', datetime.date.today().year))
			if week:
				return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'),date__gte=week_start, date__lt = week_end).order_by('date')
			return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__month = month, date__year = year).order_by('date')

		if scheme.system_date_format == 'nep':
			date_nep = nepali_datetime.date.today()
			month = int(self.request.GET.get('month', date_nep.month))
			year = int(self.request.GET.get('year', date_nep.year))
			month_range = get_month_range(year,month)
			if week:
				week_start = nepali_datetime.date(int(week_start.year),int(week_start.month),int(week_start.day)).to_datetime_date()
				week_end = nepali_datetime.date(week_end.year,week_end.month,week_end.day).to_datetime_date()
				return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=week_start, date__lt = week_end).order_by('date')
			return Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte = month_range.get('month_start'), date__lte=month_range.get('month_end')).order_by('date')

class MonthExpenditureTotal(APIView):
	"""
	Return previous and present month total expenditure by income category.
	To get data of different month send query param month and year as below.
	# /present-previous-month/expenditure-total/<str:lang>/?year=2021&month=2

	send same query param (year and month) value as in list expenditure endpoint while switching year month
	"""
	# permission_classes = [IsAuthenticated, (IsCareTaker | IsSchemeAdministrator)]
	def get(self,request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		lang = self.kwargs.get('lang')
		if scheme.system_date_format == 'en':
			month = int(self.request.GET.get('month', datetime.date.today().month))
			year = int(self.request.GET.get('year', datetime.date.today().year))
			date_from = self.request.GET.get('date_from', None)
			date_to = self.request.GET.get('date_to', None)
			if date_from or date_to:
				if date_from and date_to:
					total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=date_from, date__lte = date_to).aggregate(total_expense=Sum('income_amount'))
				elif date_from and not date_to:
					total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date=date_from).aggregate(total_expense=Sum('income_amount'))
				else:
					total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug')).aggregate(total_expense=Sum('income_amount'))
				return Response(total, status=status.HTTP_200_OK)
			else:
				prev_year_month = get_prev_year_month(year,month)

				previous_month_income = Expenditure.objects.filter(category__water_scheme = scheme,
					date__month = prev_year_month.get('prev_month'),
					date__year = prev_year_month.get('prev_year')).values('category__name').annotate(total_expense_amount = Sum('income_amount'))

				present_month_income = Expenditure.objects.filter(category__water_scheme = scheme,
					date__month = month,
					date__year = year).values('category__name').annotate(total_expense_amount = Sum('income_amount'))

		if scheme.system_date_format == 'nep':
			date_nep = nepali_datetime.date.today()
			month = int(self.request.GET.get('month', date_nep.month))
			year = int(self.request.GET.get('year', date_nep.year))

			date_from = self.request.GET.get('date_from', None)
			date_to = self.request.GET.get('date_to', None)
			if date_from or date_to:
				if date_from and date_to:
					total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=date_from, date__lte = date_to).aggregate(total_expense=Sum('income_amount'))
				elif date_from and not date_to:
					total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date=date_from).aggregate(total_expense=Sum('income_amount'))
				else:
					total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug')).aggregate(total_expense=Sum('income_amount'))
				return Response(total, status=status.HTTP_200_OK)

			present_year_month_range = get_month_range(year, month)
			prev_year_month_range_np = get_prev_year_month_np(year,month)

			previous_month_income = Expenditure.objects.filter(category__water_scheme = scheme,
				date__gte = prev_year_month_range_np.get('month_start'),
				date__lte = prev_year_month_range_np.get('month_end')).values('category__name').annotate(total_expense_amount = Sum('income_amount'))

			present_month_income = Expenditure.objects.filter(category__water_scheme = scheme,
				date__gte = present_year_month_range.get('month_start'),
				date__lte = present_year_month_range.get('month_end')).values('category__name').annotate(total_expense_amount = Sum('income_amount'))

		previous_month = []
		for i in previous_month_income:
			expense_category = default_expense_category(scheme,i.get('category__name'))
			if lang == 'nep':
				previous_month.append({'expense_category_name':expense_category,'total_expense_amount':english_to_nepali_converter(i.get('total_expense_amount'))})
			else:
				previous_month.append({'expense_category_name':expense_category,'total_expense_amount':i.get('total_expense_amount')})

		present_month = []
		for i in present_month_income:
			expense_category = default_expense_category(scheme,i.get('category__name'))
			if lang == 'nep':
				present_month.append({'expense_category_name':expense_category,'total_expense_amount':english_to_nepali_converter(i.get('total_expense_amount'))})
			else:
				present_month.append({'expense_category_name':expense_category,'total_expense_amount':i.get('total_expense_amount')})

		context = {'previous_month_data':previous_month,'present_month_data':present_month}
		return Response(context, status=status.HTTP_200_OK)

class ExpenseCreateView(CreateAPIView):
	"""
	API to create income by care taker.
	custom parameter: lang possible value: en or nep
	"""
	permission_classes = [IsAuthenticated]
	queryset = Expenditure.objects.all()
	serializer_class = ExpenseCreateSerializer

	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return Expenditure.objects.filter(category__water_scheme__slug = user.water_scheme.slug)

class ExpenseUpdateView(RetrieveUpdateAPIView):
	"""
	API to update income by care taker
	custom parameter: lang     possible value: en or nep
	"""
	permission_classes = [IsAuthenticated]
	queryset = Expenditure.objects.all()
	serializer_class = ExpenseCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Expenditure,id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

class ExpenseDeleteView(DestroyAPIView):
	"""Delete particular expenditure if it is not closed and by caretaker"""
	permission_classes = [IsAuthenticated]
	queryset = Expenditure.objects.all()
	serializer_class = ExpenseCreateSerializer
	lookup_field = 'id'

	def get_object(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return get_object_or_404(Expenditure,id = self.kwargs['pk'],category__water_scheme__slug = user.water_scheme.slug)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		dis_allow_edit = OtherExpenseInflationRate.objects.all().last()
		if instance.closed_date and dis_allow_edit.dis_allow_edit:
			return Response({'message':'The closed month data is not allowed to delete.'},status=status.HTTP_403_FORBIDDEN)
		self.perform_destroy(instance)
		return Response({'message':'Successfully deleted expenditure.'},status=status.HTTP_204_NO_CONTENT)

class IncomeExpenditureReport(APIView):
	"""Api for income expenditure report with overall net balance beneficiary and supply
		By default all time report data is sent. 
		To get this year data send query param:-
		this_year=True
	"""

	# permission_classes = [IsAuthenticated, IsSchemeAdministrator]

	def get(self, request, *args, **kwargs):
		this_year = request.GET.get('this_year',None)
		lang = self.kwargs.get('lang')
		if lang not in ('en', 'nep'):
			return Response({'error':'Language option is either en or nep'}, status = status.HTTP_403_FORBIDDEN)	    
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		# start_year = scheme.system_operation_from.year
		# end_year = scheme.system_operation_to.year
		year_interval = scheme.year_interval.all().order_by('year_num')
		if this_year:
			this_year = datetime.date.today()
			year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year)

			for i in year_interval:
				if scheme.system_date_format == 'en':
					income = list(Income.objects.filter(category__water_scheme = scheme, date__gte = i.start_date, date__lte = i.end_date).order_by('date__year', 'date__month').values('date__year', 'date__month').annotate(total_amount = Round(Sum('income_amount'))))
					expense = list(Expenditure.objects.filter(category__water_scheme = scheme,date__gte = i.start_date, date__lte = i.end_date).order_by('date__year', 'date__month').values('date__year', 'date__month').annotate(total_amount = Round(Sum('income_amount'))))
					income_year_month = []
					for inc in income:
						year=inc.get('date__year')
						month=inc.get('date__month')
						income_year_month.append({'year':year,'month':month})
					expense_year_month = []
					for enc in expense:
						year=enc.get('date__year')
						month=enc.get('date__month')
						expense_year_month.append({'year':year,'month':month})
					
					not_in_expense = [{'date__year':i.get('year'), 'date__month':i.get('month'),'total_amount':0} for i in income_year_month if i not in expense_year_month]
					not_in_income = [{'date__year':i.get('year'), 'date__month':i.get('month'),'total_amount':0} for i in expense_year_month if i not in income_year_month]
					
					expense +=not_in_expense
					income +=not_in_income
					
					from operator import itemgetter
					income = sorted(income, key=itemgetter('date__year', 'date__month'))
					expense = sorted(expense, key=itemgetter('date__year', 'date__month'))
					
					each_year_income_list = []
					for i in income:
						each_year_income_list.append(i.get('total_amount'))
					
					each_year_expense_list = []
					for i in expense:
						each_year_expense_list.append(i.get('total_amount'))
					
					difference_income_expense = []
					zip_object = zip(each_year_income_list, each_year_expense_list)

					for list1_i, list2_i in zip_object:
						difference_income_expense.append(list1_i-list2_i)
					if difference_income_expense:
						cf=[difference_income_expense[0]]
						for i in range(1,len(difference_income_expense)):
							value=cf[i-1]+difference_income_expense[i]
							cf.append(value)

					actual_cf = []
					count = 0
					for i in income:
						data = {}
						data['date__year'] = i.get('date__year')
						data['date__month'] = i.get('date__month')
						data['cf'] = cf[count]
						actual_cf.append(data)
						count += 1
				else:
					from itertools import groupby
					income_list = list(Income.objects.filter(category__water_scheme = scheme, date__gte = i.start_date, date__lte = i.end_date).order_by('date__year', 'date__month').values('date_np', 'income_amount'))
					income_list.sort(key=lambda x:x['date_np'][:7])
					income = []
					for k,v in groupby(income_list, key=lambda x:x['date_np'][:7]):
						total_amount = 0
						for j in list(v):
							total_amount += j.get('income_amount')
						income.append({'date__year':k[0:4],'date__month':k[5:7],'total_amount':round(total_amount,0)})
					expense_list = list(Expenditure.objects.filter(category__water_scheme = scheme, date__gte = i.start_date, date__lte = i.end_date).order_by('date__year', 'date__month').values('date_np', 'income_amount'))
					expense_list.sort(key=lambda x:x['date_np'][:7])
					expense = []
					for k,v in groupby(expense_list,key=lambda x:x['date_np'][:7]):
						total_amount = 0
						for i in list(v):
							total_amount += i.get('income_amount')
						expense.append({'date__year':k[0:4],'date__month':k[5:7],'total_amount':round(total_amount,0)})

					income_year_month = []
					for inc in income:
						year=inc.get('date__year')
						month=inc.get('date__month')
						income_year_month.append({'year':year,'month':month})
					expense_year_month = []
					for enc in expense:
						year=enc.get('date__year')
						month=enc.get('date__month')
						expense_year_month.append({'year':year,'month':month})
					
					not_in_expense = [{'date__year':i.get('year'), 'date__month':i.get('month'),'total_amount':0} for i in income_year_month if i not in expense_year_month]
					not_in_income = [{'date__year':i.get('year'), 'date__month':i.get('month'),'total_amount':0} for i in expense_year_month if i not in income_year_month]
					
					expense +=not_in_expense
					income +=not_in_income
					
					from operator import itemgetter
					income = sorted(income, key=itemgetter('date__year', 'date__month'))
					expense = sorted(expense, key=itemgetter('date__year', 'date__month'))
					
					each_year_income_list = []
					for i in income:
						amount = i.get('total_amount')
						if not amount:
							amount = 0
						each_year_income_list.append(amount)
					
					each_year_expense_list = []
					for i in expense:
						amount = i.get('total_amount')
						if not amount:
							amount = 0
						each_year_expense_list.append(amount)
					
					difference_income_expense = []
					zip_object = zip(each_year_income_list, each_year_expense_list)

					for list1_i, list2_i in zip_object:
						difference_income_expense.append(list1_i-list2_i)
					try:
						cf=[difference_income_expense[0]]
					except:
						cf=0
					for i in range(1,len(difference_income_expense)):
						value=cf[i-1]+difference_income_expense[i]
						cf.append(value)

					actual_cf = []
					count = 0
					for i in income:
						data = {}
						data['date__year'] = i.get('date__year')
						data['date__month'] = i.get('date__month')
						data['cf'] = cf[count]
						actual_cf.append(data)
						count += 1
		else:
			income = []
			expense = []
			each_year_income_list = []
			each_year_expense_list = []
			for i in year_interval:
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = start_date+timedelta(days=1)
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))

				total_amount = Income.objects.filter(category__water_scheme = scheme, date__gte = i.start_date, date__lte = i.end_date).aggregate(Sum('income_amount')).get('income_amount__sum')
				if total_amount is None:
					total_amount = 0
				each_year_income_list.append(total_amount)
				income.append({'year_from':start_date, 'year_to':end_date, 'year_num':i.year_num, 'total_amount':round(total_amount,0)})

				total_amount = Expenditure.objects.filter(category__water_scheme = scheme, date__gte = i.start_date, date__lte = i.end_date).aggregate(Sum('income_amount')).get('income_amount__sum')
				if total_amount is None:
					total_amount = 0
				each_year_expense_list.append(total_amount)
				expense.append({'year_from':start_date, 'year_to':end_date, 'year_num':i.year_num, 'total_amount':round(total_amount,0)})
			difference_income_expense = []
			zip_object = zip(each_year_income_list, each_year_expense_list)

			for list1_i, list2_i in zip_object:
				difference_income_expense.append(list1_i-list2_i)

			cf=[difference_income_expense[0]]
			for i in range(1,len(difference_income_expense)):
				value=cf[i-1]+difference_income_expense[i]
				cf.append(value)

			actual_cf = []
			count = 0
			for i in year_interval:
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))
				data = {}
				data['date_from'] = start_date
				data['date_to'] = end_date
				data['cf'] = round(cf[count],2)
				actual_cf.append(data)
				count += 1

		net_income = Income.objects.filter(category__water_scheme =scheme, date__year__gte = scheme.tool_start_date.year).aggregate(Sum('income_amount')).get('income_amount__sum')
		net_expense = Expenditure.objects.filter(category__water_scheme =scheme, date__year__gte = scheme.tool_start_date.year).aggregate(Sum('income_amount')).get('income_amount__sum')
		
		if net_income and net_expense:
			net_balance = net_income - net_expense

		elif net_income and not net_expense:
			net_balance = net_income
			net_expense = 0

		elif  net_expense and not net_income:
			net_balance = -net_expense
			net_income = 0
		else:
			net_balance = 0
			net_income = 0
			net_expense = 0
		
		data = {'income':income,
			'expense':expense,
			'cf':actual_cf,
			'net_income': round(net_income,2),
			'net_expense': round(net_expense,2),
			'net_balance': round(net_balance,2),
			# 'total_population':scheme.beneficiary_population_total,
			'house_hold':scheme.household_connection_total,
			'public_connection':scheme.public_connection_total,
			'instutions':scheme.institutional_connection_total,
			'commercial_connection':scheme.commercial_connection_total,
			'daily_avg_supply':round(scheme.daily_target,2)}
	
		if lang == 'nep':
			data['net_income'] = english_to_nepali_converter(net_income)
			data['net_expense'] = english_to_nepali_converter(net_expense)
			data['net_balance'] = english_to_nepali_converter(net_balance)
			# data['total_population'] = english_to_nepali_converter(data['total_population'])
			data['house_hold'] = english_to_nepali_converter(data['house_hold'])
			data['public_connection'] = english_to_nepali_converter(data['public_connection'])
			data['instutions'] = english_to_nepali_converter(data['instutions'])
			data['commercial_connection'] = english_to_nepali_converter(data['commercial_connection'])
			data['daily_avg_supply'] = english_to_nepali_converter(data['daily_avg_supply'])
		return Response(data = data, status = status.HTTP_200_OK)

class IncomeDistributionReportByCategory(APIView):
	"""Income distribution by category used in pie chart"""
	# permission_classes = [IsAuthenticated, IsSchemeAdministrator]

	def get(self, request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		this_year = datetime.date.today()
		this_year_interval = scheme.year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()

		income_this_year = list(Income.objects.filter(category__water_scheme = scheme, date__gte = this_year_interval.start_date, date__lte = this_year_interval.end_date).values('category__name').annotate(total_amount = Round(Sum('income_amount'))))
		income_all_time = list(Income.objects.filter(category__water_scheme = scheme).values('category__name').annotate(total_amount = Round(Sum('income_amount'))))

		total_income = 0
		for i in income_all_time:
			total_income += i.get('total_amount')

		data = {'income_this_year':income_this_year,
		'income_all_time':income_all_time,
		'total_income':round(total_income,2),
		}
		return Response(data = data, status = status.HTTP_200_OK)

class ExpenseDistributionReportByCategory(APIView):
	"""Expense distrbution by category user in pie chart"""
	# permission_classes = [IsAuthenticated, IsSchemeAdministrator]

	def get(self, request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		this_year = datetime.date.today()
		this_year_interval = scheme.year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()

		expense_this_year = list(Expenditure.objects.filter(category__water_scheme = scheme, date__gte = this_year_interval.start_date, date__lte = this_year_interval.end_date).values('category__name').annotate(total_amount = Round(Sum('income_amount'))))
		expense_all_time = list(Expenditure.objects.filter(category__water_scheme =  scheme).values('category__name').annotate(total_amount = Round(Sum('income_amount'))))

		total_expense = 0
		for i in expense_all_time:
			total_expense += i.get('total_amount')

		data = {'expense_this_year':expense_this_year,
		'expense_all_time':expense_all_time,
		'total_expense':round(total_expense, 2),}
		return Response(data = data, status = status.HTTP_200_OK)

def nth_year_nth_month_inflation(year_num,maintenance_cost_list, other_expense_list, monthly_other_expense_list, inflation_rate):
	# inflationable_cost = maintenance_cost + other_expense + monthly_other_expense
	
	inflation_amount = maintenance_cost_list[0] + other_expense_list[0] +monthly_other_expense_list[0]
	try:
		rate_inflation = inflation_rate.rate
	except:
		rate_inflation = 0
	for i in range(year_num-1):
		inflation_amount =  inflation_amount + inflation_amount * (rate_inflation/100) + maintenance_cost_list[i+1] + other_expense_list[i+1] +monthly_other_expense_list[i+1]
	return inflation_amount 


from config_pannel.models import WaterTeriff,OtherExpense,OtherExpenseInflationRate
from django.db.models import Q
class ExpectedIncomeExpenseCumulativeCashReport(APIView):
	"""Expected Cumulative cash flow report use in finance visualization"""
	def get(self, request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		year_interval = scheme.year_interval.all().order_by('year_num')

		this_year = request.GET.get('this_year')
		if this_year:
			this_year = datetime.datetime.today()
			year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()
			months = get_month_range_in_list(year_interval, scheme.system_date_format)
			inflation_rate = OtherExpenseInflationRate.objects.filter(water_scheme=scheme).last()
			#other expense of month
<<<<<<< HEAD
			other_expense = OtherExpense.objects.filter(Q(water_scheme = scheme)& Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=False) & Q(category='Expenditure')).aggregate(Sum('yearly_expense'))
			other_expense = other_expense.get('yearly_expense__sum')
			if not other_expense:
				other_expense = 0
			else:
				other_expense = round(other_expense / 12,0)
			
			#other income of month
			other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=False) & Q(category='Income')).aggregate(Sum('yearly_expense'))
			other_income = other_income.get('yearly_expense__sum')
			if not other_income:
				other_income = 0
			else:
=======
			# other_expense = OtherExpense.objects.filter(Q(water_scheme = scheme)& Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=False) & Q(category='Expenditure')).aggregate(Sum('yearly_expense'))
			# other_expense = other_expense.get('yearly_expense__sum')
			# if not other_expense:
			# 	other_expense = 0
			# else:
			# 	other_expense = round(other_expense / 12,0)
			
			#other income of month
			# other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=False) & Q(category='Income')).aggregate(Sum('yearly_expense'))
			# other_income = other_income.get('yearly_expense__sum')

			# #soyy-> specific date one time, yes yes
			# soyy = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))
			
			# # #soyn -> specific date one time, yes no
			# soyn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False)).aggregate(Sum('yearly_expense'))

			# #sony = specific date one time, no yes
			sony = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year__in=[year_interval.end_date.year, year_interval.start_date.year]) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))

			# #sonn = specific date one time, no no
			sonn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(category='Income') & Q(apply_date__lte = year_interval.end_date) & Q(apply_for_specific_date = False) & Q(one_time_cost = False)).aggregate(Sum('yearly_expense'))
			sonn_inc = sonn.get('yearly_expense__sum')
			if sonn_inc is None:
				sonn_inc = 0
			sony_inc = sony.get('yearly_expense__sum')
			if sony_inc is None:
				sony_inc =0
			other_income = sonn_inc+sony_inc
			if other_income>0:
>>>>>>> ams-final
				other_income = round(other_income / 12,0)

			# if not other_income:
			# 	other_income = 0
			# else:

			# #sony = specific date one time, no yes
			sony_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year__in=[year_interval.end_date.year, year_interval.start_date.year]) & Q(category='Expenditure') & Q(apply_for_specific_date = False) & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))
			# #sonn = specific date one time, no no
			sonn_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(category='Expenditure') & Q(apply_date__lte = year_interval.end_date) & Q(apply_for_specific_date = False) & Q(one_time_cost = False)).aggregate(Sum('yearly_expense'))

			sony_exp = sony_expense.get('yearly_expense__sum')
			sonn_exp = sonn_expense.get('yearly_expense__sum')
			
			if sony_exp is None:
				sony_exp = 0

			if sonn_exp is None:
				sonn_exp = 0

			other_expense = sony_exp+sonn_exp
			if other_expense>0:
				other_expense = round(other_expense / 12,0)
		

			
			# other_expense = other_expense.get('yearly_expense__sum')
			# if not other_expense:
			# 	other_expense = 0
			# else:
			# 	other_expense = round(other_expense / 12,0)

			monthly_income = []
			monthly_expense = []
			monthly_cf = []
			pcf = 0
			mc = 0
			# apply_dates = set()
			for month in months:
				if scheme.system_date_format == 'nep':
					month_start = month.get('month_start')
					month_end = month.get('month_end')
<<<<<<< HEAD
					maintenance_cost = ComponentInfo.get_maintenance_cost(scheme,month_start,month_end,year_interval)
					monthly_other_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=True) & Q(category='Expenditure')).values('apply_date','yearly_expense')
					for data in monthly_other_expense:
						apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
						data['apply_date'] = apply_date
				
					monthly_other_expense_list = []
					for data in monthly_other_expense:
						monthly_other_expense_list.append({'apply_date':data.get('apply_date'),'yearly_expense':data.get('yearly_expense')})
=======

					# try:
					# 	prev = sorted(list(apply_dates))[:-1]
					# except:
					# 	prev = 0
>>>>>>> ams-final
					
					maintenance_cost = ComponentInfo.get_maintenance_cost(scheme,month_start,month_end,year_interval)
					# for ds in apply_date:
					# 	apply_dates.add(ds)
					# monthly_other_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=True) & Q(category='Expenditure')).values('apply_date','yearly_expense') 
					# monthly_other_expense = soyy | soyn | sony | sonn

					# for data in monthly_other_expense:
					# 	apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
					# 	data['apply_date'] = apply_date
				

					# monthly_other_expense_list = []
					# for data in monthly_other_expense:
					# 	monthly_other_expense_list.append({'apply_date':data.get('apply_date'),'yearly_expense':data.get('yearly_expense')})
					

					# monthly_other_expense = 0
					# for expense in monthly_other_expense_list:
					# 	if expense.get('apply_date') >= month_start and expense.get('apply_date') <= month_end:
					# 		monthly_other_expense += expense.get('yearly_expense')
					
					#one time cost
					# monthly_one_time_cost = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(one_time_cost=True) & Q(category='Expenditure')).values('apply_date','yearly_expense')
					# for data in monthly_one_time_cost:
					# 	apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
					# 	data['apply_date'] = apply_date
					
					# monthly_one_time_cost_list = []
					# for data in monthly_one_time_cost:
					# 	monthly_one_time_cost_list.append({'apply_date':data.get('apply_date'),'yearly_expense':data.get('yearly_expense')})
					
					# monthly_one_time_cost_exp = 0
					# for expense in monthly_one_time_cost_list:
					# 	if expense.get('apply_date') >= month_start and expense.get('apply_date') <= month_end:
					# 		monthly_one_time_cost_exp += expense.get('yearly_expense')

					#for other income calculation
<<<<<<< HEAD
					monthly_other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=True) & Q(category='Income')).values('apply_date','yearly_expense')
					for data in monthly_other_income:
						apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
						data['apply_date'] = apply_date
=======
					# monthly_other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=True) & Q(category='Income')).values('apply_date','yearly_expense')
					# for data in monthly_other_income:
					# 	apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
					# 	data['apply_date'] = apply_date
>>>>>>> ams-final
					
					# monthly_other_income_list = []
					# for data in monthly_other_income:
					# 	monthly_other_income_list.append({'apply_date':data.get('apply_date'),'yearly_income':data.get('yearly_expense')})
					
					# monthly_other_income = 0
					# for income in monthly_other_income_list:
					# 	if income.get('apply_date') >= month_start and income.get('apply_date') <= month_end:
					# 		monthly_other_income += income.get('yearly_income')
					
					# =================================
					# #soyn -> specific date one time, yes no
					# soyn_start_date = year_interval.start_date.replace(year = year_interval.start_date.year+year_interval.year_num-1)
					# soyn_end_date = year_interval.end_date.replace(year = year_interval.end_date.year+year_interval.year_num-1)
					soyn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False)).values('apply_date','yearly_expense')
					soyn_month_income = 0
					for i in soyn:
						soyn_month_start = month_start.replace(year = i.get('apply_date').year)
						soyn_mont_end = month_end.replace(year = i.get('apply_date').year)
						if i.get('apply_date') >= soyn_month_start and i.get('apply_date') < soyn_mont_end:
							soyn_month_income += i.get('yearly_expense')

					soyy = OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__lte=month_end) & Q(apply_date__gte=month_start) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).values('apply_date', 'yearly_expense')
					soyy_month_income = 0
					for data in soyy:#monthly_other_income:
						soyy_month_income += data.get('yearly_expense')
					
					soyn_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = False)).values('apply_date','yearly_expense')
					soyn_month_expense = 0
					for i in soyn_expense:
						soyn_month_start = month_start.replace(year = i.get('apply_date').year)
						soyn_mont_end = month_end.replace(year = i.get('apply_date').year)
						if i.get('apply_date') >= soyn_month_start and i.get('apply_date') < soyn_mont_end:
							soyn_month_expense += i.get('yearly_expense')
					soyy_expense =  OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__lte=month_end) & Q(apply_date__gte=month_start) & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).values('apply_date', 'yearly_expense')
					soyy_month_expense = 0
					for data in soyy_expense:#monthly_other_income:
						soyy_month_expense += data.get('yearly_expense')

					monthly_one_time_cost_exp = soyn_month_expense+soyy_month_expense+other_expense
					# #one time cost income
					# monthly_one_time_cost_inc = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(one_time_cost=True) & Q(category='Income')).values('apply_date','yearly_expense')
					# for data in monthly_one_time_cost_inc:

						# apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
						# data['apply_date'] = apply_date

					# monthly_one_time_cost_inc_list = []
					# for data in monthly_one_time_cost_inc:
					# 	monthly_one_time_cost_inc_list.append({'apply_date':data.get('apply_date'),'yearly_income':data.get('yearly_expense')})
					
					# monthly_one_time_cost_inc = 0
					# for income in monthly_one_time_cost_inc_list:
					# 	if income.get('apply_date') >= month_start and income.get('apply_date') <= month_end:
					# 		monthly_one_time_cost_inc += income.get('yearly_income')
					total_monthly_income =  other_income+soyn_month_income+soyy_month_income
					tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) &
							Q(
								Q(
									Q(apply_date__lte = month.get('month_start')) #&
									#Q(apply_upto__gte = month.get('month_start'))
								) |
								Q(
									Q(apply_date__lte = month.get('month_start')) & Q(apply_upto = None)
								)
							)
						).last()
					scheme_data = scheme.water_scheme_data.filter(Q(
						Q(Q(apply_date__lte = month.get('month_start'))) #&
						# Q(Q(apply_upto__gte = month.get('month_start')))
						) |
						Q(Q(apply_date__lte = month.get('month_start')) & Q(apply_upto = None))).last()
					
				else:
					# month_start = month.get('month_start')
					# month_end = month.get('month_end')
					# try:
					# 	prev = sorted(list(apply_dates))[:-1]
					# except:
					# 	prev = 0
					
					maintenance_cost = ComponentInfo.get_maintenance_cost(scheme,month,month,year_interval)

					# for ds in apply_date:
					# 	apply_dates.add(ds)
					
					# monthly_other_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__month=month.get('month')) & Q(apply_for_specific_date=True) & Q(category='Expenditure')).aggregate(Sum('yearly_expense'))
					# monthly_other_expense = monthly_other_expense.get('yearly_expense__sum')
					# if not monthly_other_expense:
					# 	monthly_other_expense = 0
					
					# monthly_one_time_cost_exp = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__month=month.get('month')) & Q(one_time_cost=True) & Q(category='Expenditure')).aggregate(Sum('yearly_expense'))
					# monthly_one_time_cost_exp = monthly_one_time_cost_exp.get('yearly_expense__sum')
					# if not monthly_one_time_cost_exp:
					# 	monthly_one_time_cost_exp = 0

<<<<<<< HEAD
					monthly_other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year=month.get('year'))& Q(apply_date__month=month.get('month')) & Q(apply_for_specific_date=True) & Q(category='Income')).aggregate(Sum('yearly_expense'))
					monthly_other_income = monthly_other_income.get('yearly_expense__sum')
					if not monthly_other_income:
						monthly_other_income = 0
=======
					# monthly_other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year=month.get('year'))& Q(apply_date__month=month.get('month')) & Q(apply_for_specific_date=True) & Q(category='Income')).aggregate(Sum('yearly_expense'))
					# monthly_other_income = monthly_other_income.get('yearly_expense__sum')
					# if not monthly_other_income:
					# 	monthly_other_income = 0
>>>>>>> ams-final

					# monthly_one_time_cost_inc = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__month=month.get('month')) & Q(one_time_cost=True) & Q(category='Income')).aggregate(Sum('yearly_expense'))
					# monthly_one_time_cost_inc = monthly_one_time_cost_inc.get('yearly_expense__sum')
					# if not monthly_one_time_cost_inc:
					# 	monthly_one_time_cost_inc = 0	

					"""Income Calculation for english date"""
					soyn_income = OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__month=month.get('month')) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False)).values('apply_date','yearly_expense')
					soyn_month_income = 0
					for data in soyn_income:#monthly_other_income:
						soyn_month_income+= data.get('yearly_expense')
					soyy_income =  OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__year=month.get('year')) & Q(apply_date__month=month.get('month')) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).values('apply_date', 'yearly_expense')
					soyy_month_income = 0
					for data in soyy_income:#monthly_other_income:
						soyy_month_income += data.get('yearly_expense')
					monthly_one_time_cost_inc = soyn_month_income+soyy_month_income
					total_monthly_income = other_income+monthly_one_time_cost_inc

					"""Expenses calculation for english date"""
					soyn_expense = OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__month=month.get('month')) & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = False)).values('apply_date','yearly_expense')
					soyn_month_expense = 0
					for data in soyn_expense:#monthly_other_income:
						soyn_month_expense += data.get('yearly_expense')

					# soyy_expense =  OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__lte=month_end) & Q(apply_date__gte=month_start) & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).values('apply_date', 'yearly_expense')
					soyy_expense =  OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__year=month.get('year')) & Q(apply_date__month=month.get('month'))  & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).values('apply_date', 'yearly_expense')
					soyy_month_expense = 0
					for data in soyy_expense:#monthly_other_income:
						soyy_month_expense += data.get('yearly_expense')
						
					monthly_one_time_cost_exp = soyn_month_expense+soyy_month_expense+other_expense  #monthly_other_income + other_income + monthly_one_time_cost_inc
					"""tarriffs data"""
					date = datetime.date(month.get('year'),month.get('month'),1)
					tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) &
							Q( 
								Q(
									Q(apply_date__lte = date) #&
									# Q(apply_upto__gte = date)
								) |
								Q(
									Q(apply_date__lte = date) & Q(apply_upto = None)
								)
							)
						).last()
					scheme_data = scheme.water_scheme_data.filter(Q(
					Q(Q(apply_date__lte = date)) #&
					# Q(Q(apply_upto__gte = date))
					) |
<<<<<<< HEAD
					Q(Q(apply_date__lte = date) & Q(apply_upto = None)))

					
				
				try:
					household_connection = scheme_data[0].household_connection
					institutional_connection = scheme_data[0].institutional_connection
					commercial_connection = scheme_data[0].commercial_connection
					public_connection = scheme_data[0].public_connection
=======
					Q(Q(apply_date__lte= date) & Q(apply_upto = None))).last()
				try:
					household_connection = scheme_data.household_connection
					institutional_connection = scheme_data.institutional_connection
					commercial_connection = scheme_data.commercial_connection
					public_connection = scheme_data.public_connection
>>>>>>> ams-final
				except:
					household_connection = 0
					institutional_connection = 0
					commercial_connection = 0 
					public_connection = 0
<<<<<<< HEAD
				
				try:
					if tariffs and tariffs[0].terif_type == 'Fixed':
						print('safdasdf,===')
						income = (
									(
									  (tariffs[0].estimated_paying_connection_household/100) * tariffs[0].rate_for_household * household_connection
									)+
									(
									  (tariffs[0].estimated_paying_connection_institution/100) * tariffs[0].rate_for_institution * institutional_connection
									)+
									(
									  (tariffs[0].estimated_paying_connection_public/100) * tariffs[0].rate_for_public * public_connection
									)+
									(
									  (tariffs[0].estimated_paying_connection_commercial/100) * tariffs[0].rate_for_commercial * commercial_connection
									)
								)
						print('asfdasdf')
=======
				try:
					if tariffs and tariffs.terif_type == 'Fixed':
						income = (
									(
									  (tariffs.estimated_paying_connection_household/100) * tariffs.rate_for_household * household_connection
									)+
									(
									  (tariffs.estimated_paying_connection_institution/100) * tariffs.rate_for_institution * institutional_connection
									)+
									(
									  (tariffs.estimated_paying_connection_public/100) * tariffs.rate_for_public * public_connection
									)+
									(
									  (tariffs.estimated_paying_connection_commercial/100) * tariffs.rate_for_commercial * commercial_connection
									)
								)
>>>>>>> ams-final
						income +=total_monthly_income
						print(income,'-----')
						monthly_income.append({'year':month.get('year'),'month':month.get('month'),'income': round(income,0)})
				
<<<<<<< HEAD
					elif tariffs and tariffs[0].terif_type == 'Use Based':
						total_connection = household_connection + institutional_connection+commercial_connection+public_connection
=======
					elif tariffs and tariffs.terif_type == 'Use Based':
						total_households = household_connection + institutional_connection+commercial_connection+public_connection
>>>>>>> ams-final
						income =  0
						# for j in tariffs[0].used_based_units.order_by("unit_to"):
						# 	if j.unit_from <=0:
						# 		income += j.rate * ((j.estimated_paying_connection/100) * total_connection)
						# 	else:
						# 		income+=  ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_connection)

						rate_to_be_applied_in_next_iter = []
						for j in tariffs.used_based_units.order_by("unit_to"):
							if j.unit_from <=0:
<<<<<<< HEAD
								income += j.rate * ((j.estimated_paying_connection/100) * total_connection)
							else:	
								income+=  ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_connection)
=======
								income += j.rate * ((j.estimated_paying_connection/100) * total_households)
								rate_to_be_applied_in_next_iter.append((j.rate * total_households))
							else:
								for z in rate_to_be_applied_in_next_iter:
									income += (j.estimated_paying_connection/100) * z
								income+= ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_households)
								rate_to_be_applied_in_next_iter.append(((j.unit_to - j.unit_from)+1) * j.rate *total_households)

>>>>>>> ams-final
						income += total_monthly_income
						monthly_income.append({'year':month.get('year'),'month':month.get('month'),'income': round(income,0),'monthly_other_income':total_monthly_income}) #monthly_other_income
					else:
						income = total_monthly_income
					mc+=maintenance_cost
				except:
					income = total_monthly_income
					monthly_income.append({'year':month.get('year'),'month':month.get('month'),'income': income})
<<<<<<< HEAD
				
				inflationable_cost = other_expense+ monthly_other_expense + maintenance_cost
=======
				inflationable_cost = monthly_one_time_cost_exp+maintenance_cost #other_expense + 
>>>>>>> ams-final
				try:
					_rate_inflation = inflation_rate.rate
				except:
					_rate_inflation = 0
<<<<<<< HEAD
				total_expense =inflationable_cost*(pow(1+(_rate_inflation/100),year_interval.year_num-1)) + monthly_one_time_cost_exp
=======
				total_expense =inflationable_cost*(pow(1+(_rate_inflation/100),year_interval.year_num-1))#+maintenance_cost #+ monthly_one_time_cost_exp
>>>>>>> ams-final
				monthly_expense.append({'year':month.get('year'),'month':month.get('month'),'expense': round(total_expense,0)})
				cf = pcf+(income-total_expense)
				pcf=cf
				monthly_cf.append({'year':month.get('year'),'month':month.get('month'),'cf': round(cf,0)})
			
			mc+=maintenance_cost
			data ={'monthly_income':monthly_income,
			'monthly_expense':monthly_expense,
			'monthly_cf':monthly_cf}
		else: 
			income_list_val = []
			income_list = []
			for i in year_interval:
<<<<<<< HEAD
				other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=i.start_date) & Q(apply_date__lte=i.end_date) & Q(category='Income') & Q(apply_for_specific_date = True)).aggregate(Sum('yearly_expense'))
				other_income = other_income.get('yearly_expense__sum')
				if not other_income:
					other_income = 0

				one_time_cost = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date) & Q(category='Income') & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))
				one_time_cost = one_time_cost.get('yearly_expense__sum')
				if not one_time_cost:
					one_time_cost = 0

=======
>>>>>>> ams-final
				start_date = i.start_date
				end_date =i.end_date
				if scheme.system_date_format == 'nep':
					start_date = start_date+timedelta(days=1)
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))

				#soyy-> specific date one time, yes yes
				soyy = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=i.start_date) & Q(apply_date__lte=i.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True))
				#soyn -> specific date one time, yes no
				soyn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False))
				#sony = specific date one time, no yes
				sony = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date)& Q(apply_date__year__in=[i.end_date.year, i.start_date.year]) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = True))
				#sonn = specific date one time, no no
				sonn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(category='Income') & Q(apply_date__lte = i.end_date) & Q(apply_for_specific_date = False) & Q(one_time_cost = False))
				all_queries = soyy | soyn | sony | sonn
				other_income = all_queries.aggregate(Sum('yearly_expense'))
				other_income = other_income.get('yearly_expense__sum')
	
				if not other_income:
					other_income = 0

				# other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=i.start_date) & Q(apply_date__lte=i.end_date) & Q(category='Income') & Q(apply_for_specific_date = True)).aggregate(Sum('yearly_expense'))
				# other_income = other_income.get('yearly_expense__sum')
				# if not other_income:
				# 	other_income = 0

				# one_time_cost = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date) & Q(category='Income') & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))
				# one_time_cost = one_time_cost.get('yearly_expense__sum')
				# if not one_time_cost:
				# 	one_time_cost = 0


				months = get_month_range_in_list(i, scheme.system_date_format)
				year_total_income = other_income #+ one_time_cost
				for month in months:
					if scheme.system_date_format == 'nep':
						tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) &
							Q(
								Q(
									Q(apply_date__lte = month.get('month_start')) #&
									# Q(apply_upto__gte = month.get('month_start')
									# )
								) |
								Q(
									Q(apply_date__lte = month.get('month_start')) & Q(apply_upto = None)
								)
							)
						).last()
						scheme_data = scheme.water_scheme_data.filter(Q(
						Q(Q(apply_date__lte = month.get('month_start'))) #&
						# Q(Q(apply_upto__gte = month.get('month_start')))
						) |
						Q(Q(apply_date__lte = month.get('month_start')) & Q(apply_upto = None))).last()
					else:
						date = datetime.date(month.get('year'),month.get('month'),1)
						tariffs=WaterTeriff.objects.filter(Q(water_scheme=scheme) &
							Q(
								Q(
									Q(apply_date__lte = date) #&
									# Q(apply_upto__gte = date)
								) |
								Q(
									Q(apply_date__lte = date) & Q(apply_upto = None)
								)
							)
						).last()
						scheme_data = scheme.water_scheme_data.filter(Q(
						Q(Q(apply_date__lte = date))# &
						# Q(Q(apply_upto__gte = date))
						) |
<<<<<<< HEAD
						Q(Q(apply_date__lte = date) & Q(apply_upto = None)))
					
					try:
						household_connection = scheme_data[0].household_connection
						institutional_connection = scheme_data[0].institutional_connection
						commercial_connection = scheme_data[0].commercial_connection
						public_connection = scheme_data[0].public_connection
					except:
						household_connection = 0
						institutional_connection = 0
						commercial_connection = 0 
						public_connection = 0
					
					try:
						if tariffs and tariffs[0].terif_type == 'Fixed':
							year_total_income += (((tariffs[0].estimated_paying_connection_household/100) * tariffs[0].rate_for_household * household_connection) + ((tariffs[0].estimated_paying_connection_institution/100) * tariffs[0].rate_for_institution * institutional_connection) \
							+ ((tariffs[0].estimated_paying_connection_public/100) * tariffs[0].rate_for_public * public_connection) + ((tariffs[0].estimated_paying_connection_commercial/100) * tariffs[0].rate_for_commercial * commercial_connection))
						
						elif tariffs and tariffs[0].terif_type == 'Use Based':
=======
						Q(Q(apply_date__lte = date) & Q(apply_upto = None))).last()
					
					try:
						household_connection = scheme_data.household_connection
						institutional_connection = scheme_data.institutional_connection
						commercial_connection = scheme_data.commercial_connection
						public_connection = scheme_data.public_connection
					except:
						household_connection = 0
						institutional_connection = 0
						commercial_connection = 0 
						public_connection = 0
					try:
						if tariffs and tariffs.terif_type == 'Fixed':
							year_total_income += (((tariffs.estimated_paying_connection_household/100) * tariffs.rate_for_household * household_connection) + ((tariffs.estimated_paying_connection_institution/100) * tariffs.rate_for_institution * institutional_connection) \
							+ ((tariffs.estimated_paying_connection_public/100) * tariffs.rate_for_public * public_connection) + ((tariffs.estimated_paying_connection_commercial/100) * tariffs.rate_for_commercial * commercial_connection))
						
						elif tariffs and tariffs.terif_type == 'Use Based':
>>>>>>> ams-final
							total_households = household_connection + institutional_connection +public_connection + commercial_connection
							income =  0
							rate_to_be_applied_in_next_iter = []
							for j in tariffs.used_based_units.order_by("unit_to"):
								if j.unit_from <=0:
									income += j.rate * ((j.estimated_paying_connection/100) * total_households)
									rate_to_be_applied_in_next_iter.append((j.rate * total_households))
								else:
									for z in rate_to_be_applied_in_next_iter:
										income += (j.estimated_paying_connection/100) * z
									income+= ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_households)
									rate_to_be_applied_in_next_iter.append(((j.unit_to - j.unit_from)+1) * j.rate *total_households)
							year_total_income += income
					except:
						year_total_income += 0
				data = {}
				data['date_from'] = start_date
				data['date_to'] = end_date
				data['income_amount'] = round(year_total_income, 0)
				income_list_val.append(round(year_total_income, 0))
				income_list.append(data)
			#for expected expense
			inflation_rate = OtherExpenseInflationRate.objects.filter(water_scheme=scheme).last()
			inflation_amount=0
			expense_list_val = []
			expense_list_month = []
			expected_data_list = []


			for i in year_interval:
<<<<<<< HEAD
				expense_total = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=i.start_date)& Q(apply_date__lte=i.end_date) & Q(category='Expenditure') & Q(apply_for_specific_date = True)).aggregate(Sum('yearly_expense'))
				expense_total = expense_total.get('yearly_expense__sum')
				if not expense_total:
					expense_total = 0

				one_time_cost = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date) & Q(category='Expenditure') & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))
				one_time_cost = one_time_cost.get('yearly_expense__sum')
				if not one_time_cost:
					one_time_cost = 0
				maintenance_cost = ComponentInfo.get_estimated_cost(i, scheme)
				total_expense = expense_total + maintenance_cost
=======
				#soyy-> specific date one time, yes yes
				soyy = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=i.start_date) & Q(apply_date__lte=i.end_date) & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = True))
				
				#soyn -> specific date one time, yes no
				soyn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date) & Q(category='Expenditure') & Q(apply_for_specific_date = True) & Q(one_time_cost = False))
				#sony = specific date one time, no yes
				sony = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year__in=[i.end_date.year, i.start_date.year]) & Q(category='Expenditure') & Q(apply_for_specific_date = False) & Q(one_time_cost = True))

				#sonn = specific date one time, no no
				sonn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(category='Expenditure') & Q(apply_date__lte = i.end_date) & Q(apply_for_specific_date = False) & Q(one_time_cost = False))
				expense_total = soyn | sonn | soyy | sony
				# expense_total = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=i.start_date)& Q(apply_date__lte=i.end_date) & Q(category='Expenditure') & Q(apply_for_specific_date = True)).aggregate(Sum('yearly_expense'))
				
				expense_total = expense_total.aggregate(Sum('yearly_expense'))
				expense_total = expense_total.get('yearly_expense__sum')
				if not expense_total:
					expense_total = 0
				# one_time_cost = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=i.end_date) & Q(category='Expenditure') & Q(one_time_cost = True)).aggregate(Sum('yearly_expense'))
				# one_time_cost = one_time_cost.get('yearly_expense__sum')
				# if not one_time_cost:
				# 	one_time_cost = 0
				# try:
				# 	prev = sorted(list(apply_dates))[:-1]
				# except:
				# 	prev = 0
				
				maintenance_cost, expected_data = ComponentInfo.get_estimated_cost(i, scheme)
				if expected_data:
					for x in expected_data:
						expected_data_list.append(x)
				# for ds in apply_date:
				# 	apply_dates.add(ds)
				total_expense = expense_total+ maintenance_cost
>>>>>>> ams-final
				
				try:
					_rate_inflation = inflation_rate.rate
				except:
					_rate_inflation = 0

<<<<<<< HEAD
				total_expense =total_expense*(pow(1+(_rate_inflation/100),i.year_num-1)) + one_time_cost
=======
				total_expense =total_expense*(pow(1+(_rate_inflation/100),i.year_num-1))#+ maintenance_cost#+ one_time_cost
>>>>>>> ams-final
				data = {}
				data['date_from'] = i.start_date
				data['date_to'] = i.end_date
				data['expense_amount'] = round(total_expense, 0)
				data['maintenance_cost'] = maintenance_cost
<<<<<<< HEAD
				expense_list.append(data)
=======
				expense_list_month.append(data)
>>>>>>> ams-final
				expense_list_val.append(round(total_expense, 0))
			

			expected_data_year = []
			for year in year_interval:
				start_date = year.start_date
				end_date =year.end_date

				if scheme.system_date_format == 'nep':
					start_date = str(nepali_datetime.date.from_datetime_date(start_date))
					end_date = str(nepali_datetime.date.from_datetime_date(end_date))

				total_cost =0
				for costs in expected_data_list:
					if year.year_num == costs.get('year_num'):
						if costs.get('material_cost'):
							total_cost += costs.get('material_cost') * costs.get('component_numbers')
						if costs.get('labour_cost'):
							total_cost += costs.get('labour_cost') * costs.get('component_numbers')
						if costs.get('replacement_cost'):
							total_cost += costs.get('replacement_cost') * costs.get('component_numbers')
						if costs.get('maintenance_cost'):
							total_cost += costs.get('maintenance_cost') * costs.get('component_numbers')
						
				#inflation in expected 
				total_cost_expense =total_cost*(pow(1+(_rate_inflation/100),year.year_num-1))
				data = {}
				data['date_from'] = year.start_date
				data['date_to'] = year.end_date
				data['expense_amount'] = round(total_cost_expense, 0)
				data['maintenance_cost'] = total_cost_expense
				expected_data_year.append(data)
			expense_list = []
			for d in range(scheme.period):
				final_dict = {}
				dict1 = expected_data_year[d]
				dict2 = expense_list_month[d]
				if dict1['date_from'] == dict2['date_from']:
					final_dict['date_from'] = dict1['date_from']
					final_dict['date_to'] = dict1['date_to']
					final_dict['expense_amount'] = dict1['expense_amount']+dict2['expense_amount']
					final_dict['maintenance_cost'] = dict1['maintenance_cost']+dict2['maintenance_cost']
				expense_list.append(final_dict)
				
			#for expected cf
			difference_income_expense = []
			zip_object = zip(income_list_val, expense_list_val)

			for list1_i, list2_i in zip_object:
				difference_income_expense.append(list1_i-list2_i)

			cf=[difference_income_expense[0]]
			for i in range(1,len(difference_income_expense)):
				value=cf[i-1]+difference_income_expense[i]
				cf.append(value)
			cf_list = []
			count = 0

			for i in year_interval:
				data = {}
				data['date_from'] = start_date
				data['date_to'] = end_date
				data['cf'] = cf[count]
				cf_list.append(data)
				count += 1
			data ={'expected_income':income_list,
				'expected_expense':expense_list,
				'expected_cf':cf_list}
		return Response(data, status=status.HTTP_200_OK)


class CashBookClosingMonthView(ListAPIView):
	queryset = CashBookClosingMonth.objects.all()
	serializer_class =CashBookClosingMonthSerializer
	permission_classes = [IsAuthenticated]
	def get_queryset(self):
		user = get_object_or_404(Users, id = self.request.user.id)
		return CashBookClosingMonth.objects.filter(water_scheme = user.water_scheme)

class CashBookImageView(ListAPIView):
	"""To get cashbook monthly image
	send query param as ?date=2021-02-01
	"""
	queryset = CashBookImage.objects.all()
	serializer_class =CashBookImageSerializer

	def get_queryset(self, *args, **kwargs):
		lang = self.kwargs.get('lang')
		if lang not in ('en', 'nep'):
			return Response({'error':'Language option is either en or nep'}, status = status.HTTP_403_FORBIDDEN)

		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		date = self.request.GET.get('date')
		if date:
			if scheme.system_date_format == 'nep':
				date_list = str(date).split('-')
				month_range = get_month_range(int(date_list[0]), int(date_list[1]))
				return CashBookImage.objects.filter(closing_date__water_scheme = scheme, closing_date__date__gte =month_range.get('month_start'), closing_date__date__lte = month_range.get('month_end'))
			date = datetime.datetime.strptime(str(date), '%Y-%m-%d').date()
			return CashBookImage.objects.filter(closing_date__water_scheme = scheme, closing_date__date__year =date.year, closing_date__date__month = date.month)
		return None


from .utils import diff_month

<<<<<<< HEAD
=======

>>>>>>> ams-final
class TariffListWithExpectedIncome(APIView):
	"""Tariff list with expected income"""
	def get(self, request, *args, **kwargs):
		from config_pannel.models import WaterSchemeData
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		year_interval = scheme.year_interval.all().order_by('year_num')
		this_year = datetime.datetime.today()
<<<<<<< HEAD
		year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()

		tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) & Q(
		Q(Q(apply_date__gte = year_interval.start_date) & Q(apply_date__lte = year_interval.end_date)) |
		Q(
			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto__year__gte = year_interval.start_date.year)
		) |
		Q(
			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto = None)
		))).last()

		month_diff = diff_month(tariffs.apply_date, year_interval.end_date)



		scheme_data = WaterSchemeData.objects.filter(Q(water_scheme=scheme) & Q(
		Q(Q(apply_date__gte = year_interval.start_date)&Q(apply_date__lte = year_interval.end_date)) |
		Q(
			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto__year__gte = year_interval.start_date.year)
		) |
		Q(
			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto = None)
		))).last()
		
		try:
			household_connection = scheme_data.household_connection
			institutional_connection = scheme_data.institutional_connection
			public_connection = scheme_data.public_connection
			commercial_connection = scheme_data.commercial_connection
		except:
			household_connection=institutional_connection=public_connection=commercial_connection=0

		total_connection = household_connection + institutional_connection+public_connection+commercial_connection

		other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income')).aggregate(Sum('yearly_expense'))
		other_income = other_income.get('yearly_expense__sum')
		if not other_income:
			other_income = 0

		datas = {}
		try:
			if tariffs and tariffs.terif_type == 'Fixed':
				total_income = (((tariffs.estimated_paying_connection_household/100) * tariffs.rate_for_household * household_connection) + ((tariffs.estimated_paying_connection_institution/100) * tariffs.rate_for_institution * institutional_connection)+((tariffs.estimated_paying_connection_public/100) * tariffs.rate_for_public * public_connection)+((tariffs.estimated_paying_connection_commercial/100) * tariffs.rate_for_commercial * commercial_connection))
				# total_income += other_income
				total_income = round(total_income,0)
				datas['total_income'] = total_income
				datas['estimated_paying_connection_household']=tariffs.estimated_paying_connection_household
				datas['rate_for_household']=tariffs.rate_for_household
				datas['estimated_paying_connection_institution']=tariffs.estimated_paying_connection_institution
				datas['rate_for_institution']=tariffs.rate_for_institution
				datas['estimated_paying_connection_public']=tariffs.estimated_paying_connection_public
				datas['rate_for_public']=tariffs.rate_for_public
				datas['estimated_paying_connection_commercial']=tariffs.estimated_paying_connection_commercial
				datas['rate_for_commercial']=tariffs.rate_for_commercial

				

			elif tariffs and tariffs.terif_type == 'Use Based':
				total_households = total_connection
				total_income =  0
				use_base = []
				for j in tariffs.used_based_units.all():
					income = 0
					if j.unit_from <=0:
						income += j.rate * ((j.estimated_paying_connection/100) * total_households)
					else:
						income+= ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_households)
					total_income+=income
					use_base.append({'unit_from':j.unit_from,'unit_to':j.unit_to,'estimated_paying_connection':j.estimated_paying_connection,'rate':j.rate,'income':round(income,0), 'income_total':round(income*12,0)})
				# total_income += income
				datas['use_base']=use_base
				# datas['total_income']=total_income
			else:
				total_income=0
		except:
			total_income=0
		
		datas['total_income']= (round(total_income,0) * abs(month_diff)) + other_income
=======
		try:
			year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()
			tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) & Q(
			Q(Q(apply_date__gte = year_interval.start_date) & Q(apply_date__lte = year_interval.end_date)) |
			Q(
				Q(apply_date__year__lte = year_interval.start_date.year) #& Q(apply_upto__year__gte = year_interval.start_date.year)
			) |
			Q(
				Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto = None)
			))).last()

			month_diff = diff_month(tariffs.apply_date,year_interval.start_date, year_interval.end_date)
			scheme_data = WaterSchemeData.objects.filter(Q(water_scheme=scheme) & Q(
			Q(Q(apply_date__gte = year_interval.start_date)&Q(apply_date__lte = year_interval.end_date)) |
			Q(
				Q(apply_date__year__lte = year_interval.start_date.year) #& Q(apply_upto__year__gte = year_interval.start_date.year)
			) |
			Q(
				Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto = None)
			))).last()
			
			try:
				household_connection = scheme_data.household_connection
				institutional_connection = scheme_data.institutional_connection
				public_connection = scheme_data.public_connection
				commercial_connection = scheme_data.commercial_connection
			except:
				household_connection=institutional_connection=public_connection=commercial_connection=0

			total_connection = household_connection + institutional_connection+public_connection+commercial_connection

			#soyy-> specific date one time, yes yes
			soyy = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True))
			#soyn -> specific date one time, yes no
			soyn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False))
			#sony = specific date one time, no yes
			sony = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year__in=[year_interval.end_date.year, year_interval.start_date.year]) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = True))
			#sonn = specific date one time, no no
			sonn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte = year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = False))

			# soyn_income = OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__month=month.get('month')) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False)).values('apply_date','yearly_expense')
			# soyn_month_income = 0
			# for data in soyn_income:#monthly_other_income:
			# 	soyn_month_income+= data.get('yearly_expense')
			# soyy_income =  OtherExpense.objects.filter(Q(water_scheme = scheme) &  Q(apply_date__year=month.get('year'))  & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True)).values('apply_date', 'yearly_expense')
			# soyy_month_income = 0
			# for data in soyy_income:#monthly_other_income:
			# 	soyy_month_income += data.get('yearly_expense')


			all_queries = soyy | soyn | sony | sonn

			other_income = all_queries.aggregate(Sum('yearly_expense'))
			other_income = other_income.get('yearly_expense__sum')
			if not other_income:
				other_income = 0

			# other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income')).aggregate(Sum('yearly_expense'))
			# other_income = other_income.get('yearly_expense__sum')
			# if not other_income:
			# 	other_income = 0

			datas = {}
			try:
				if tariffs and tariffs.terif_type == 'Fixed':
					total_income = (((tariffs.estimated_paying_connection_household/100) * tariffs.rate_for_household * household_connection) + ((tariffs.estimated_paying_connection_institution/100) * tariffs.rate_for_institution * institutional_connection)+((tariffs.estimated_paying_connection_public/100) * tariffs.rate_for_public * public_connection)+((tariffs.estimated_paying_connection_commercial/100) * tariffs.rate_for_commercial * commercial_connection))
					# total_income += other_income
					total_income = total_income * abs(month_diff)#+other_income
					datas['income'] = total_income#total_income * abs(month_diff)
					datas['estimated_paying_connection_household']=tariffs.estimated_paying_connection_household
					datas['rate_for_household']=tariffs.rate_for_household
					datas['estimated_paying_connection_institution']=tariffs.estimated_paying_connection_institution
					datas['rate_for_institution']=tariffs.rate_for_institution
					datas['estimated_paying_connection_public']=tariffs.estimated_paying_connection_public
					datas['rate_for_public']=tariffs.rate_for_public
					datas['estimated_paying_connection_commercial']=tariffs.estimated_paying_connection_commercial
					datas['rate_for_commercial']=tariffs.rate_for_commercial

				elif tariffs and tariffs.terif_type == 'Use Based':
					total_households = total_connection
					total_income =  0
					use_base = []
					rate_to_be_applied_in_next_iter = []
					for j in tariffs.used_based_units.order_by('unit_to'):
						income = 0
						if j.unit_from <=0:
							income += j.rate * ((j.estimated_paying_connection/100) * total_households)
							rate_to_be_applied_in_next_iter.append(j.rate * total_households)
						else:
							for z in rate_to_be_applied_in_next_iter:
								income += (j.estimated_paying_connection * z)/100
							income+= ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_households)
							rate_to_be_applied_in_next_iter.append(((j.unit_to - j.unit_from)+1) * j.rate * total_households)
						use_base.append({'unit_from':j.unit_from,'unit_to':j.unit_to,'estimated_paying_connection':j.estimated_paying_connection,'rate':j.rate,'income':round(income,0), 'income_total':round(income*abs(month_diff),0)})
					# total_income += income
					datas['use_base']=use_base
					total_income = sum([x['income_total'] for x in use_base])#+round(other_income, 0)
					datas['total_income']=total_income
				else:
					total_income=0
			except:
				total_income=0
		except:
			total_income=0
			month_diff = 0
			other_income = 0
			household_connection=public_connection=total_connection=institutional_connection=commercial_connection=0
			datas = {}
		datas['total_income']= round(total_income, 0)+other_income#(round(total_income,0) * month_diff)+ other_income #abs(month_diff)) 
>>>>>>> ams-final
		datas['household_connection']=household_connection
		datas['institutional_connection']=institutional_connection
		datas['public_connection']=public_connection
		datas['commercial_connection']=commercial_connection
		datas['total_connection']=total_connection
<<<<<<< HEAD
		datas['other_income']=other_income
		return Response(datas, status=status.HTTP_200_OK)


=======
		datas['other_income']=round(other_income, 0)
		return Response(datas, status=status.HTTP_200_OK)


# class TariffListWithExpectedIncome(APIView):
# 	"""Tariff list with expected income"""
# 	def get(self, request, *args, **kwargs):
# 		from config_pannel.models import WaterSchemeData
# 		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
# 		year_interval = scheme.year_interval.all().order_by('year_num')
# 		this_year = datetime.datetime.today()
# 		year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()

# 		tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) & Q(
# 		Q(Q(apply_date__gte = year_interval.start_date) & Q(apply_date__lte = year_interval.end_date)) |
# 		Q(
# 			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto__year__gte = year_interval.start_date.year)
# 		) |
# 		Q(
# 			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto = None)
# 		))).last()

# 		month_diff = diff_month(tariffs.apply_date,year_interval.start_date, year_interval.end_date)



# 		scheme_data = WaterSchemeData.objects.filter(Q(water_scheme=scheme) & Q(
# 		Q(Q(apply_date__gte = year_interval.start_date)&Q(apply_date__lte = year_interval.end_date)) |
# 		Q(
# 			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto__year__gte = year_interval.start_date.year)
# 		) |
# 		Q(
# 			Q(apply_date__year__lte = year_interval.start_date.year) & Q(apply_upto = None)
# 		))).last()
		
# 		try:
# 			household_connection = scheme_data.household_connection
# 			institutional_connection = scheme_data.institutional_connection
# 			public_connection = scheme_data.public_connection
# 			commercial_connection = scheme_data.commercial_connection
# 		except:
# 			household_connection=institutional_connection=public_connection=commercial_connection=0

# 		total_connection = household_connection + institutional_connection+public_connection+commercial_connection

# 		#soyy-> specific date one time, yes yes
# 		soyy = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = True))
		
# 		#soyn -> specific date one time, yes no
# 		soyn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = True) & Q(one_time_cost = False))

# 		#sony = specific date one time, no yes
# 		sony = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year__in=[year_interval.end_date.year, year_interval.start_date.year]) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = True))

# 		#sonn = specific date one time, no no
# 		sonn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte = year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = False))

# 		all_queries = soyy | soyn | sony | sonn
# 		other_income = all_queries.aggregate(Sum('yearly_expense'))
# 		other_income = other_income.get('yearly_expense__sum')
# 		if not other_income:
# 			other_income = 0



# 		# other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income')).aggregate(Sum('yearly_expense'))
# 		# other_income = other_income.get('yearly_expense__sum')
# 		# if not other_income:
# 		# 	other_income = 0

# 		datas = {}
# 		try:
# 			if tariffs and tariffs.terif_type == 'Fixed':
# 				total_income = (((tariffs.estimated_paying_connection_household/100) * tariffs.rate_for_household * household_connection) + ((tariffs.estimated_paying_connection_institution/100) * tariffs.rate_for_institution * institutional_connection)+((tariffs.estimated_paying_connection_public/100) * tariffs.rate_for_public * public_connection)+((tariffs.estimated_paying_connection_commercial/100) * tariffs.rate_for_commercial * commercial_connection))
# 				# total_income += other_income
# 				total_income = round(total_income,0)
# 				datas['total_income'] = total_income
# 				datas['estimated_paying_connection_household']=tariffs.estimated_paying_connection_household
# 				datas['rate_for_household']=tariffs.rate_for_household
# 				datas['estimated_paying_connection_institution']=tariffs.estimated_paying_connection_institution
# 				datas['rate_for_institution']=tariffs.rate_for_institution
# 				datas['estimated_paying_connection_public']=tariffs.estimated_paying_connection_public
# 				datas['rate_for_public']=tariffs.rate_for_public
# 				datas['estimated_paying_connection_commercial']=tariffs.estimated_paying_connection_commercial
# 				datas['rate_for_commercial']=tariffs.rate_for_commercial

# 			#sony = specific date one time, no yes
# 			sony = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year__in=[year_interval.end_date.year, year_interval.start_date.year]) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = True))

# 			#sonn = specific date one time, no no
# 			sonn = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte = year_interval.end_date) & Q(category='Income') & Q(apply_for_specific_date = False) & Q(one_time_cost = False))
# 			all_queries = soyy | soyn | sony | sonn
# 			other_income = all_queries.aggregate(Sum('yearly_expense'))
# 			other_income = other_income.get('yearly_expense__sum')
# 			if not other_income:
# 				other_income = 0
# 			# other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(category='Income')).aggregate(Sum('yearly_expense'))
# 			# other_income = other_income.get('yearly_expense__sum')
# 			# if not other_income:
# 			# 	other_income = 0

# 			datas = {}
# 			try:
# 				if tariffs and tariffs.terif_type == 'Fixed':
# 					total_income = (((tariffs.estimated_paying_connection_household/100) * tariffs.rate_for_household * household_connection) + ((tariffs.estimated_paying_connection_institution/100) * tariffs.rate_for_institution * institutional_connection)+((tariffs.estimated_paying_connection_public/100) * tariffs.rate_for_public * public_connection)+((tariffs.estimated_paying_connection_commercial/100) * tariffs.rate_for_commercial * commercial_connection))
# 					# total_income += other_income
# 					total_income = round(total_income,0) 
# 					datas['income'] = total_income * abs(month_diff)
# 					datas['estimated_paying_connection_household']=tariffs.estimated_paying_connection_household
# 					datas['rate_for_household']=tariffs.rate_for_household
# 					datas['estimated_paying_connection_institution']=tariffs.estimated_paying_connection_institution
# 					datas['rate_for_institution']=tariffs.rate_for_institution
# 					datas['estimated_paying_connection_public']=tariffs.estimated_paying_connection_public
# 					datas['rate_for_public']=tariffs.rate_for_public
# 					datas['estimated_paying_connection_commercial']=tariffs.estimated_paying_connection_commercial
# 					datas['rate_for_commercial']=tariffs.rate_for_commercial

					

# 				elif tariffs and tariffs.terif_type == 'Use Based':
# 					total_households = total_connection
# 					total_income =  0
# 					use_base = []
# 					rate_to_be_applied_in_next_iter = []
# 					for j in tariffs.used_based_units.all().order_by('unit_to'):
# 						income = 0
# 						if j.unit_from <=0:
# 							income += j.rate * ((j.estimated_paying_connection/100) * total_households)
# 							rate_to_be_applied_in_next_iter.append(j.rate * total_households)
# 						else:
# 							for z in rate_to_be_applied_in_next_iter:
# 								print(z, "zzzzzzzzzzz")
# 								income += (j.estimated_paying_connection * z)/100
# 							income+= ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_households)
# 							print(income, "income")
# 							rate_to_be_applied_in_next_iter.append(((j.unit_to - j.unit_from)+1) * j.rate * total_households)
# 						total_income+=income
# 						print(abs(month_diff), "month difffff")
# 						print(rate_to_be_applied_in_next_iter, "rate_to_be_applied_in_next_iter")
# 						use_base.append({'unit_from':j.unit_from,'unit_to':j.unit_to,'estimated_paying_connection':j.estimated_paying_connection,'rate':j.rate,'income':round(income,0), 'income_total':round(income*abs(month_diff),0)})
# 					# total_income += income
# 					datas['use_base']=use_base
# 					# datas['total_income']=total_income
# 				else:
# 					total_income=0
# 			except:
# 				total_income=0
# 		except:
# 			total_income=0
		
# 		datas['total_income']= (round(total_income,0) * abs(month_diff)) + other_income
# 		datas['household_connection']=household_connection
# 		datas['institutional_connection']=institutional_connection
# 		datas['public_connection']=public_connection
# 		datas['commercial_connection']=commercial_connection
# 		datas['total_connection']=total_connection
# 		datas['other_income']=other_income
# 		return Response(datas, status=status.HTTP_200_OK)


>>>>>>> ams-final

			# this_year = datetime.datetime.today()
			# year_interval = year_interval.filter(start_date__lte = this_year, end_date__gte = this_year).get()
			# months = get_month_range_in_list(year_interval, scheme.system_date_format)
					
			# #other income of month
			# other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=False) & Q(category='Income')).aggregate(Sum('yearly_expense'))
			# other_income = other_income.get('yearly_expense__sum')
			# if not other_income:
			# 	other_income = 0
			# else:
			# 	other_income = round(other_income / 12,0)

			# monthly_income = []
			# for month in months:
			# 	if scheme.system_date_format == 'nep':
			# 		month_start = month.get('month_start')
			# 		month_end = month.get('month_end')
					
			# 		#for other income calculation
			# 		monthly_other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__gte=year_interval.start_date) & Q(apply_date__lte=year_interval.end_date) & Q(apply_for_specific_date=True) & Q(category='Income')).values('apply_date','yearly_expense')
			# 		for data in monthly_other_income:
			# 			apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
			# 			data['apply_date'] = apply_date
					
			# 		monthly_other_income_list = []
			# 		for data in monthly_other_income:
			# 			monthly_other_income_list.append({'apply_date':data.get('apply_date'),'yearly_income':data.get('yearly_expense')})
					
			# 		monthly_other_income = 0
			# 		for income in monthly_other_income_list:
			# 			if income.get('apply_date') >= month_start and income.get('apply_date') <= month_end:
			# 				monthly_other_income += income.get('yearly_income')
					
			# 		#one time cost income
			# 		monthly_one_time_cost_inc = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__lte=year_interval.end_date) & Q(one_time_cost=True) & Q(category='Income')).values('apply_date','yearly_expense')
			# 		for data in monthly_one_time_cost_inc:
			# 			apply_date = get_equivalent_date(data.get('apply_date'), year_interval)
			# 			data['apply_date'] = apply_date
					
			# 		monthly_one_time_cost_inc_list = []
			# 		for data in monthly_one_time_cost_inc:
			# 			monthly_one_time_cost_inc_list.append({'apply_date':data.get('apply_date'),'yearly_income':data.get('yearly_expense')})
					
			# 		monthly_one_time_cost_inc = 0
			# 		for income in monthly_one_time_cost_inc_list:
			# 			if income.get('apply_date') >= month_start and income.get('apply_date') <= month_end:
			# 				monthly_one_time_cost_inc += income.get('yearly_income')

			# 		total_monthly_income = monthly_other_income + other_income + monthly_one_time_cost_inc
  

			# 		tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) &
			# 				Q(
			# 					Q(
			# 						Q(apply_date__lte = month.get('month_start')) &
			# 						Q(apply_upto__gte = month.get('month_start'))
			# 					) |
			# 					Q(
			# 						Q(apply_date__lte = month.get('month_start')) & Q(apply_upto = None)
			# 					)
			# 				)
			# 			)

			# 		scheme_data = scheme.water_scheme_data.filter(Q(
			# 			Q(Q(apply_date__lte = month.get('month_start'))) &
			# 			Q(Q(apply_upto__gte = month.get('month_start')))
			# 			) |
			# 			Q(Q(apply_date__lte = month.get('month_start')) & Q(apply_upto = None)))
			# 	else:
			# 		monthly_other_income = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__year=month.get('year'))& Q(apply_date__month=month.get('month')) & Q(apply_for_specific_date=True) & Q(category='Income')).aggregate(Sum('yearly_expense'))
			# 		monthly_other_income = monthly_other_income.get('yearly_expense__sum')
			# 		if not monthly_other_income:
			# 			monthly_other_income = 0

			# 		monthly_one_time_cost_inc = OtherExpense.objects.filter(Q(water_scheme = scheme) & Q(apply_date__month=month.get('month')) & Q(one_time_cost=True) & Q(category='Income')).aggregate(Sum('yearly_expense'))
			# 		monthly_one_time_cost_inc = monthly_one_time_cost_inc.get('yearly_expense__sum')
			# 		if not monthly_one_time_cost_inc:
			# 			monthly_one_time_cost_inc = 0
			# 		total_monthly_income = monthly_other_income + other_income + monthly_one_time_cost_inc

			# 		date = datetime.date(month.get('year'),month.get('month'),1)
			# 		tariffs = WaterTeriff.objects.filter(Q(water_scheme=scheme) &
			# 				Q(
			# 					Q(
			# 						Q(apply_date__lte = date) &
			# 						Q(apply_upto__gte = date)
			# 					) |
			# 					Q(
			# 						Q(apply_date__lte = date) & Q(apply_upto = None)
			# 					)
			# 				)
			# 			)

			# 		scheme_data = scheme.water_scheme_data.filter(Q(
			# 		Q(Q(apply_date__lte = date)) &
			# 		Q(Q(apply_upto__gte = date))
			# 		) |
			# 		Q(Q(apply_date__lte = date) & Q(apply_upto = None)))

					
				
			# 	try:
			# 		household_connection = scheme_data[0].household_connection
			# 		institutional_connection = scheme_data[0].institutional_connection
			# 		commercial_connection = scheme_data[0].commercial_connection
			# 		public_connection = scheme_data[0].public_connection
			# 	except:
			# 		household_connection = 0
			# 		institutional_connection = 0
			# 		commercial_connection = 0 
			# 		public_connection = 0
				
			# 	try:
			# 		if tariffs and tariffs[0].terif_type == 'Fixed':
			# 			income = (
			# 						(
			# 						  (tariffs[0].estimated_paying_connection_household/100) * tariffs[0].rate_for_household * household_connection
			# 						)+
			# 						(
			# 						  (tariffs[0].estimated_paying_connection_institution/100) * tariffs[0].rate_for_institution * institutional_connection
			# 						)+
			# 						(
			# 						  (tariffs[0].estimated_paying_connection_public/100) * tariffs[0].rate_for_public * public_connection
			# 						)+
			# 						(
			# 						  (tariffs[0].estimated_paying_connection_commercial/100) * tariffs[0].rate_for_commercial * commercial_connection
			# 						)
			# 					)
			# 			income +=total_monthly_income
			# 			monthly_income.append({'year':month.get('year'),'month':month.get('month'),'income': round(income,0)})
				
			# 		elif tariffs and tariffs[0].terif_type == 'Use Based':
			# 			total_connection = household_connection + institutional_connection+commercial_connection+public_connection
			# 			income =  0
			# 			for j in tariffs[0].used_based_units.all():
			# 				if j.unit_from <=0:
			# 					income += j.rate * ((j.estimated_paying_connection/100) * total_connection)
			# 				else:	
			# 					income+=  ((j.unit_to - j.unit_from)+1) * j.rate * ((j.estimated_paying_connection/100) * total_connection)
			# 			income += total_monthly_income
			# 			monthly_income.append({'year':month.get('year'),'month':month.get('month'),'income': round(income,0),'monthly_other_income':monthly_other_income})
			# 		else:
			# 			income = total_monthly_income
			# 	except:
			# 		income = total_monthly_income
			# 		monthly_income.append({'year':month.get('year'),'month':month.get('month'),'income': income})
<<<<<<< HEAD
				
=======


class ExpenditureTotalDateRange(APIView):
	"""
	Return previous and present month total expenditure by income category.
	To get data of different month send query param month and year as below.
	# expenditure-total/<str:lang>/<str:water_scheme_slug>/date-range/?date_from=2021-02-10, date_to=2022-02-10
	send same query param (year and month) value as in list expenditure endpoint while switching year month
	"""

	# permission_classes = [IsAuthenticated, (IsCareTaker | IsSchemeAdministrator)]
	def get(self,request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		lang = self.kwargs.get('lang')
		total_list = []
		date_from = self.request.GET.get('date_from', None)
		date_to = self.request.GET.get('date_to', None)

		if scheme.system_date_format == 'nep':
			if date_from:
				date_from = convert_nep_date_to_english(date_from)
			if date_to:
				date_to = convert_nep_date_to_english(date_to)

		if date_from or date_to:
			if date_from and date_to:
				total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=date_from, date__lte = date_to).aggregate(total_expense=Sum('income_amount'))
			elif date_from and not date_to:
				total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date=date_from).aggregate(total_expense=Sum('income_amount'))
			else:
				total =  Expenditure.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug')).aggregate(total_expense=Sum('income_amount'))

		try:
			total_expense = total.get('total_expense')
			splits_from = str(date_from).split('-')
			splits_to = str(date_to).split('-')
			month_from = splits_from[1]
			day_from = splits_from[2]
			month_to = splits_to[1]
			day_to = splits_to[2]
			total_list.append({"total_expense":round(total_expense),"month_from":month_from, "day_from":day_from, "month_to":month_to, "day_to":day_to})
		except Exception as e:
			total_list.append(str(e))
		return Response(total_list, status=status.HTTP_200_OK)



class IncomeTotalDateRange(APIView):

	"""
	Will return total of income amount in date range
	# income-total/<str:lang>/<str:water_scheme_slug>/date-range/?date_from=2021-02-10, date_to=2022-02-10
	send same query param (year and month) value as in list expenditure endpoint while switching year month
	"""

	# permission_classes = [IsAuthenticated, (IsCareTaker | IsSchemeAdministrator)]
	def get(self,request, *args, **kwargs):
		scheme = get_object_or_404(WaterScheme, slug = self.kwargs.get('water_scheme_slug'))
		lang = self.kwargs.get('lang')
		date_from = self.request.GET.get('date_from', None)
		date_to = self.request.GET.get('date_to', None)
		total_list = []
		if scheme.system_date_format == 'nep':
			if date_from:
				date_from = convert_nep_date_to_english(date_from)
			if date_to:
				date_to = convert_nep_date_to_english(date_to)

		if date_from or date_to:
			if date_from and date_to:
				total =  Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date__gte=date_from, date__lte = date_to).aggregate(total_income=Sum('income_amount'))
			elif date_from and not date_to:
				total =  Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug'), date=date_from).aggregate(total_income=Sum('income_amount'))
			else:
				total =  Income.objects.filter(category__water_scheme__slug = self.kwargs.get('water_scheme_slug')).aggregate(total_income=Sum('income_amount'))
		
		try:
			total_income = total.get('total_income')
			splits_from = str(date_from).split('-')
			splits_to = str(date_to).split('-')
			month_from = splits_from[1]
			day_from = splits_from[2]
			month_to = splits_to[1]
			day_to = splits_to[2]
			total_list.append({"total_income":round(total_income),"month_from":month_from, "day_from":day_from, "month_to":month_to, "day_to":day_to})
		except Exception as e:
			total_list.append(str(e))
		return Response(total_list, status=status.HTTP_200_OK)
>>>>>>> ams-final
