# Generated by Django 3.1.7 on 2022-05-19 15:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0042_componentinfoimage_component'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='componentinfolog',
            name='component_image',
        ),
    ]
