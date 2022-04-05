from django.db import models as m
from config_pannel.models import *
from asset_management_system.utils import english_to_nepali_converter
from maintenance.models import ComponentInfoLog
import os
from django.db.models.signals import post_save
from django.dispatch import receiver
import nepali_datetime
# Create your models here.

class IncomeCategory(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='income_category_schemas')
	name = m.CharField(max_length=50)

	def __str__(self):
		return f"{self.name}-{self.water_scheme.scheme_name}"

class ExpenseCategory(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='expense_category_schemas')
	name = m.CharField(max_length=50)

	def __str__(self):
		return f"{self.name}-{self.water_scheme.scheme_name}"

class Income(m.Model):
	category = m.ForeignKey(IncomeCategory, on_delete = m.PROTECT, related_name='income_category')
	date = m.DateField()
	date_np = m.CharField(null=True, blank=True, max_length=12)
	title = m.CharField(max_length=150)
	income_amount = m.FloatField()
	water_supplied = m.FloatField(null=True, blank=True)
	closed_date = m.DateField(null = True, blank=True)
	created_at = m.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.title}-{self.category.water_scheme.scheme_name}"

	@property
	def date_nep(self):
		return english_to_nepali_converter(str(self.date_np))
	
class Expenditure(m.Model):
	category = m.ForeignKey(ExpenseCategory, on_delete = m.PROTECT, related_name='expenditure_category')
	date = m.DateField()
	date_np = m.CharField(null=True, blank=True, max_length=12)
	title = m.CharField(max_length=150)
	income_amount = m.FloatField()
	labour_cost = m.FloatField(blank=True, null=True)
	consumables_cost = m.FloatField(blank=True, null=True)
	replacement_cost = m.FloatField(blank=True, null=True)
	remarks = m.CharField(max_length=250, null=True, blank=True)
	closed_date = m.DateField(null = True, blank=True)
	maintenance_expense = m.OneToOneField(ComponentInfoLog, on_delete = m.CASCADE, null=True, blank=True, related_name='maintenance_log_expense')
	created_at = m.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.title}-{self.category.water_scheme.scheme_name}"

@receiver(post_save, sender=ComponentInfoLog)
def create_expense(sender, instance, **kwargs):
    expense_cat = ExpenseCategory.objects.get_or_create(water_scheme = instance.component.component.category.water_scheme, name = 'Maintenance')
    if Expenditure.objects.filter(maintenance_expense_id=instance.id).exists():
    	labour_cost = instance.labour_cost
    	if not labour_cost:
    		labour_cost = 0
    	
    	material_cost = instance.material_cost
    	if not material_cost:
    		material_cost = 0
    	
    	replacement_cost = instance.replacement_cost
    	if not replacement_cost:
    		replacement_cost = 0
    	total_cost = instance.cost_total + replacement_cost + material_cost + labour_cost
    	Expenditure.objects.filter(maintenance_expense_id = instance.id).update(
	    	date=instance.maintenance_date,
	    	date_np = nepali_datetime.date.from_datetime_date(instance.maintenance_date),
	    	title = instance.maintenance_action,
	    	income_amount = total_cost,
	    	)
    else:
    	labour_cost = instance.labour_cost
    	if not labour_cost:
    		labour_cost = 0
    	
    	material_cost = instance.material_cost
    	if not material_cost:
    		material_cost = 0
    	
    	replacement_cost = instance.replacement_cost
    	if not replacement_cost:
    		replacement_cost = 0
    	total_cost = instance.cost_total + replacement_cost + material_cost + labour_cost
    	Expenditure.objects.create(category=expense_cat[0],
			date=instance.maintenance_date,
			date_np = nepali_datetime.date.from_datetime_date(instance.maintenance_date),
			title = instance.maintenance_action,
			income_amount = total_cost,
			maintenance_expense= instance
			)



class TestParameters(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='test_parameter_schemas')
	parameter_name = m.CharField(max_length=50)
	test_unit = m.CharField(max_length=50)
	standard = m.CharField(max_length=50)

	def __str__(self):
		return f"{self.parameter_name}-{self.water_scheme.scheme_name}"

class TestQuality(m.Model):
	date_from = m.DateField()
	date_to = m.DateField(null=True, blank=True)
	is_daily =m.BooleanField()
	test_parameter = m.ManyToManyField(TestParameters, related_name='test_parameter')

	def __str__(self):
		return f"{str(self.date_from)}"


class CashBookClosingMonth(m.Model):
	water_scheme = m.ForeignKey(WaterScheme, on_delete = m.CASCADE, related_name='cash_book_image')
	date = m.DateField()

def assetComponentLogFolder(instance, filename):
	return os.path.join("finance", instance.closing_date.water_scheme.slug, filename)


class CashBookImage(m.Model):
	closing_date = m.ForeignKey(CashBookClosingMonth, on_delete = m.CASCADE, related_name='cashbook_image')
	image = m.ImageField(null = True, blank=True, upload_to = assetComponentLogFolder)
	class Meta:
		verbose_name = "Cash Book Image"
		verbose_name_plural = "Cash Book Images"

	def __str__(self):
		return str(self.closing_date.date)
