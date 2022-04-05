from calendar import c
from django.db import models as m
from django.db import models
from django.utils.translation import gettext_lazy as _
from asset_management_system.utils import get_unique_slug
from django.db.models import Sum, Avg
import nepali_datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from config_pannel.api.utils import str_to_datetime
# Create your models here.


class WaterScheme(m.Model):
	class Types(m.TextChoices):
		ENGLISH = 'en','ENGLISH-AD'
		NEPALI = 'nep','NEPALI-BS'

	scheme_name = m.CharField(_("Name of Water Scheme"), max_length = 250, unique=True)
	water_source = m.CharField(max_length=200, null=True, blank=True)
	slug = m.CharField(max_length=250, unique=True)
	location = m.CharField(_("Scheme Location"), max_length = 250)
	system_built_date = m.DateField(blank=True, null=True)
	longitude = m.FloatField(blank=True, null=True)
	latitude = m.FloatField(blank=True, null=True)
	daily_target = m.FloatField(default=0)
	tool_start_date = m.DateField()
	period = m.IntegerField()
	system_date_format = m.CharField(choices=Types.choices, max_length=50)
	currency=m.CharField(max_length=20, default='Rs')

	def save(self,force_insert=False, force_update=False, *args, **kwargs):
		if not self.slug:
			self.slug = get_unique_slug(self, 'scheme_name', 'slug')
		super().save(force_insert, force_update,*args, **kwargs)

	def __str__(self):
		return self.scheme_name

	def get_np_tool_start_date(self):
		return nepali_datetime.date.from_datetime_date(self.tool_start_date)

	def get_tool_start_date(self):
		if self.monthly_account_mgmt == 'en':
			return self.tool_start_date
		return self.get_np_tool_start_date

	@property
	def household_connection_total(self):
		if self.water_scheme_data.all().exists():
			import datetime
			today_date = datetime.date.today()
			return self.water_scheme_data.filter(apply_date__lte=today_date).last().household_connection
		return 0

	@property
	def commercial_connection_total(self):
		if self.water_scheme_data.all().exists():
			import datetime
			today_date = datetime.date.today()
			return self.water_scheme_data.filter(apply_date__lte=today_date).last().commercial_connection
		return 0

	@property
	def public_connection_total(self):
		if self.water_scheme_data.all().exists():
			import datetime
			today_date = datetime.date.today()
			return self.water_scheme_data.filter(apply_date__lte=today_date).last().public_connection
		return 0
	
	@property
	def institutional_connection_total(self):
		if self.water_scheme_data.all().exists():
			import datetime
			today_date = datetime.date.today()
			return self.water_scheme_data.filter(apply_date__lte=today_date).last().institutional_connection
		return 0
		

class YearsInterval(m.Model):
	scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='year_interval')
	start_date = m.DateField()
	end_date = m.DateField()
	year_num = m.IntegerField()

	class Meta:
	    verbose_name = "Year Interval"
	    verbose_name_plural = "Year Intervals"

	def __str__(self):
	    return f"{self.scheme.scheme_name}"

	@property
	def is_present_year(self):

		import datetime
		today_date = datetime.date.today()
		if self.start_date < today_date and self.end_date > today_date:
			return True
		else:
			return False

	def get_np_start_date(self):
		return nepali_datetime.date.from_datetime_date(self.start_date)

	def get_np_end_date(self):
		return nepali_datetime.date.from_datetime_date(self.end_date)

	def get_start_date(self):
		if self.scheme.monthly_account_mgmt == 'en':
			return self.start_date
		return self.get_np_start_date

	def get_end_date(self):
		if self.scheme.monthly_account_mgmt == 'en':
			return self.end_date
		return self.get_np_end_date


@receiver(post_save, sender=WaterScheme)
def create_years_interval(sender, instance, created, **kwargs):
	'''Signal to create year interval by default when water scheme is created'''
	# if created:

	# condtn1 = YearsInterval.objects.filter(scheme_id=instance.id).count()
	# condtn2 = YearsInterval.objects.filter(start_date=instance.tool_start_date, scheme_id=instance.id).exists()
	# if not (condtn1 == instance.period or condtn2):
	instance.year_interval.all().delete()
	startDate = str_to_datetime(instance.tool_start_date)
	year_num = 1
	for i in range(instance.period):
		from datetime import date
		from datetime import timedelta
		# reconstruct date fully
		year = startDate.year
		month = startDate.month
		day = startDate.day
		endDate = date(year + 1, month, day)
		endDate = endDate - timedelta(days = 1)
		# replace year only
		# endDate = startDate.replace(startDate.year + 1)
		YearsInterval.objects.create(scheme_id=instance.id, start_date = startDate, end_date =endDate, year_num=year_num)
		startDate = endDate + timedelta(days=1)
		year_num +=1
	from finance.models import IncomeCategory,ExpenseCategory
	IncomeCategory.objects.get_or_create(water_scheme = instance, name = 'Water Sales')
	ExpenseCategory.objects.get_or_create(water_scheme = instance, name = 'Maintenance')
		


class WaterSchemeData(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='water_scheme_data')
	household_connection = m.IntegerField(_("Number of Households"))
	public_connection = m.IntegerField(_("Number of public Population"))
	commercial_connection = m.IntegerField(_("Number of Public Taps"))
	institutional_connection = m.IntegerField()
	apply_date = m.DateField()
	apply_upto = m.DateField(null = True, blank=True)

	class Meta:
		ordering = ['apply_date']

	def __str__(self):
		return f"{str(self.household_connection)}-{self.water_scheme.scheme_name}"

# class WaterSource(m.Model):
# 	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='water_source')
# 	name = m.CharField(_("Water Source Name"), max_length = 250)

# 	def __str__(self):
# 		return f"{self.water_scheme.scheme_name}"



class MinimumUnitRange(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='minimum_unit')
	lower_unit =  m.IntegerField()
	higher_unit = m.IntegerField()

	def __str__(self):
		return f"{self.water_scheme.water_scheme}"


class WaterSupplySchedule(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='water_supply_schedule')
	day = m.CharField(max_length=40)
	time_from = m.TimeField()
	time_to = m.TimeField()
	
	def __str__(self):
		return f"{str(self.day)}-{self.water_scheme.scheme_name}"

class WaterTeriff(m.Model):
	class Types(m.TextChoices):
		USE = 'Use Based','USE BASED'
		FIXED = 'Fixed','FIXED'

	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='water_terrif')
	terif_type = m.CharField(max_length=50, choices=Types.choices)
	rate_for_institution =m.FloatField(null=True, blank=True)
	rate_for_household =m.FloatField(null=True, blank=True)
	rate_for_public =m.FloatField(null=True, blank=True)
	rate_for_commercial =m.FloatField(null=True, blank=True)
	apply_date = m.DateField()
	apply_upto = m.DateField(null=True, blank=True)
	estimated_paying_connection_household = m.FloatField(null=True, blank=True)
	estimated_paying_connection_institution = m.FloatField(null=True, blank=True)
	estimated_paying_connection_public = m.FloatField(null=True, blank=True)
	estimated_paying_connection_commercial = m.FloatField(null=True, blank=True)

	is_active = m.BooleanField(default=False)

	class Meta:
		ordering = ['apply_date']
	def __str__(self):
		return f"{str(self.terif_type)}-{self.water_scheme.scheme_name}-{str(self.apply_date)}"

class UseBasedUnitRange(m.Model):
	tariff = m.ForeignKey(WaterTeriff, on_delete=m.CASCADE, related_name='used_based_units')
	unit_from = m.IntegerField()
	unit_to = m.IntegerField()
	rate = m.FloatField()
	estimated_paying_connection = m.FloatField()

	def __str__(self):
		return f"{self.tariff.water_scheme.scheme_name}-{str(self.unit_to)}"
		
class WaterSupplyRecord(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='water_supply_record')
	supply_date = m.DateField()
	supply_date_np = m.CharField(max_length=13)
	total_supply = m.FloatField()
	# estimated_household = m.IntegerField()
	# estimated_beneficiaries = m.IntegerField()
	is_daily = m.BooleanField(default=False)
	created_at = m.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{str(self.supply_date)}-{self.water_scheme.scheme_name}"

class QualityTestParameter(m.Model):
	class Types(m.TextChoices):
		CHEMICAL = 'Chemical','CHEMICAL'
		OTHER = 'Other','OTHER'
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='quality_test_parameter')
	parameter_name = m.CharField(max_length=50)
	unit = m.CharField(max_length=50)
	types = m.CharField(max_length=50, choices=Types.choices, default='Other')
	NDWQS_standard = m.CharField(max_length=50, null=True, blank=True)

	def __str__(self):
		return f"{str(self.parameter_name)}-{self.water_scheme.scheme_name}"

class WaterTestResults(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='water_test_results')
	date = m.DateField()
	date_np = m.CharField(max_length=13)
	created_at = m.DateTimeField(auto_now_add=True)

class WaterTestResultParamters(m.Model):
	test_result = m .ForeignKey(WaterTestResults, on_delete = m.CASCADE, related_name='test_result_parameter')
	parameter = m.ForeignKey(QualityTestParameter, on_delete = m.PROTECT, related_name='test_parameters')
	value = m.FloatField()


class OtherExpense(m.Model):
	class Category(m.TextChoices):
		INCOME = 'Income','Income'
		EXPENDITURE = 'Expenditure','Expenditure'

	category = m.CharField(max_length=50, choices=Category.choices)
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='other_expense_scheme')
	title = m.CharField(max_length=50)
	yearly_expense = m.FloatField()
	apply_date = m.DateField()
	apply_for_specific_date = m.BooleanField(default=False)
	one_time_cost = m.BooleanField(default=False)


	class Meta:
		ordering = ['apply_date']

	def __str__(self):
		return self.title

class OtherExpenseInflationRate(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='inflation_parameter')
	rate = m.FloatField(default = 0)
	dis_allow_edit = m.BooleanField(default=False)

	def __str__(self):
		return str(self.rate)

class NotificationPeriod(m.Model):
	"""Model definition for NotificationPeriod."""

	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='notification_period')
	initial_date = m.DateField()
	last_income_push = m.DateField(null=True, blank=True)
	last_expense_push = m.DateField(null=True, blank=True)
	last_test_result_push = m.DateField(null=True, blank=True)
	last_water_record_push = m.DateField(null=True, blank=True)
	income_notification_period = m.IntegerField(default=30)
	expenditure_notification_period = m.IntegerField(default=30)
	test_result_notification_period = m.IntegerField(default=30)
	supply_record_notification_period = m.IntegerField(default=30)
	maintenance_notify_before = m.IntegerField(default=0)
	maintenance_notify_after = m.IntegerField(default=0)
	
	# def save(self, *args, **kwargs):
	# 	if not self.id:
	# 		if NotificationPeriod.objects.filter(water_scheme=self.water_scheme).exists():
	# 			raise ValueError("This model has already its record.")
	# 		else:
	# 			super().save(*args, **kwargs)
	# 	super().save(*args, **kwargs)

	class Meta:
		"""Meta definition for NotificationPeriod."""
		verbose_name = 'Notification Period'
		verbose_name_plural = 'Notification Periods'

	def __str__(self):
		"""Unicode representation of NotificationPeriod."""
		return str(self.initial_date)

class NotificationStore(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='notification_msg')
	created_date = m.DateTimeField(auto_now_add=True)
	title = m.CharField(max_length=50)
	title_np = m.CharField(max_length=50)
	message = m.CharField(max_length = 250)
	message_np = m.CharField(max_length = 250)
	notf_type = m.CharField(max_length=50, default='cashbook')

	def __str__(self):
		return self.title
