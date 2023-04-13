# Generated by Django 3.1.7 on 2021-08-25 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0008_watersupplyrecord_supply_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='waterscheme',
            name='beneficiary_household',
            field=models.IntegerField(blank=True, null=True, verbose_name='Number of Households'),
        ),
        migrations.AlterField(
            model_name='waterscheme',
            name='beneficiary_population',
            field=models.IntegerField(blank=True, null=True, verbose_name='Number of Benfficiary Population'),
        ),
        migrations.AlterField(
            model_name='waterscheme',
            name='institutional_connection',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='waterscheme',
            name='public_taps',
            field=models.IntegerField(blank=True, null=True, verbose_name='Number of Public Taps'),
        ),
        migrations.AlterField(
            model_name='waterscheme',
            name='system_built_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='waterscheme',
            name='system_operation_from',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='waterscheme',
            name='system_operation_to',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]