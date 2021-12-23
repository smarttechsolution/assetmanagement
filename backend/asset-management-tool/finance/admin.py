from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register([IncomeCategory, ExpenseCategory, Income, Expenditure, CashBookClosingMonth,CashBookImage])