# Generated by Django 3.1.7 on 2021-10-04 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0022_auto_20211004_1002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='componentinfo',
            name='next_action',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='componentinfo',
            name='next_action_np',
            field=models.CharField(blank=True, max_length=13, null=True),
        ),
    ]
