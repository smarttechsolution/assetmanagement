# Generated by Django 3.1.7 on 2022-02-15 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config_pannel', '0053_auto_20220210_0928'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificationperiod',
            name='maintenance_notify_after',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='notificationperiod',
            name='maintenance_notify_before',
            field=models.IntegerField(default=0),
        ),
    ]
