# Generated by Django 3.1.7 on 2021-09-16 06:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0024_auto_20210915_0906'),
    ]

    operations = [
        migrations.RenameField(
            model_name='waterscheme',
            old_name='monthly_account_mgmt',
            new_name='system_date_format',
        ),
    ]