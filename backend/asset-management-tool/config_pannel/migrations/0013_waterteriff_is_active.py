# Generated by Django 3.1.7 on 2021-09-01 05:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0012_supplybelts_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='waterteriff',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]