# Generated by Django 3.1.7 on 2021-09-08 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0016_auto_20210905_0833'),
    ]

    operations = [
        migrations.AddField(
            model_name='waterscheme',
            name='daily_target',
            field=models.FloatField(default=0),
        ),
    ]
