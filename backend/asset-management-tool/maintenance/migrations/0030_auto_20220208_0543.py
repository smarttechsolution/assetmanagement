# Generated by Django 3.1.7 on 2022-02-08 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0029_auto_20220207_0702'),
    ]

    operations = [
        migrations.AlterField(
            model_name='componentinfo',
            name='maintenance_cost',
            field=models.FloatField(blank=True, null=True),
        ),
    ]