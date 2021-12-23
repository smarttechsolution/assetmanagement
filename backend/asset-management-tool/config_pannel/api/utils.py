import datetime
import nepali_datetime
from datetime import timedelta

def str_to_datetime(date):
	"""Convert str date to datetime"""
	
	return datetime.datetime.strptime(str(date), "%Y-%m-%d").date()

def get_month_range(year,month):
	'''Accept year and month and return full date month start and month end'''
	
	month_start = nepali_datetime.date(year,month,1).to_datetime_date()
	month_end = nepali_datetime.date(year,month+1,1).to_datetime_date() - timedelta(days=1)
	print(month_start, month_end)
	return {'month_start':month_start, 'month_end':month_end}


def apply_date_validation(apply_date,tool_start_date):
	'''Return True if apply date is grater than tool start date'''

	if apply_date > tool_start_date:
		return True
	return False


def convert_nep_date_to_english(date_nep):
	'''Return english date for nepali date'''

	date_list = str(date_nep).split('-')
	date_nep =  nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2]))
	date_en = date_nep.to_datetime_date()
	return date_en
