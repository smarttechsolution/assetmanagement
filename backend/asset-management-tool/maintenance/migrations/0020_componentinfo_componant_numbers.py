# Generated by Django 3.1.7 on 2021-10-03 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0019_auto_20210920_0540'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentinfo',
            name='componant_numbers',
            field=models.IntegerField(default=1),
        ),
    ]