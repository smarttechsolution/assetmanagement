# Generated by Django 3.1.7 on 2022-02-08 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0030_auto_20220208_0543'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentinfo',
            name='is_cost_seggregated',
            field=models.BooleanField(default=False),
        ),
    ]
