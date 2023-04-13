from config_pannel.models import WaterScheme
from django.shortcuts import get_object_or_404
import nepali_datetime
from datetime import timedelta


def get_water_scheme(slug):
	'''Return scheme objects is the object with given slug exists.'''
	return get_object_or_404(WaterScheme, slug = slug)


def get_month_range(year,month):
	'''Return english (A.D) month respective first and last day in B.S format.'''

	if month == 12:
		month_plus_one = 1
		year_plus_one = year + 1
	else:
		month_plus_one = month + 1
		year_plus_one = year

	month_start = nepali_datetime.date(year,month,1).to_datetime_date()
	month_end = nepali_datetime.date(year_plus_one, month_plus_one,1).to_datetime_date() - timedelta(days=1)
	return {'month_start':month_start, 'month_end':month_end}


def get_prev_year_month(year,month):
	'''Return previous month of given month for A.D'''
	prev_month = month-1
	prev_year=year
	if prev_month == 0:
		prev_month = 12
		prev_year = year-1
	return {'prev_month':prev_month, 'prev_year':prev_year}

def get_prev_year_month_np(year,month):
	'''Return previous month first and last day of given month in B.S(Nepali) format.'''
	prev_month = month-1
	prev_year=year
	if prev_month == 0:
		prev_month = 12
		prev_year = year-1
	return get_month_range(prev_year, prev_month)


def str_to_datetime(date):
	'''Convert str date to datetime'''
	import datetime
	return datetime.datetime.strptime(date, "%Y-%m-%d").date()


def get_month_range_in_list(year_interval,date_format):
	'''Return months list for respective year interval'''

	import calendar
	from datetime import datetime
	date1 = year_interval.start_date
	date2 = year_interval.end_date
	if date_format == 'en':
		# date1 = date1.replace(day = date1.day)
		# date2 = date2.replace(day = date2.day)
		months = []
		while date1 < date2:
			month = date1.month
			year  = date1.year
			months.append({'year':year,'month':month})
			next_month = month+1 if month != 12 else 1
			next_year = year + 1 if next_month == 1 else year
			date1 = date1.replace( month = next_month, year= next_year)

		if len(months) == 11: 
			months.append({'year':date1.year,'month':date1.month})
		return months
	else:
		date1_np = nepali_datetime.date.from_datetime_date(date1)
		date2_np = nepali_datetime.date.from_datetime_date(date2)
		if date1_np.day>=30:
			date1_np = date1_np.replace(day = 29)
		if date2_np.day>=30:
			date2_np = date2_np.replace(day = 29)
		months = []
		# try:
		while date1_np < date2_np:
			month = date1_np.month
			year  = date1_np.year
			month_range = get_month_range(year, month)
			months.append({'month_start':month_range.get('month_start'),'month_end':month_range.get('month_end'),'month':month, 'year':year})
			next_month = int(month)+1 if int(month) != 12 else 1
			next_year = int(year) + 1 if int(next_month) == 1 else int(year)
			date1_np = date1_np.replace( month = next_month, year= next_year)
		if len(months) == 11:
			month=date1_np.month
			year=date1_np.year
			month_range = get_month_range(year, month)
			months.append({'month_start':month_range.get('month_start'),'month_end':month_range.get('month_end'),'month':month, 'year':year})
		return months
		# except:
			# return months


def convert_nep_date_to_english(date_nep):
	'''Return english date for nepali date'''

	date_list = str(date_nep).split('-')
	date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
	date_en = date_nep.to_datetime_date()
	return date_en

def default_income_category(scheme, data):
	if scheme.system_date_format == 'nep':
		if data == 'Water Sales':
			return 'पानी बिक्री'
	return data

def default_expense_category(scheme, data):
	if scheme.system_date_format == 'nep':
		if data == 'Maintenance':
			return 'मर्मतसम्भार'
	return data

def get_equivalent_date(date, year_interval):
	month = str_to_datetime(str(date))
	if month.month in (range(year_interval.start_date.month+1,13)):
		year = year_interval.start_date.year
	else:
		year = year_interval.end_date.year
	date = str(year) +'-' +str(month.month) +'-' +str(month.day)
	return str_to_datetime(date)


def diff_month(d1, d2, d3):
	from datetime import datetime
	if d2 >= d1:
		return 12
	return (d1.year - d3.year) * 12 + d1.month - d3.month