import datetime
import calendar
import nepali_datetime

def str_to_datetime(date):
    '''Return date by converting str date'''
    return datetime.datetime.strptime(str(date), "%Y-%m-%d").date()

def add_months(date, months):
    '''Add month to date and retun new date.'''
    months_count = date.month + months

    # Calculate the year
    year = date.year + int(months_count / 12)

    # Calculate the month
    month = (months_count % 12)
    if month == 0:
        month = 12

    # Calculate the day
    day = date.day
    last_day_of_month = calendar.monthrange(year, month)[1]
    if day > last_day_of_month:
        day = last_day_of_month

    new_date = datetime.date(year, month, day)
    return new_date



from datetime import date
def add_year(startDate, num_year):
	# reconstruct date fully
	endDate = date(startDate.year + num_year, startDate.month, startDate.day)
	# replace year only
	endDate = startDate.replace(startDate.year + num_year)
	return endDate

def add_nep_month(nep_date, interval):
    import nepali_datetime
    date_list = str(nep_date).split('-')
    month = int(interval) + int(date_list[1])
    if month > 12:
        month = 12
    date_nep =  nepali_datetime.date(int(date_list[0]), month, int(date_list[2]))
    return date_nep


def add_nep_year(nep_date, interval):
    import nepali_datetime
    date_list = str(nep_date).split('-')
    year = int(date_list[0]) + int(interval)
    date_nep =  nepali_datetime.date(year,int(date_list[1]),int(date_list[2]))
    return date_nep




def add_month_to_date(date,month, date_format):
    from datetime import datetime, timedelta
    from dateutil.relativedelta import relativedelta
    date_after_month = date + relativedelta(months=month)
    if date_format == 'nep':
        return nepali_datetime.date.from_datetime_date(date_after_month)
    return date_after_month

def add_days_to_date(date,days,date_format):
    from datetime import datetime, timedelta
    from dateutil.relativedelta import relativedelta

    date = datetime.strptime(str(date), "%Y-%m-%d")
    date_days = date + timedelta(days=days)
    if date_format == 'nep':
        return nepali_datetime.date.from_datetime_date(date_days.date())
    return date_days.date()
