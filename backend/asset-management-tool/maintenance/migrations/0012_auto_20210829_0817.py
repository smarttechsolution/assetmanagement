# Generated by Django 3.1.7 on 2021-08-29 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0011_auto_20210824_0703'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentinfo',
            name='labour_cost',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='componentinfo',
            name='material_cost',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='componentinfo',
            name='replacement_cost',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
