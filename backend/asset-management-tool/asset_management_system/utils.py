import re
from django.utils.text import slugify
import datetime
import nepali_datetime
import calendar

def get_unique_slug(model_instance, slugable_field_name, slug_field_name):
    """
    Takes a model instance, sluggable field name (such as 'title') of that
    model as string, slug field name (such as 'slug') of the model as string;
    returns a unique slug as string.
    """
    slug = slugify(getattr(model_instance, slugable_field_name))
    unique_slug = slug
    extension = 1
    ModelClass = model_instance.__class__
 
    while ModelClass._default_manager.filter(
        **{slug_field_name: unique_slug}
    ).exists():
        unique_slug = '{}-{}'.format(slug, extension)
        extension += 1
 
    return unique_slug


# english to devanagari number maping in dict
english_devanagari_number = {'1': '१',
                             '2': '२',
                             '3': '३',
                             '4': '४',
                             '5': '५',
                             '6': '६',
                             '7': '७',
                             '8': '८',
                             '9': '९',
                             '0': '०',
                             '-': '-',
                             ',': ',',
                             '.': '.'}

# english number to nepali number unicode_ conversion
def english_to_nepali_converter(num_string):
    '''
    takes english date as input

    '''
    character_list = []
    for char in str(num_string):
        try:
            character_list.append(english_devanagari_number[char])
        except:
            character_list.append('')
    nepali_number_is = ''.join(character_list)
    return nepali_number_is


def get_week_day():
    """Return current week start and end date."""
    import datetime
    date = datetime.date.today()
    start_week = date - datetime.timedelta(date.weekday())
    end_week = start_week + datetime.timedelta(7)
    return {'start':start_week,'end':end_week}

def nep_to_eng_full_date(nep_full_date):
    '''Takes input as nepali date(B.S) and conver to english date(A.D)'''
    date_list = nep_full_date.split('-')
    full_eng_date = nepali_datetime.date(int(date_list[0]), int(date_list[1]), int(date_list[2])).to_datetime_date()
    return full_eng_date

from datetime import datetime

def convert_to_nepali_full_date(date_en):
    date = datetime.strptime(str(date_en), '%Y-%m-%d').date()
    date = str(nepali_datetime.date.from_datetime_date(date))
    return date

