# Generated by Django 3.1.7 on 2022-05-11 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0035_auto_20220511_1405'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentinfolog',
            name='interval_unit',
            field=models.CharField(blank=True, choices=[('Day', 'Day'), ('Month', 'Month'), ('Year', 'Year')], max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='componentinfolog',
            name='duration',
            field=models.IntegerField(),
        ),
    ]
