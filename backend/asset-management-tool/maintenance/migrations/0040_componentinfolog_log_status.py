# Generated by Django 3.1.7 on 2022-05-18 06:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0039_auto_20220516_1717'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentinfolog',
            name='log_status',
            field=models.BooleanField(default=False),
        ),
    ]
